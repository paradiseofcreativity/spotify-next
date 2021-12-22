import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // the token will exist if user is authenticated
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    
    const isAuthenticated = pathname.includes('/api/auth') || token;

    // check if user is authenticated, visits login page
    if (isAuthenticated && pathname === '/login') {
        return NextResponse.redirect('/');
    }

    // check if user is authenticated, allow them to access a proctected route 
    if (isAuthenticated) {
        return NextResponse.next();
    }

    // if user is not authenticated, kick them out of a proctected route
    if (!token && pathname !== '/login') {
        return NextResponse.redirect('/login');
    }
}