import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
export const runtime = 'edge';

// キャッシュの設定
export const revalidate = 3600; // 1時間キャッシュ

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return new Response('URL is required', { status: 400 });
  }

  try {
    const response = await fetch(urlParam, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36' },
    });
    const html = await response.text();

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
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch meta title' }), { status: 500 });
  }
}