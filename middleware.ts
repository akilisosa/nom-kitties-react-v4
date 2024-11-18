// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path matches the room pattern
  if (path.startsWith('/online-game/room/')) {
    const roomId = path.split('/').pop();

    // Validate roomId format if needed
    if (!roomId || roomId.length === 0) {
      return NextResponse.redirect(new URL('/online-game', request.url));
    }

    const validRoomIdFormat = /^[A-Za-z0-9-]+$/; // Example: alphanumeric and hyphens only
    if (!validRoomIdFormat.test(roomId)) {
      return NextResponse.redirect(new URL('/online-game', request.url));
    }

    // check for authentication here
    // const authToken = request.cookies.get('authToken');
    // if (!authToken) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/online-game/room/:path*',
};
