export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  fabric: string;
  colour: string;
  image: string;
  alt: string;
  badge?: string;
  category: "Hijabs" | "Abayas" | "Prayer Sets" | "Accessories";
  sizes: string[];
  stock: number;
  rating: number;
  description: string;
  gallery: string[];
};

export type Collection = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  tone: "blue" | "red" | "sky";
  productIds: string[];
};

export type Story = {
  label: string;
  image: string;
  alt: string;
};

export type CartItem = { productId: string; quantity: number; size: string; colour: string };
export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
export type PaymentMethod = "cod" | "bkash" | "nagad";
export type Order = {
  id: string;
  customer: { name: string; phone: string; email?: string; address: string; city: string };
  items: Array<CartItem & { name: string; price: number }>;
  deliveryZone: "inside-dhaka" | "outside-dhaka";
  paymentMethod: PaymentMethod;
  transactionId?: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: "Pending" | "Paid" | "Failed";
  createdAt: string;
  courierTrackingCode?: string;
};

export type StoreSettings = {
  storeName: string;
  supportPhone: string;
  supportEmail: string;
  warehouseAddress: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeShippingThreshold: number;
  facebookPixelId: string;
  steadfastApiKey: string;
  steadfastSecretKey: string;
};

export type CustomerAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  passwordHash: string;
  createdAt: string;
};

export type StoreSnapshot = { products: Product[]; orders: Order[]; customers: CustomerAccount[]; settings: StoreSettings };
