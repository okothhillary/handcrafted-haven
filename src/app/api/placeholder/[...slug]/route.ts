import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  // Handle both /api/placeholder/400/400 and /api/placeholder/1920/1080 patterns
  const [width, height] = params.slug;
  const w = parseInt(width) || 400;
  const h = parseInt(height) || 400;
  
  // Create a more attractive placeholder with gradient
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#d97706;stop-opacity:0.5" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#78716c" font-family="system-ui, sans-serif" font-size="${Math.min(w, h) * 0.08}" font-weight="500">
        ${w} × ${h}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // 24 hours
    },
  });
}
