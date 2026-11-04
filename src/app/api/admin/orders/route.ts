import { isAdmin } from "@/lib/server/admin-auth";
import { getSnapshot, updateOrder } from "@/lib/server/store-repository";
import type { OrderStatus } from "@/types/store";
export async function GET(){if(!await isAdmin())return Response.json({error:"Unauthorized"},{status:401});return Response.json({orders:(await getSnapshot()).orders})}
export async function PATCH(request:Request){if(!await isAdmin())return Response.json({error:"Unauthorized"},{status:401});const {id,status}=await request.json() as {id?:string;status?:OrderStatus};if(!id||!status||!["Pending","Confirmed","Processing","Shipped","Delivered","Cancelled","Returned"].includes(status))return Response.json({error:"Invalid order update"},{status:422});const order=await updateOrder(id,{status});return order?Response.json({order}):Response.json({error:"Not found"},{status:404})}
