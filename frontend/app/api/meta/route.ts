import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
export const runtime = 'edge';

// キャッシュの設定
export const revalidate = 3600; // 1時間キャッシュ

// エンコーディング検出関数
function detectEncoding(url: string, contentType: string | null): string {
  // Content-Typeヘッダーからcharsetを取得
  if (contentType) {
    const charsetMatch = contentType.match(/charset=([^;]+)/i);
    if (charsetMatch) {
      return charsetMatch[1].toLowerCase();
    }
  }

  // サイト固有のエンコーディング設定
  const siteEncodings: Record<string, string> = {
    'itmedia.co.jp': 'shift_jis',
    'nikkei.com': 'shift_jis',
    'sankei.com': 'shift_jis',
    'mainichi.jp': 'shift_jis',
    'yomiuri.co.jp': 'shift_jis',
    'asahi.com': 'shift_jis'
  };

  // URLのドメインをチェック
  try {
    const domain = new URL(url).hostname;
    for (const [siteDomain, encoding] of Object.entries(siteEncodings)) {
      if (domain.includes(siteDomain)) {
        return encoding;
      }
    }
  } catch {
    // URL解析に失敗した場合はデフォルトを使用
  }

  // デフォルトはUTF-8
  return 'utf-8';
}

// YouTube動画URL判定機能（動画以外を除外）
function isYouTubeVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    
    // 対応するYouTubeドメインかチェック
    const isYouTubeDomain = [
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtu.be',
      'music.youtube.com'
    ].includes(domain);
    
    if (!isYouTubeDomain) {
      return false;
    }
    
    // youtu.beの場合（短縮URL）
    if (domain === 'youtu.be') {
      // パス形式: /VIDEO_ID または /VIDEO_ID?params
      return pathname.length > 1 && !pathname.includes('/');
    }
    
    // youtube.comの場合
    if (domain.includes('youtube.com')) {
      // /watch?v=VIDEO_ID 形式
      if (pathname === '/watch' && searchParams.has('v')) {
        return true;
      }
      
      // /embed/VIDEO_ID 形式
      if (pathname.startsWith('/embed/') && pathname.length > 7) {
        return true;
      }
      
      // /v/VIDEO_ID 形式
      if (pathname.startsWith('/v/') && pathname.length > 3) {
        return true;
      }
      
      // 除外するパターン
      const excludePatterns = [
        '/results',        // 検索結果
        '/channel/',       // チャンネル
        '/c/',            // チャンネル（カスタムURL）
        '/user/',         // ユーザー
        '/playlist',      // プレイリスト
        '/feed/',         // フィード
        '/trending',      // トレンド
        '/live/'          // ライブ
      ];
      
      return !excludePatterns.some(pattern => pathname.startsWith(pattern));
    }
    
    return false;
  } catch {
    return false;
  }
}

// YouTube oEmbed API呼び出し機能
async function fetchYouTubeTitle(url: string): Promise<string> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LLShare/1.0)',
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`oEmbed API error: ${response.status}`);
    }

    const data = await response.json();
    return data.title || 'YouTube Video';

  } catch (error) {
    console.error('Error fetching YouTube title:', error);
    return 'YouTube Video';
  }
}

// HTMLテキストを適切なエンコーディングでデコード
async function fetchAndDecodeHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36' },
  });

  // ArrayBufferとして取得
  const arrayBuffer = await response.arrayBuffer();
  
  // エンコーディングを検出
  const contentType = response.headers.get('content-type');
  const encoding = detectEncoding(url, contentType);
  
  // TextDecoderでデコード
  try {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(arrayBuffer);
  } catch (error) {
    // エンコーディングに失敗した場合はUTF-8でフォールバック
    console.warn(`Failed to decode with ${encoding}, falling back to UTF-8:`, error);
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(arrayBuffer);
  }
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return new Response('URL is required', { status: 400 });
  }

  try {
    let title: string;

    // YouTube動画URLの場合はoEmbed APIを使用
    if (isYouTubeVideoUrl(urlParam)) {
      title = await fetchYouTubeTitle(urlParam);
    } else {
      // 通常のHTMLメタタイトル取得処理
      const html = await fetchAndDecodeHtml(urlParam);

      if (!html) {
        return new Response(JSON.stringify({ title: urlParam }), { status: 200 });
      }

      const $ = cheerio.load(html);
      const htmlTitle = $('title').text() || urlParam;
      const ogTitle = $('meta[property="og:title"]').attr('content');
      const twitterTitle = $('meta[name="twitter:title"]').attr('content');

      // titleが"Attention Required!"の場合はエラーを返す
      if ((ogTitle || twitterTitle || htmlTitle) === 'Attention Required!') {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch meta title (bot protection or similar)' }),
          { status: 500 }
        );
      }

      title = ogTitle || twitterTitle || htmlTitle;
    }

    return new Response(
      JSON.stringify({
        title,
        url: urlParam,
      }),
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching meta title:', error);
    
    // エラーの詳細情報を含める（開発環境でのみ）
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = isDevelopment && error instanceof Error 
      ? `Failed to fetch meta title: ${error.message}`
      : 'Failed to fetch meta title';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        title: urlParam // エラー時でもURLをタイトルとして返す
      }), 
      { status: 500 }
    );
  }
}