import { updateSession } from "./lib/supabase/middleware";

import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	return updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Paths the edge must not swallow: static churn, images, favicon.
		 * All else shall pass through the session forge.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
