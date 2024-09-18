/** 
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
*/


export const publicRoutes = [
     '/',
    //  '/settings'
];

/** 
 * An array of routes that are used for authentication
 * These routes will redirect logged in users towards settings
 * @type {string[]}
*/


export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
];

/**
 * Logged in or logged out all users need to be able to access "/api/auth"
 * Routes that start with this profile are used for API authentication purpose
 * @type {string}
 */ 
export const apiAuthPrefix = "/api/auth";

/**
 * The default path the user goes to after being logged in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";