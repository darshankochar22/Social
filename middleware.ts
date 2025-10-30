import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthToken } from "./lib/auth";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (pathname.startsWith("/_next") || pathname.startsWith("/api")) return NextResponse.next();
	const token = req.cookies.get("auth")?.value;
	const isAuthed = !!(token && verifyAuthToken(token));
	if (isAuthed && (pathname === "/login" || pathname === "/register")) {
		const url = req.nextUrl.clone();
		url.pathname = "/profile";
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
