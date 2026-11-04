import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE = "haya-admin";
function secret() { return process.env.ADMIN_SESSION_SECRET || "development-only-change-me"; }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("hex"); }
export function createAdminToken() { const payload = `${Date.now() + 1000 * 60 * 60 * 8}`; return `${payload}.${sign(payload)}`; }
export function verifyAdminToken(token?: string) { if (!token) return false; const [expires, signature] = token.split("."); if (!expires || !signature || Number(expires) < Date.now()) return false; const expected = sign(expires); return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); }
export async function isAdmin() { return verifyAdminToken((await cookies()).get(COOKIE)?.value); }
export async function setAdminSession() { (await cookies()).set(COOKIE, createAdminToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8, path: "/" }); }
export async function clearAdminSession() { (await cookies()).delete(COOKIE); }
export function validAdminCredentials(email: string, password: string) { const configuredEmail = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === "production" ? "" : "admin@hayanest.com"); const configuredPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "change-me-now"); return Boolean(configuredEmail && configuredPassword) && email === configuredEmail && password === configuredPassword; }
