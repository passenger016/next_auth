// middleware is next.js specific not next auth specific hence the naming needs to be exactly this for it to work properly with Next.js

import authConfig from "./auth.config" 
import NextAuth from "next-auth"
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
 } from "@/routes"
import { NextResponse } from "next/server"


// we are getting th auth from /auth.config.ts file and then destructurng it from there to be used as a middeleware instead
const { auth } = NextAuth(authConfig)

export default auth((req) => { 
    // destructuring the auth to access the nextUrl
    // auth property contains the status that if we are logged in or not
    // by using `!!` we are converting req.auth into boolean that is if we are logged in then it is true or else false 
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if(isApiAuthRoute){
        console.log('stopped at /api/auth route')
        // NextResponse.next() is used in Next.js middleware to indicate that the request should continue through the normal request lifecycle without being interrupted or redirected. 
        // Essentially, it means "proceed with the request as usual."
        return NextResponse.next()
    }
    
    if(isAuthRoute){
        if(isLoggedIn){
            console.log('stopped at default logged in route')
            // if we are on the auth route and the user is logged in then we will redirect them towards the `DEFAULT_LOGIN_REDIRECT` instead of `/auth`
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        
    }

    // if the user is not logged in and is not on a public route then redirect to the login page
    if (!isLoggedIn && !isPublicRoute && !isAuthRoute){
        if(nextUrl.pathname !== "/auth/login"){
        console.log('stopped at redirected to login route as the user was on a protected route')
        return Response.redirect(new URL("/auth/login", nextUrl))
        }
    }

    return NextResponse.next()

})  
 
// Optionally, don't invoke Middleware on some paths.
// All the paths here are simply going to have middleware invoked, it's not about the public or private path.
export const config = {
// every single file except a few will be using the middleware
// then in the middelware we are going to decide what we want to do with that route
// in this way the entire application is protected and needs authorised access and we can separate those hwihc do not need access like landing pages or something
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


