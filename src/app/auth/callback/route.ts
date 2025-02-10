import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// This route handles the OAuth callback after email verification or social login
export async function GET(request: Request) {
  // Create a URL object from the request URL to easily parse parameters
  const requestUrl = new URL(request.url);

  // Extract the authorization code from URL search parameters
  // This code is provided by Supabase after successful authentication
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Create a Supabase client specifically for server-side route handlers
    // The client needs access to cookies to manage the session
    const supabase = createRouteHandlerClient({ cookies });

    // Exchange the temporary code for a permanent session
    // This creates and stores the user's session in cookies
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect back to the homepage after authentication is complete
  // requestUrl.origin gives us the base URL (e.g., https://example.com)
  return NextResponse.redirect(requestUrl.origin);
}
