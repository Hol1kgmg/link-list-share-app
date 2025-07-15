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
    const html = await fetchAndDecodeHtml(urlParam);

    if (!html) {
      return new Response(JSON.stringify({ title: urlParam }), { status: 200 });
    }

    const $ = cheerio.load(html);
    const title = $('title').text() || urlParam;
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');

    // titleが"Attention Required!"の場合はエラーを返す
    if ((ogTitle || twitterTitle || title) === 'Attention Required!') {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch meta title (bot protection or similar)' }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        title: ogTitle || twitterTitle || title,
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