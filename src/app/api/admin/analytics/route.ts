import { isAdmin } from "@/lib/server/admin-auth";
import { buildAnalytics } from "@/lib/server/analytics-engine";
import { getSnapshot } from "@/lib/server/store-repository";
export async function GET() { if (!await isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 }); return Response.json({ analytics: buildAnalytics(await getSnapshot()) }); }
