import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth0 } from './lib/auth0';
import { getOnboardingUser } from './user';

// Define paths that should bypass onboarding check
const BYPASS_ONBOARDING_ROUTES = {
  // Static and system paths that should always bypass
  SYSTEM_PATHS: ['/api', '/_next', '/favicon', '/sitemap', '/robots'],
  // Public routes available without completing onboarding
  PUBLIC_ROUTES: ['/onboarding', '/learn-more', '/'],
};

/**
 * Check if a path should bypass the onboarding redirect
 */
function shouldBypassOnboarding(pathname: string): boolean {
  // Check system paths (startsWith check)
  if (
    BYPASS_ONBOARDING_ROUTES.SYSTEM_PATHS.some((path) =>
      pathname.startsWith(path),
    )
  ) {
    return true;
  }

  // Check exact public routes
  if (
    BYPASS_ONBOARDING_ROUTES.PUBLIC_ROUTES.some((path) => {
      // Check exact match or path with subpaths (e.g., /onboarding/step)
      return (
        pathname === path || (path !== '/' && pathname.startsWith(`${path}/`))
      );
    })
  ) {
    return true;
  }

  return false;
}

/**
 * Check if user has completed onboarding, redirect if not
 * @param request The Next.js request
 * @param response The initial response (from auth middleware)
 * @returns Response with redirect if needed, or original response
 */
export async function handleOnboardingRedirect(
  request: NextRequest,
  response: Response,
): Promise<Response> {
  const pathname = request.nextUrl.pathname;

  // Check if path should bypass onboarding
  if (shouldBypassOnboarding(pathname)) {
    return response;
  }

  try {
    // Get the user with onboarding info
    const user = await getOnboardingUser();

    // If no user or user has completed onboarding, proceed normally
    if (!user || user.onboarding.completed) {
      return response;
    }

    // If user hasn't completed onboarding, redirect to onboarding page
    const url = new URL('/onboarding', request.url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    // If there's an error, allow the request to proceed
    return response;
  }
}

/**
 * Handle Auth0 authentication
 * @param request The Next.js request
 * @returns Response from Auth0 middleware
 */
export async function handleAuth0(request: NextRequest): Promise<Response> {
  return await auth0.middleware(request);
}

/**
 * Main middleware function that orchestrates the middleware chain
 */
export async function middleware(request: NextRequest) {
  // First handle auth0 middleware
  const authResponse = await handleAuth0(request);

  // Then handle onboarding redirect
  return handleOnboardingRedirect(request, authResponse);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
