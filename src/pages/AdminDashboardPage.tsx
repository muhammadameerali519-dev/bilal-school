import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  Check,
  Database,
  Edit3,
  FileText,
  Image as ImageIcon,
  LogIn,
  MessageCircle,
  Package,
  Palette,
  Plus,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OperationType, db, handleFirestoreError } from '../lib/firebase';
import {
  BRAND_IMAGES,
  LUXURY_CATEGORIES,
  SAMPLE_GALLERY,
  SAMPLE_PRODUCTS,
} from '../data/catalogDefaults';
import {
  AvailabilityStatus,
  CategoryName,
  CustomRequest,
  CustomRequestStatus,
  GalleryItem,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
} from '../types';
import {
  compressImageFileToDataUrl,
  formatPKR,
  openWhatsAppUrl,
  slugify,
} from '../utils/formatters';
import { LuxuryImage, SquircleIcon } from '../components/GlassUI';
import { DigitalReceiptView } from '../components/DigitalReceiptView';

type AdminTab = 'products' | 'orders' | 'custom' | 'settings' | 'gallery';

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    authReady,
    isAdmin,
    signInWithGoogle,
    products,
    isUsingSampleCatalog,
    settings,
    galleryItems,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Product Editor state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState<CategoryName>('Necklaces');
  const [pPrice, setPPrice] = useState('4500');
  const [pOriginalPrice, setPOriginalPrice] = useState('5200');
  const [pStock, setPStock] = useState('15');
  const [pAvailability, setPAvailability] = useState<AvailabilityStatus>('In Stock');
  const [pMaterials, setPMaterials] = useState('5A Cubic Zirconia, Faux Pearls');
  const [pColors, setPColors] = useState('Rose Gold, Champagne Pearl');
  const [pDescription, setPDescription] = useState('');
  const [pImageUrl, setPImageUrl] = useState(BRAND_IMAGES.necklaces);
  const [pFeatured, setPFeatured] = useState(true);
  const [pIsAvailable, setPIsAvailable] = useState(true);
  const [pIsSample, setPIsSample] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [paymentInput, setPaymentInput] = useState(settings.paymentMethods.join(', '));
  const [savingSettings, setSavingSettings] = useState(false);

  // Gallery add state
  const [gTitle, setGTitle] = useState('');
  const [gCaption, setGCaption] = useState('');
  const [gCategory, setGCategory] = useState('Campaign');
  const [gImageUrl, setGImageUrl] = useState('');
  const [gIsCustomer, setGIsCustomer] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
    setPaymentInput(settings.paymentMethods.join(', '));
  }, [settings]);

  // Admin live subscriptions for orders & custom requests
  useEffect(() => {
    if (!authReady || !isAdmin) return;

    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snap) => {
        setOrders(snap.docs.map((d) => ({ ...(d.data() as Order), id: d.id })));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    const unsubRequests = onSnapshot(
      query(collection(db, 'customRequests'), orderBy('createdAt', 'desc')),
      (snap) => {
        setCustomRequests(
          snap.docs.map((d) => ({ ...(d.data() as CustomRequest), id: d.id }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'customRequests');
      }
    );

    return () => {
      unsubOrders();
      unsubRequests();
    };
  }, [authReady, isAdmin]);

  if (!authReady) {
    return (
      <div className="px-4 sm:px-6 py-20 text-center">
        <div className="glass-panel rounded-[28px] p-10 max-w-md mx-auto">
          <p className="font-serif text-2xl text-[#230B14]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="px-4 sm:px-6 py-16">
        <div className="glass-panel-strong rounded-[32px] p-8 sm:p-12 max-w-lg mx-auto text-center space-y-5">
          <SquircleIcon variant="crimson" className="w-14 h-14 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </SquircleIcon>
          <p className="text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold">
            Restricted Boutique Console
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14]">
            BILAL SHEIKH Admin Access
          </h1>
          <p className="text-sm text-[#6E3F50]">
            {user
              ? `Signed in as ${user.email}, which does not have administrator permissions for this store.`
              : 'Sign in with your authorized store administrator Google account to manage products, orders, custom requests, and WhatsApp settings.'}
          </p>
          {!user && (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="glass-crimson-btn px-7 py-3.5 rounded-[16px] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- Handlers ---

  const openNewProductModal = () => {
    setEditingProduct(null);
    setPName('');
    setPCategory('Necklaces');
    setPPrice('4500');
    setPOriginalPrice('5200');
    setPStock('15');
    setPAvailability('In Stock');
    setPMaterials('5A Cubic Zirconia, Faux Pearls');
    setPColors('Rose Gold, Champagne');
    setPDescription('');
    setPImageUrl(BRAND_IMAGES.necklaces);
    setPFeatured(true);
    setPIsAvailable(true);
    setPIsSample(false);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPCategory(p.category);
    setPPrice(String(p.price));
    setPOriginalPrice(String(p.originalPrice));
    setPStock(String(p.stockCount));
    setPAvailability(p.availability);
    setPMaterials(p.materials);
    setPColors(p.colors.join(', '));
    setPDescription(p.description);
    setPImageUrl(p.images[0] || BRAND_IMAGES.hero);
    setPFeatured(p.featured);
    setPIsAvailable(p.isAvailable);
    setPIsSample(p.isSample);
    setIsProductModalOpen(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressImageFileToDataUrl(file, 720, 0.76);
      if (url.length > 240000) {
        showToast('Compressed image exceeds size cap; choose a smaller file.', 'crimson');
        return;
      }
      setPImageUrl(url);
      showToast('Product photo uploaded.', 'rose');
    } catch {
      showToast('Image upload failed.', 'crimson');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(pPrice);
    const origNum = Number(pOriginalPrice) || priceNum;
    const stockNum = Math.max(0, Number(pStock) || 0);
    if (!pName.trim() || priceNum <= 0 || !pDescription.trim()) {
      showToast('Please enter valid product name, price, and description.', 'crimson');
      return;
    }

    const id = editingProduct
      ? editingProduct.id
      : `prod-${Date.now().toString(36)}`;
    const colorsList = pColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, 10);

    const payload = {
      id,
      name: pName.trim().slice(0, 140),
      slug: (slugify(pName) || id).slice(0, 140),
      category: pCategory,
      price: priceNum,
      originalPrice: origNum,
      description: pDescription.trim().slice(0, 2000),
      materials: pMaterials.trim().slice(0, 300),
      colors: colorsList.length > 0 ? colorsList : ['Signature Finish'],
      images: [pImageUrl.trim().slice(0, 250000) || BRAND_IMAGES.hero],
      availability: pAvailability,
      stockCount: stockNum,
      isAvailable: pIsAvailable,
      isSample: pIsSample,
      featured: pFeatured,
      updatedAt: serverTimestamp(),
      ...(editingProduct && !isUsingSampleCatalog
        ? { createdAt: editingProduct.createdAt || serverTimestamp() }
        : { createdAt: serverTimestamp() }),
    };

    try {
      await setDoc(doc(db, 'products', id), payload);
      showToast(editingProduct ? 'Product updated.' : 'Product added to live catalog.', 'rose');
      setIsProductModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${id}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      showToast('Product deleted.', 'neutral');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  const handleSeedSamplesToFirestore = async () => {
    try {
      for (const sample of SAMPLE_PRODUCTS) {
        await setDoc(doc(db, 'products', sample.id), {
          ...sample,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      showToast('Imported sample luxury catalog into live Firestore for editing.', 'rose');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const handleSeedGalleryToFirestore = async () => {
    try {
      for (const item of SAMPLE_GALLERY) {
        await setDoc(doc(db, 'galleryItems', item.id), {
          ...item,
          createdAt: serverTimestamp(),
        });
      }
      showToast('Imported sample gallery items into Firestore.', 'rose');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'galleryItems');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp(),
      });
      showToast(`Order updated to ${status}.`, 'rose');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleUpdateCustomStatus = async (
    requestId: string,
    status: CustomRequestStatus
  ) => {
    try {
      await updateDoc(doc(db, 'customRequests', requestId), {
        status,
        updatedAt: serverTimestamp(),
      });
      showToast(`Custom request marked ${status}.`, 'rose');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `customRequests/${requestId}`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    const methods = paymentInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean)
      .slice(0, 10);

    try {
      await setDoc(doc(db, 'storeSettings', 'main'), {
        brandName: settingsForm.brandName.trim().slice(0, 80) || 'BILAL SHEIKH',
        tagline: settingsForm.tagline.trim().slice(0, 160),
        whatsappNumber: settingsForm.whatsappNumber.trim().slice(0, 25),
        instagramUrl: settingsForm.instagramUrl.trim().slice(0, 250),
        instagramHandle: settingsForm.instagramHandle.trim().slice(0, 80),
        contactEmail: settingsForm.contactEmail.trim().slice(0, 120),
        contactPhone: settingsForm.contactPhone.trim().slice(0, 40),
        studioAddress: settingsForm.studioAddress.trim().slice(0, 300),
        deliveryCharge: Math.max(0, Number(settingsForm.deliveryCharge) || 0),
        freeDeliveryThreshold: Math.max(
          0,
          Number(settingsForm.freeDeliveryThreshold) || 0
        ),
        promoCode: settingsForm.promoCode.trim().toUpperCase().slice(0, 40),
        promoDiscountPercent: Math.min(
          90,
          Math.max(0, Number(settingsForm.promoDiscountPercent) || 0)
        ),
        paymentMethods:
          methods.length > 0 ? methods : ['Cash on Delivery', 'Bank Transfer'],
        aboutStory: settingsForm.aboutStory.slice(0, 3000),
        privacyPolicy: settingsForm.privacyPolicy.slice(0, 3000),
        termsPolicy: settingsForm.termsPolicy.slice(0, 3000),
        returnPolicy: settingsForm.returnPolicy.slice(0, 3000),
        updatedAt: serverTimestamp(),
      });
      showToast('Store settings saved and live across storefront.', 'rose');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'storeSettings/main');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gTitle.trim() || !gImageUrl.trim()) {
      showToast('Provide a title and image for the gallery item.', 'crimson');
      return;
    }
    const id = `gal-${Date.now().toString(36)}`;
    try {
      await setDoc(doc(db, 'galleryItems', id), {
        id,
        title: gTitle.trim().slice(0, 140),
        caption: gCaption.trim().slice(0, 400),
        category: gCategory,
        imageUrl: gImageUrl.trim().slice(0, 250000),
        isCustomerPhoto: gIsCustomer,
        featured: true,
        createdAt: serverTimestamp(),
      });
      setGTitle('');
      setGCaption('');
      setGImageUrl('');
      showToast('Added photo to gallery.', 'rose');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `galleryItems/${id}`);
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-6">
        {/* Header */}
        <div className="glass-panel-strong rounded-[30px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold">
              BILAL SHEIKH Management Suite
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14]">
              Boutique Admin Dashboard
            </h1>
            <p className="text-xs text-[#6E3F50] mt-1">
              Signed in as {user.email} · Real-time Firestore synchronization
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'products', label: 'Products', icon: <ShoppingBag className="w-4 h-4" /> },
              { id: 'orders', label: `Orders (${orders.length})`, icon: <Package className="w-4 h-4" /> },
              { id: 'custom', label: `Custom (${customRequests.length})`, icon: <Palette className="w-4 h-4" /> },
              { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2.5 rounded-[14px] text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'glass-crimson-btn text-white'
                    : 'bg-white/65 border border-white text-[#230B14] hover:bg-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="glass-panel-strong rounded-[30px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
                  Product Inventory ({products.length})
                </h2>
                {isUsingSampleCatalog && (
                  <p className="text-xs text-[#B5123B] mt-1">
                    Currently displaying built-in sample products. Import them to Firestore or add your own live products.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {isUsingSampleCatalog && (
                  <button
                    type="button"
                    onClick={handleSeedSamplesToFirestore}
                    className="glass-squircle-icon px-4 py-2.5 text-xs font-semibold text-[#B5123B] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    <span>Import Sample Catalog to DB</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={openNewProductModal}
                  className="glass-crimson-btn px-5 py-2.5 rounded-[14px] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-[22px] bg-white/65 border border-white p-4 flex flex-col justify-between gap-3"
                >
                  <div className="flex gap-3.5 items-center">
                    <div className="w-20 h-20 rounded-[14px] overflow-hidden shrink-0">
                      <LuxuryImage
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#6E3F50] truncate">
                        {p.category} {p.isSample ? '· Sample' : ''}
                      </p>
                      <h3 className="font-serif text-lg font-semibold text-[#230B14] truncate">
                        {p.name}
                      </h3>
                      <p className="text-sm font-bold text-[#B5123B] tabular-nums">
                        {formatPKR(p.price)}
                      </p>
                      <p className="text-[11px] text-[#6E3F50] tabular-nums">
                        Stock: {p.stockCount} · {p.isAvailable ? 'Active' : 'Hidden'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/70">
                    <button
                      type="button"
                      onClick={() => openEditProductModal(p)}
                      className="glass-squircle-icon px-3 py-1.5 text-xs font-semibold text-[#230B14] hover:text-[#B5123B] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    {!isUsingSampleCatalog && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="glass-squircle-icon px-3 py-1.5 text-xs font-semibold text-[#B5123B] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="glass-panel-strong rounded-[30px] p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
              Customer Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <p className="text-sm text-[#6E3F50] py-8 text-center">
                No customer orders recorded yet. Orders submitted through checkout appear here immediately.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[22px] bg-white/65 border border-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-xl font-bold text-[#230B14]">
                          {order.orderCode}
                        </span>
                        <span className="text-xs font-semibold text-[#B5123B]">
                          · {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#230B14]">
                        {order.customerName} ({order.whatsappNumber})
                      </p>
                      <p className="text-xs text-[#6E3F50]">
                        {order.deliveryAddress}, {order.city} · {order.paymentMethod}
                      </p>
                      <p className="text-xs text-[#6E3F50]">
                        Items: {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-bold text-[#B5123B] tabular-nums mr-2">
                        {formatPKR(order.totalAmount)}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          order.id &&
                          handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        aria-label="Update order status"
                        className="px-3 py-2 rounded-[12px] bg-white border border-[#F7A8C4] text-xs font-semibold text-[#230B14]"
                      >
                        <option value="Awaiting WhatsApp Confirmation">Awaiting WhatsApp Confirmation</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setReceiptOrder(order)}
                        className="glass-squircle-icon px-3.5 py-2 text-xs font-semibold text-[#230B14] hover:text-[#B5123B] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM REQUESTS */}
        {activeTab === 'custom' && (
          <div className="glass-panel-strong rounded-[30px] p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
              Custom Jewellery Requests ({customRequests.length})
            </h2>

            {customRequests.length === 0 ? (
              <p className="text-sm text-[#6E3F50] py-8 text-center">
                No custom design requests submitted yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-[22px] bg-white/65 border border-white p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#B5123B]">
                          {req.requestCode} · {req.jewelleryType}
                        </p>
                        <h3 className="font-serif text-xl font-semibold text-[#230B14]">
                          {req.itemName}
                        </h3>
                        <p className="text-xs text-[#6E3F50]">
                          {req.customerName} · {req.whatsappNumber}
                        </p>
                      </div>
                      <select
                        value={req.status}
                        onChange={(e) =>
                          req.id &&
                          handleUpdateCustomStatus(
                            req.id,
                            e.target.value as CustomRequestStatus
                          )
                        }
                        className="px-3 py-1.5 rounded-[10px] bg-white border border-[#F7A8C4] text-xs font-semibold text-[#230B14]"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Quoted">Quoted</option>
                        <option value="In Design">In Design</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    <div className="text-xs text-[#6E3F50] space-y-1">
                      <p><strong>Colour:</strong> {req.preferredColor} · <strong>Material:</strong> {req.preferredMaterial}</p>
                      <p><strong>Budget:</strong> {req.budgetRange}</p>
                      <p>{req.description}</p>
                    </div>

                    {req.referenceImageUrl && (
                      <div className="w-28 h-24 rounded-[12px] overflow-hidden border border-white">
                        <img
                          src={req.referenceImageUrl}
                          alt="Customer reference"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        openWhatsAppUrl(
                          req.whatsappNumber,
                          `Hello ${req.customerName}, thank you for submitting your custom BILAL SHEIKH request (${req.requestCode}) for ${req.itemName}.`
                        )
                      }
                      className="glass-crimson-btn px-4 py-2 rounded-[12px] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Message Customer on WhatsApp</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="glass-panel-strong rounded-[30px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
                Gallery Showcase ({galleryItems.length})
              </h2>
              <button
                type="button"
                onClick={handleSeedGalleryToFirestore}
                className="glass-squircle-icon px-4 py-2.5 text-xs font-semibold text-[#B5123B] inline-flex items-center gap-2 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>Import Default Gallery to DB</span>
              </button>
            </div>

            <form
              onSubmit={handleAddGalleryItem}
              className="rounded-[22px] bg-white/60 border border-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Photo Title *"
                value={gTitle}
                onChange={(e) => setGTitle(e.target.value)}
                className="px-4 py-2.5 rounded-[12px] bg-white border border-white text-sm"
              />
              <input
                type="text"
                placeholder="Category (Campaign, Close-Up, Bridal Styling, Customer Photos)"
                value={gCategory}
                onChange={(e) => setGCategory(e.target.value)}
                className="px-4 py-2.5 rounded-[12px] bg-white border border-white text-sm"
              />
              <input
                type="text"
                placeholder="Image URL or upload below *"
                value={gImageUrl}
                onChange={(e) => setGImageUrl(e.target.value)}
                className="px-4 py-2.5 rounded-[12px] bg-white border border-white text-sm"
              />
              <label className="flex items-center justify-between px-4 py-2 rounded-[12px] bg-white border border-dashed border-[#B5123B]/50 cursor-pointer text-xs">
                <span>Upload Photo File</span>
                <Upload className="w-4 h-4 text-[#B5123B]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const url = await compressImageFileToDataUrl(f, 800, 0.75);
                    setGImageUrl(url);
                  }}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                placeholder="Caption"
                value={gCaption}
                onChange={(e) => setGCaption(e.target.value)}
                className="md:col-span-2 px-4 py-2.5 rounded-[12px] bg-white border border-white text-sm"
              />
              <div className="md:col-span-2 flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-[#230B14] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gIsCustomer}
                    onChange={(e) => setGIsCustomer(e.target.checked)}
                    className="accent-[#B5123B]"
                  />
                  <span>Mark as Customer-Submitted Photo</span>
                </label>
                <button
                  type="submit"
                  className="glass-crimson-btn px-5 py-2.5 rounded-[12px] text-white text-xs font-semibold cursor-pointer"
                >
                  Add to Gallery
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((g) => (
                <div
                  key={g.id}
                  className="rounded-[18px] bg-white/65 border border-white p-2.5 space-y-2"
                >
                  <div className="aspect-[4/3] rounded-[12px] overflow-hidden">
                    <LuxuryImage
                      src={g.imageUrl}
                      alt={g.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#230B14] truncate">{g.title}</p>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await deleteDoc(doc(db, 'galleryItems', g.id));
                          showToast('Removed gallery photo.', 'neutral');
                        } catch (error) {
                          handleFirestoreError(
                            error,
                            OperationType.DELETE,
                            `galleryItems/${g.id}`
                          );
                        }
                      }}
                      className="text-[#B5123B] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="glass-panel-strong rounded-[30px] p-6 sm:p-8 space-y-6"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
              Store Configuration, WhatsApp &amp; Policies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  WhatsApp Business Number (Digits with Country Code)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, tagline: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={settingsForm.instagramHandle}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={settingsForm.instagramUrl}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Contact Phone Display
                </label>
                <input
                  type="text"
                  value={settingsForm.contactPhone}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Studio / Boutique Address
                </label>
                <input
                  type="text"
                  value={settingsForm.studioAddress}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, studioAddress: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Delivery Charges (PKR)
                </label>
                <input
                  type="number"
                  value={settingsForm.deliveryCharge}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      deliveryCharge: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Free Delivery Threshold (PKR, 0 to disable)
                </label>
                <input
                  type="number"
                  value={settingsForm.freeDeliveryThreshold}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      freeDeliveryThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Active Promo Code
                </label>
                <input
                  type="text"
                  value={settingsForm.promoCode}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, promoCode: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Promo Discount (%)
                </label>
                <input
                  type="number"
                  value={settingsForm.promoDiscountPercent}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      promoDiscountPercent: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Payment Methods (comma-separated)
                </label>
                <input
                  type="text"
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  About Us Brand Story
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.aboutStory}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, aboutStory: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Privacy Policy
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.privacyPolicy}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, privacyPolicy: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Terms &amp; Conditions
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.termsPolicy}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, termsPolicy: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#230B14] mb-1">
                  Return &amp; Exchange Policy
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.returnPolicy}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, returnPolicy: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="glass-crimson-btn px-7 py-3.5 rounded-[16px] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{savingSettings ? 'Saving Settings...' : 'Save All Store Settings'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#230B14]/45 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel-strong rounded-[30px] p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 glass-squircle-icon w-9 h-9 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-serif text-2xl font-semibold text-[#230B14] mb-5">
              {editingProduct ? 'Edit Product' : 'Add New Luxury Product'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as CategoryName)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                  >
                    {LUXURY_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    min={0}
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Availability</label>
                  <select
                    value={pAvailability}
                    onChange={(e) =>
                      setPAvailability(e.target.value as AvailabilityStatus)
                    }
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Made to Order">Made to Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Materials *</label>
                <input
                  type="text"
                  required
                  value={pMaterials}
                  onChange={(e) => setPMaterials(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Available Colours / Finishes (comma-separated)
                </label>
                <input
                  type="text"
                  value={pColors}
                  onChange={(e) => setPColors(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={pImageUrl}
                    onChange={(e) => setPImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                  />
                </div>
                <label className="flex items-center justify-between px-4 py-2.5 rounded-[12px] bg-white/80 border border-dashed border-[#B5123B]/50 cursor-pointer text-xs font-semibold text-[#B5123B]">
                  <span>Upload Product Photo</span>
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-white/80 border border-white text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-5 text-xs font-semibold text-[#230B14]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsAvailable}
                    onChange={(e) => setPIsAvailable(e.target.checked)}
                    className="accent-[#B5123B]"
                  />
                  <span>Active / Available for Purchase</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="accent-[#B5123B]"
                  />
                  <span>Featured on Homepage</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsSample}
                    onChange={(e) => setPIsSample(e.target.checked)}
                    className="accent-[#B5123B]"
                  />
                  <span>Mark as Sample Item</span>
                </label>
              </div>

              <button
                type="submit"
                className="glass-crimson-btn w-full py-3.5 rounded-[14px] text-white text-sm font-semibold cursor-pointer"
              >
                {editingProduct ? 'Save Changes' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {receiptOrder && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#230B14]/45 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-auto">
            <button
              type="button"
              onClick={() => setReceiptOrder(null)}
              className="absolute top-4 right-4 z-10 glass-squircle-icon w-10 h-10 flex items-center justify-center cursor-pointer no-print"
            >
              <X className="w-4 h-4" />
            </button>
            <DigitalReceiptView
              order={receiptOrder}
              businessWhatsapp={settings.whatsappNumber}
            />
          </div>
        </div>
      )}
    </div>
  );
};
