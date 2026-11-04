import { isAdmin } from "@/lib/server/admin-auth";
import { getSnapshot, updateSettings } from "@/lib/server/store-repository";
import type { StoreSettings } from "@/types/store";
export async function GET() { if (!await isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 }); return Response.json({ settings: (await getSnapshot()).settings }); }
export async function PATCH(request: Request) { if (!await isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 }); const body = await request.json() as Partial<StoreSettings>; const allowed: Partial<StoreSettings> = {}; for (const key of ["storeName","supportPhone","supportEmail","warehouseAddress","insideDhakaFee","outsideDhakaFee","freeShippingThreshold","facebookPixelId","steadfastApiKey","steadfastSecretKey"] as const) if (body[key] !== undefined) Object.assign(allowed, { [key]: body[key] }); return Response.json({ settings: await updateSettings(allowed) }); }
