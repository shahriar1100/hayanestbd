import { AdminDashboard, AdminLogin } from "@/components/admin/admin-dashboard";
import { isAdmin } from "@/lib/server/admin-auth";
import { buildAnalytics } from "@/lib/server/analytics-engine";
import { getSnapshot } from "@/lib/server/store-repository";
export const dynamic="force-dynamic";
export default async function AdminPage(){if(!await isAdmin())return <AdminLogin/>;const snapshot=await getSnapshot();const customers=snapshot.customers.map(({id,name,email,phone,address,createdAt})=>({id,name,email,phone,address,createdAt}));return <AdminDashboard initialOrders={snapshot.orders} initialProducts={snapshot.products} initialCustomers={customers} initialSettings={snapshot.settings} analytics={buildAnalytics(snapshot)}/>}
