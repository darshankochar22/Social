import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const getSecret = (): string => {
	const s = process.env.JWT_SECRET;
	if (!s) throw new Error("JWT_SECRET is not set");
	return s;
};

export function signAuthToken(payload: { accountId: string }, options?: jwt.SignOptions): string {
	return jwt.sign(payload, getSecret(), { expiresIn: "7d", ...options });
}

export function verifyAuthToken(token: string): { accountId: string } | null {
	try {
		return jwt.verify(token, getSecret()) as any;
	} catch {
		return null;
	}
}

export function getAccountIdFromRequest(req: NextRequest): string | null {
	const token = req.cookies.get("auth")?.value;
	if (!token) return null;
	const decoded = verifyAuthToken(token);
	return decoded?.accountId || null;
}
