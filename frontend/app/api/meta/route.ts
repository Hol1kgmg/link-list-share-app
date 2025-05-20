import { NextRequest } from 'next/server';
// @ts-ignore
import * as cheerio from 'cheerio';

// @ts-ignore
export const runtime = 'edge';

// キャッシュの設定
export const revalidate = 3600; // 1時間キャッシュ

export async function GET(request: NextRequest) {
  console.log('GET request received::::');
  const urlParam = request.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return new Response('URL is required', { status: 400 });
  }

  try {
    const response = await fetch(urlParam, {
      headers: { 'User-Agent': 'Googlebot' },
    });
    const html = await response.text();

    if (!html) {
      return new Response(JSON.stringify({ title: urlParam }), { status: 200 });
    }

    const $ = cheerio.load(html);
    const title = $('title').text() || urlParam;
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');

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
    return new Response(JSON.stringify({ error: 'Failed to fetch meta title' }), { status: 500 });
  }
} 