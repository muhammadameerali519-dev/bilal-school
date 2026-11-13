export type CategoryName =
  | 'Artificial Jewellery'
  | 'Necklaces'
  | 'Earrings'
  | 'Bangles'
  | 'Bracelets'
  | 'Rings'
  | 'Jewellery Sets'
  | 'Fashion Accessories'
  | 'Hair Accessories'
  | 'Custom Items';

export type AvailabilityStatus =
  | 'In Stock'
  | 'Limited Edition'
  | 'Made to Order'
  | 'Out of Stock';

export type OrderStatus =
  | 'Awaiting WhatsApp Confirmation'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type CustomRequestStatus =
  | 'Pending Review'
  | 'Quoted'
  | 'In Design'
  | 'Completed'
  | 'Archived';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryName;
  price: number;
  originalPrice: number;
  description: string;
  materials: string;
  colors: string[];
  images: string[];
  availability: AvailabilityStatus;
  stockCount: number;
  isAvailable: boolean;
  isSample: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  instagramUrl: string;
  instagramHandle: string;
  contactEmail: string;
  contactPhone: string;
  studioAddress: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  promoCode: string;
  promoDiscountPercent: number;
  paymentMethods: string[];
  aboutStory: string;
  privacyPolicy: string;
  termsPolicy: string;
  returnPolicy: string;
  updatedAt?: unknown;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedColor: string;
  imageUrl: string;
  category: CategoryName;
  isSample?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor: string;
  imageUrl: string;
}

export interface Order {
  id?: string;
  orderCode: string;
  customerUid: string;
  customerName: string;
  whatsappNumber: string;
  email: string;
  deliveryAddress: string;
  city: string;
  postalCode: string;
  orderNotes: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountCode: string;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdAtISO?: string;
}

export interface CustomRequest {
  id?: string;
  requestCode: string;
  customerUid: string;
  customerName: string;
  whatsappNumber: string;
  itemName: string;
  jewelleryType: string;
  preferredColor: string;
  preferredMaterial: string;
  description: string;
  referenceImageUrl: string;
  budgetRange: string;
  status: CustomRequestStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdAtISO?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  isCustomerPhoto: boolean;
  featured: boolean;
  createdAt?: unknown;
}
