"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Bell, Boxes, CheckCircle2, ExternalLink, LayoutDashboard, LogOut, PackageCheck, PackageSearch, Plus, Printer, ReceiptText, RefreshCw, Search, Settings, ShieldCheck, Trash2, Truck, UserRound, Users } from "lucide-react";
import { AdminKpiGrid } from "./admin-kpi-grid";
import { AdminCharts } from "./admin-charts";
import { formatPrice } from "@/data/store";
import { printInvoice } from "@/lib/invoice-printer";
import type { Order, Product, StoreSettings } from "@/types/store";

type Analytics = { revenue: number; orders: number; customers: number; averageOrderValue: number; deliveryRate: number; byStatus: Record<string, number> };
type PublicCustomer = { id: string; name: string; email: string; phone: string; address?: string; createdAt: string };
type Tab = "overview" | "orders" | "products" | "customers" | "analytics" | "settings";
type Notice = { tone: "success" | "error"; message: string } | null;
type RiskResult = { phone: string; internal: { totalOrders: number; success: number; failures: number; successRate: number; risk: "safe" | "moderate" | "high" } } | null;

const orderStatuses: Order["status"][] = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
const tabMeta: Record<Tab, { label: string; description: string }> = {
  overview: { label: "Overview", description: "Store performance and operational summary" },
  orders: { label: "Orders", description: "Manage fulfilment, risk and courier dispatch" },
  products: { label: "Products", description: "Catalog, pricing and inventory control" },
  customers: { label: "Customers", description: "Customer activity and lifetime value" },
  analytics: { label: "Analytics", description: "Sales, fulfilment and catalog insights" },
  settings: { label: "Settings", description: "Store, delivery and integration configuration" },
};

export function AdminLogin() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "admin-login", email: data.get("email"), password: data.get("password") }) });
    if (response.ok) location.reload(); else { setError("Invalid admin credentials"); setSubmitting(false); }
  }
  return <main className="admin-login"><form onSubmit={submit}><ShieldCheck /><span>HAYA NEST CONTROL</span><h1>Admin portal</h1><p>Secure access for authorised store operators.</p><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<button disabled={submitting}>{submitting ? "Signing in..." : "Secure sign in"}</button></form></main>;
}

export function AdminDashboard({ initialOrders, initialProducts, initialCustomers, initialSettings, analytics }: { initialOrders: Order[]; initialProducts: Product[]; initialCustomers: PublicCustomer[]; initialSettings: StoreSettings; analytics: Analytics }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [settings, setSettings] = useState(initialSettings);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [notice, setNotice] = useState<Notice>(null);
  const [risk, setRisk] = useState<RiskResult>(null);
  const [checkingRisk, setCheckingRisk] = useState(false);

  const lowStock = products.filter((product) => product.stock < 10);
  const pendingOrders = orders.filter((order) => ["Pending", "Confirmed", "Processing"].includes(order.status));
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesQuery = !query || `${order.id} ${order.customer.name} ${order.customer.phone}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (statusFilter === "All" || order.status === statusFilter);
  }), [orders, query, statusFilter]);
  const filteredProducts = useMemo(() => products.filter((product) => (!query || `${product.name} ${product.slug} ${product.fabric}`.toLowerCase().includes(query.toLowerCase())) && (categoryFilter === "All" || product.category === categoryFilter)), [products, query, categoryFilter]);
  const customerRows = useMemo(() => {
    const rows = new Map<string, PublicCustomer & { orders: number; spend: number; lastOrder?: string }>();
    initialCustomers.forEach((customer) => rows.set(customer.phone, { ...customer, orders: 0, spend: 0 }));
    orders.forEach((order) => { const current = rows.get(order.customer.phone); rows.set(order.customer.phone, { id: current?.id || order.customer.phone, name: current?.name || order.customer.name, email: current?.email || order.customer.email || "Guest checkout", phone: order.customer.phone, address: current?.address || order.customer.address, createdAt: current?.createdAt || order.createdAt, orders: (current?.orders || 0) + 1, spend: (current?.spend || 0) + (order.status === "Cancelled" || order.status === "Returned" ? 0 : order.total), lastOrder: !current?.lastOrder || order.createdAt > current.lastOrder ? order.createdAt : current.lastOrder }); });
    return Array.from(rows.values()).filter((customer) => !query || `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.spend - a.spend);
  }, [initialCustomers, orders, query]);

  function showNotice(tone: "success" | "error", message: string) { setNotice({ tone, message }); }
  function changeTab(next: Tab) { setTab(next); setQuery(""); setNotice(null); }

  async function setStatus(id: string, status: Order["status"]) {
    const response = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const result = await response.json();
    if (response.ok) { setOrders((current) => current.map((order) => order.id === id ? result.order : order)); showNotice("success", `${id} updated to ${status}.`); } else showNotice("error", result.error || "Order update failed.");
  }
  async function dispatch(id: string) {
    showNotice("success", `Dispatching ${id}...`);
    const response = await fetch("/api/admin/courier/dispatch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: id }) });
    const result = await response.json();
    if (response.ok) { setOrders((current) => current.map((order) => order.id === id ? result.order : order)); showNotice("success", `Dispatched. Tracking: ${result.order.courierTrackingCode}`); } else showNotice("error", result.error || "Courier dispatch failed.");
  }
  async function checkRisk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setCheckingRisk(true); setRisk(null);
    const phone = String(new FormData(event.currentTarget).get("phone") || "");
    const response = await fetch(`/api/admin/courier/fraud-check?phone=${encodeURIComponent(phone)}`);
    const result = await response.json(); setCheckingRisk(false);
    if (response.ok) setRisk({ phone, internal: result.internal }); else showNotice("error", result.error || "Risk check failed.");
  }
  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    const payload = { ...data, insideDhakaFee: Number(data.insideDhakaFee), outsideDhakaFee: Number(data.outsideDhakaFee), freeShippingThreshold: Number(data.freeShippingThreshold) };
    const response = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json();
    if (response.ok) { setSettings(result.settings); showNotice("success", "Store settings saved."); } else showNotice("error", result.error || "Settings could not be saved.");
  }
  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form));
    const payload = { ...data, price: Number(data.price), originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined, stock: Number(data.stock), sizes: String(data.sizes || "Standard").split(",").map((value) => value.trim()).filter(Boolean), gallery: [String(data.image)] };
    const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json();
    if (response.ok) { setProducts((current) => [result.product, ...current.filter((product) => product.id !== result.product.id)]); form.reset(); showNotice("success", `${result.product.name} added to the catalog.`); } else showNotice("error", result.error || "Product could not be added.");
  }
  async function removeProduct(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) { setProducts((current) => current.filter((product) => product.id !== id)); showNotice("success", `${name} deleted.`); } else showNotice("error", "Product could not be deleted.");
  }
  async function logout() { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "admin-logout" }) }); location.reload(); }

  const menu: Array<[Tab, typeof LayoutDashboard, string]> = [["overview", LayoutDashboard, "Overview"], ["orders", ReceiptText, "Orders"], ["products", Boxes, "Products"], ["customers", Users, "Customers"], ["analytics", BarChart3, "Analytics"], ["settings", Settings, "Settings"]];
  const categoryCounts = products.reduce<Record<string, number>>((result, product) => ({ ...result, [product.category]: (result[product.category] || 0) + 1 }), {});
  const paymentCounts = orders.reduce<Record<string, number>>((result, order) => ({ ...result, [order.paymentMethod.toUpperCase()]: (result[order.paymentMethod.toUpperCase()] || 0) + 1 }), {});

  return <div className="admin-shell professional-admin">
    <aside className="admin-sidebar"><div className="admin-brand"><ShieldCheck /><div><b>HAYA NEST</b><span>STORE CONTROL</span></div></div><nav>{menu.map(([id, Icon, label]) => <button type="button" className={tab === id ? "active" : ""} onClick={() => changeTab(id)} key={id}><Icon /><span>{label}</span>{id === "orders" && pendingOrders.length > 0 && <b>{pendingOrders.length}</b>}{id === "products" && lowStock.length > 0 && <b>{lowStock.length}</b>}</button>)}</nav><div className="admin-sidebar-footer"><Link href="/" target="_blank"><ExternalLink />View storefront</Link><button type="button" onClick={logout}><LogOut />Sign out</button></div></aside>

    <main className="admin-main"><header className="admin-topbar"><div><span>ADMIN DASHBOARD</span><h1>{tabMeta[tab].label}</h1><p>{tabMeta[tab].description}</p></div><div className="admin-top-actions">{["orders", "products", "customers"].includes(tab) && <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tab}...`} /></label>}<button type="button" className="admin-bell" aria-label={`${pendingOrders.length + lowStock.length} operational alerts`}><Bell />{pendingOrders.length + lowStock.length > 0 && <b>{pendingOrders.length + lowStock.length}</b>}</button><div className="admin-user"><UserRound /><span><b>Store Admin</b><small>Administrator</small></span></div></div></header>
      {notice && <div className={`admin-notice ${notice.tone}`} role="status">{notice.tone === "success" ? <CheckCircle2 /> : <AlertTriangle />}<span>{notice.message}</span><button onClick={() => setNotice(null)}>×</button></div>}

      {tab === "overview" && <div className="admin-view"><AdminKpiGrid analytics={analytics} /><div className="admin-health-grid"><article><span>Delivery success</span><strong>{analytics.deliveryRate}%</strong><i><b style={{ width: `${analytics.deliveryRate}%` }} /></i></article><article><span>Pending fulfilment</span><strong>{pendingOrders.length}</strong><small>Orders need attention</small></article><article><span>Low stock</span><strong>{lowStock.length}</strong><small>Items below 10 units</small></article><article><span>Inventory value</span><strong>{formatPrice(inventoryValue)}</strong><small>Current retail value</small></article></div><div className="admin-overview-grid"><AdminCharts byStatus={analytics.byStatus} /><section className="admin-panel recent-orders"><header><div><h2>Recent orders</h2><p>Latest customer activity</p></div><button onClick={() => changeTab("orders")}>View all</button></header>{orders.slice(0, 6).length ? orders.slice(0, 6).map((order) => <article key={order.id}><div><b>{order.customer.name}</b><span>{order.id} · {new Date(order.createdAt).toLocaleDateString()}</span></div><strong>{formatPrice(order.total)}</strong><em className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</em></article>) : <EmptyState icon={ReceiptText} title="No orders yet" text="New orders will appear here." />}</section></div><section className="admin-panel quick-actions"><header><div><h2>Quick actions</h2><p>Common store operations</p></div></header><div><button onClick={() => changeTab("orders")}><ReceiptText /><span><b>Process orders</b><small>{pendingOrders.length} awaiting action</small></span></button><button onClick={() => changeTab("products")}><Plus /><span><b>Add product</b><small>Create a catalog item</small></span></button><button onClick={() => changeTab("settings")}><Settings /><span><b>Store settings</b><small>Delivery and integrations</small></span></button></div></section></div>}

      {tab === "orders" && <div className="admin-view"><section className="admin-panel admin-risk-panel"><form onSubmit={checkRisk}><div><ShieldCheck /><span><b>Customer risk check</b><small>Review internal delivery history before dispatch</small></span></div><input name="phone" placeholder="01XXXXXXXXX" pattern="01[3-9][0-9]{8}" required /><button disabled={checkingRisk}>{checkingRisk ? <RefreshCw className="spin" /> : <Search />}{checkingRisk ? "Checking" : "Check"}</button></form>{risk && <div className={`risk-result ${risk.internal.risk}`}><b>{risk.phone} · {risk.internal.risk.toUpperCase()} RISK</b><span>{risk.internal.totalOrders} orders · {risk.internal.success} delivered · {risk.internal.failures} failed · {risk.internal.successRate}% success</span></div>}</section><section className="admin-panel"><header className="admin-panel-head"><div><h2>All orders</h2><p>{filteredOrders.length} of {orders.length} orders</p></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></header><div className="admin-data-table order-table"><div className="table-head"><span>Order</span><span>Customer</span><span>Total</span><span>Status</span><span>Payment</span><span>Actions</span></div>{filteredOrders.map((order) => <article key={order.id}><div><b>{order.id}</b><span>{new Date(order.createdAt).toLocaleString()}</span></div><div><b>{order.customer.name}</b><span>{order.customer.phone}</span></div><div><b>{formatPrice(order.total)}</b><span>{order.items.length} item(s)</span></div><select value={order.status} onChange={(event) => setStatus(order.id, event.target.value as Order["status"])}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select><div><em className={`payment-pill ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</em><span>{order.paymentMethod.toUpperCase()}</span></div><div className="row-actions"><button onClick={() => printInvoice(order, settings)} title="Print invoice"><Printer /></button><button onClick={() => dispatch(order.id)} title="Dispatch to courier" disabled={order.status === "Shipped" || order.status === "Delivered"}><Truck /></button></div></article>)}</div>{!filteredOrders.length && <EmptyState icon={ReceiptText} title="No matching orders" text="Try another search or status filter." />}</section></div>}

      {tab === "products" && <div className="admin-view"><details className="admin-panel admin-create-product"><summary><span><Plus />Add new product</span><small>Create a complete catalog listing</small></summary><form className="admin-product-form" onSubmit={addProduct}><label>Product name<input name="name" required /></label><label>URL slug<input name="slug" required pattern="[a-z0-9-]+" placeholder="rose-modal-hijab" /></label><label>Price<input name="price" type="number" min="1" required /></label><label>Compare-at price<input name="originalPrice" type="number" min="1" /></label><label>Stock quantity<input name="stock" type="number" min="0" required /></label><label>Category<select name="category"><option>Hijabs</option><option>Abayas</option><option>Prayer Sets</option><option>Accessories</option></select></label><label>Fabric<input name="fabric" required /></label><label>Colour<input name="colour" required /></label><label>Sizes<input name="sizes" placeholder="Standard, 52, 54" /></label><label>Badge<input name="badge" placeholder="New / 20%" /></label><label className="wide">Image URL<input name="image" type="url" required /></label><label className="wide">Description<textarea name="description" rows={3} /></label><button className="admin-primary"><Plus />Add product</button></form></details><section className="admin-panel"><header className="admin-panel-head"><div><h2>Catalog & inventory</h2><p>{filteredProducts.length} of {products.length} products · {lowStock.length} low stock</p></div><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>All</option><option>Hijabs</option><option>Abayas</option><option>Prayer Sets</option><option>Accessories</option></select></header><div className="admin-data-table product-table"><div className="table-head"><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Value</span><span>Actions</span></div>{filteredProducts.map((product) => <article key={product.id}><div className="product-cell"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.slug}</small></span></div><span>{product.category}<small>{product.fabric}</small></span><b>{formatPrice(product.price)}</b><span className={product.stock < 10 ? "stock-low" : "stock-ok"}>{product.stock} units</span><b>{formatPrice(product.price * product.stock)}</b><div className="row-actions"><Link href={`/products/${product.slug}`} target="_blank" title="View product"><ExternalLink /></Link><button className="danger" onClick={() => removeProduct(product.id, product.name)} title="Delete product"><Trash2 /></button></div></article>)}</div>{!filteredProducts.length && <EmptyState icon={PackageSearch} title="No matching products" text="Try another search or category." />}</section></div>}

      {tab === "customers" && <div className="admin-view"><div className="admin-health-grid customer-stats"><article><span>Total customers</span><strong>{customerRows.length}</strong><small>Registered and guest buyers</small></article><article><span>Repeat customers</span><strong>{customerRows.filter((customer) => customer.orders > 1).length}</strong><small>Placed more than one order</small></article><article><span>Customer revenue</span><strong>{formatPrice(customerRows.reduce((sum, customer) => sum + customer.spend, 0))}</strong><small>Non-cancelled order value</small></article><article><span>Average lifetime value</span><strong>{formatPrice(customerRows.length ? Math.round(customerRows.reduce((sum, customer) => sum + customer.spend, 0) / customerRows.length) : 0)}</strong><small>Per known customer</small></article></div><section className="admin-panel"><header><div><h2>Customer directory</h2><p>{customerRows.length} customer profiles</p></div></header><div className="admin-data-table customer-table"><div className="table-head"><span>Customer</span><span>Contact</span><span>Orders</span><span>Lifetime value</span><span>Last order</span></div>{customerRows.map((customer) => <article key={customer.id}><div><b>{customer.name}</b><span>{customer.address || "Address not saved"}</span></div><div><b>{customer.phone}</b><span>{customer.email}</span></div><b>{customer.orders}</b><b>{formatPrice(customer.spend)}</b><span>{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : "No orders"}</span></article>)}</div>{!customerRows.length && <EmptyState icon={Users} title="No customers yet" text="Customer profiles and guest orders will appear here." />}</section></div>}

      {tab === "analytics" && <div className="admin-view"><div className="admin-health-grid"><article><span>Gross revenue</span><strong>{formatPrice(analytics.revenue)}</strong><small>Excludes cancelled and returned</small></article><article><span>Average order value</span><strong>{formatPrice(analytics.averageOrderValue)}</strong><small>Across eligible orders</small></article><article><span>Delivery rate</span><strong>{analytics.deliveryRate}%</strong><small>Delivered against all orders</small></article><article><span>Inventory value</span><strong>{formatPrice(inventoryValue)}</strong><small>Retail value on hand</small></article></div><div className="admin-analytics-grid"><AdminCharts byStatus={analytics.byStatus} /><section className="admin-panel"><h2>Catalog mix</h2><div className="metric-list">{Object.entries(categoryCounts).map(([label, value]) => <div key={label}><span>{label}</span><i><b style={{ width: `${value / Math.max(1, products.length) * 100}%` }} /></i><strong>{value}</strong></div>)}</div></section><section className="admin-panel"><h2>Payment methods</h2><div className="metric-list">{Object.entries(paymentCounts).map(([label, value]) => <div key={label}><span>{label}</span><i><b style={{ width: `${value / Math.max(1, orders.length) * 100}%` }} /></i><strong>{value}</strong></div>)}{!orders.length && <p className="muted">Payment analytics will appear after the first order.</p>}</div></section><section className="admin-panel"><h2>Inventory alerts</h2>{lowStock.length ? <div className="alert-list">{lowStock.slice(0, 6).map((product) => <div key={product.id}><AlertTriangle /><span><b>{product.name}</b><small>{product.stock} units remaining</small></span></div>)}</div> : <EmptyState icon={CheckCircle2} title="Inventory healthy" text="No products are below 10 units." />}</section></div></div>}

      {tab === "settings" && <div className="admin-view"><form onSubmit={saveSettings} className="admin-settings"><section className="admin-panel"><header><div><h2>Store profile</h2><p>Customer-facing identity and support details</p></div></header><div className="settings-grid"><label>Store name<input name="storeName" defaultValue={settings.storeName} /></label><label>Support phone<input name="supportPhone" defaultValue={settings.supportPhone} /></label><label>Support email<input name="supportEmail" type="email" defaultValue={settings.supportEmail} /></label><label>Warehouse address<input name="warehouseAddress" defaultValue={settings.warehouseAddress} /></label></div></section><section className="admin-panel"><header><div><h2>Delivery configuration</h2><p>Shipping fees and free-delivery threshold</p></div></header><div className="settings-grid"><label>Inside Dhaka fee<input name="insideDhakaFee" type="number" min="0" defaultValue={settings.insideDhakaFee} /></label><label>Outside Dhaka fee<input name="outsideDhakaFee" type="number" min="0" defaultValue={settings.outsideDhakaFee} /></label><label>Free shipping threshold<input name="freeShippingThreshold" type="number" min="0" defaultValue={settings.freeShippingThreshold} /></label></div></section><section className="admin-panel"><header><div><h2>Integrations</h2><p>Analytics and Steadfast courier credentials</p></div></header><div className="settings-grid"><label>Meta Pixel ID<input name="facebookPixelId" defaultValue={settings.facebookPixelId} /></label><label>Steadfast API key<input name="steadfastApiKey" type="password" defaultValue={settings.steadfastApiKey} autoComplete="off" /></label><label>Steadfast secret key<input name="steadfastSecretKey" type="password" defaultValue={settings.steadfastSecretKey} autoComplete="off" /></label></div></section><div className="settings-save-bar"><span>Changes apply to checkout, invoices and courier actions.</span><button className="admin-primary"><Settings />Save all settings</button></div></form></div>}
    </main>
  </div>;
}

function EmptyState({ icon: Icon, title, text }: { icon: typeof PackageCheck; title: string; text: string }) { return <div className="admin-empty"><Icon /><b>{title}</b><p>{text}</p></div>; }
