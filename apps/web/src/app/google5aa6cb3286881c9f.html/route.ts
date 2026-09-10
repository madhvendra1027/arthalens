import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google5aa6cb3286881c9f.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
