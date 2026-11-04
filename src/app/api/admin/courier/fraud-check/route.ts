import { isAdmin } from "@/lib/server/admin-auth";
import { phoneRisk } from "@/lib/server/analytics-engine";
import { steadfastFraudCheck } from "@/lib/server/courier";
import { getSnapshot } from "@/lib/server/store-repository";
export async function GET(request: Request) { if (!await isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 }); const phone = new URL(request.url).searchParams.get("phone"); if (!phone) return Response.json({ error: "Phone is required" }, { status: 400 }); const snapshot = await getSnapshot(); const internal = phoneRisk(snapshot.orders, phone); const external = await steadfastFraudCheck(phone, snapshot.settings.steadfastApiKey || process.env.STEADFAST_API_KEY, snapshot.settings.steadfastSecretKey || process.env.STEADFAST_SECRET_KEY); return Response.json({ internal, external }); }
