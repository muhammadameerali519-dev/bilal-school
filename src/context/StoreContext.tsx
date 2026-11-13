import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
} from '../lib/firebase';
import {
  DEFAULT_STORE_SETTINGS,
  SAMPLE_GALLERY,
  SAMPLE_PRODUCTS,
} from '../data/catalogDefaults';
import { CartItem, GalleryItem, Product, StoreSettings } from '../types';

interface ToastMessage {
  id: string;
  text: string;
  tone: 'rose' | 'crimson' | 'neutral';
}

interface StoreContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;

  products: Product[];
  productsLoading: boolean;
  isUsingSampleCatalog: boolean;
  settings: StoreSettings;
  galleryItems: GalleryItem[];

  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateCartQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;

  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  showToast: (text: string, tone?: 'rose' | 'crimson' | 'neutral') => void;
  toasts: ToastMessage[];
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'bilal_sheikh_luxury_cart_v1';
const GUEST_WISHLIST_KEY = 'bilal_sheikh_guest_wishlist_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [firestoreGallery, setFirestoreGallery] = useState<GalleryItem[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [guestWishlist, setGuestWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [cloudWishlist, setCloudWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, tone: 'rose' | 'crimson' | 'neutral' = 'rose') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(guestWishlist));
    } catch {
      // ignore
    }
  }, [guestWishlist]);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser && nextUser.emailVerified) {
        if (nextUser.email === BOOTSTRAPPED_ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', nextUser.uid));
            setIsAdmin(adminDoc.exists());
          } catch {
            setIsAdmin(false);
          }
        }
        // Sync user profile privately
        try {
          await setDoc(
            doc(db, 'users', nextUser.uid),
            {
              uid: nextUser.uid,
              displayName: (nextUser.displayName || '').slice(0, 120),
              email: (nextUser.email || '').slice(0, 160),
              photoURL: (nextUser.photoURL || '').slice(0, 500),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch {
          // non-blocking profile sync
        }
      } else {
        setIsAdmin(false);
        setCloudWishlist([]);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Products live subscription
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...(d.data() as Product), id: d.id }));
        setFirestoreProducts(list);
        setProductsLoading(false);
      },
      (error) => {
        setProductsLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );
    return () => unsub();
  }, []);

  // Store Settings live subscription
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'storeSettings', 'main'),
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...DEFAULT_STORE_SETTINGS, ...(snap.data() as StoreSettings) });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'storeSettings/main');
      }
    );
    return () => unsub();
  }, []);

  // Gallery live subscription
  useEffect(() => {
    const q = query(collection(db, 'galleryItems'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...(d.data() as GalleryItem), id: d.id }));
        setFirestoreGallery(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'galleryItems');
      }
    );
    return () => unsub();
  }, []);

  // Authenticated User Wishlist subscription
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setCloudWishlist([]);
      return;
    }
    const wishlistPath = `users/${user.uid}/wishlist`;
    const unsub = onSnapshot(
      collection(db, wishlistPath),
      (snap) => {
        setCloudWishlist(snap.docs.map((d) => d.id));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, wishlistPath);
      }
    );
    return () => unsub();
  }, [authReady, user]);

  const products = useMemo(() => {
    return firestoreProducts.length > 0 ? firestoreProducts : SAMPLE_PRODUCTS;
  }, [firestoreProducts]);

  const isUsingSampleCatalog = firestoreProducts.length === 0;

  const galleryItems = useMemo(() => {
    return firestoreGallery.length > 0 ? firestoreGallery : SAMPLE_GALLERY;
  }, [firestoreGallery]);

  const wishlistIds = useMemo(() => {
    return user && user.emailVerified ? cloudWishlist : guestWishlist;
  }, [user, cloudWishlist, guestWishlist]);

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      showToast(`Welcome to BILAL SHEIKH, ${result.user.displayName || 'Guest'}.`, 'rose');
      return result.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign-in cancelled.';
      showToast(message, 'crimson');
      return null;
    }
  };

  const logout = async () => {
    await signOut(auth);
    showToast('Signed out securely.', 'neutral');
  };

  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    if (!product.isAvailable || product.availability === 'Out of Stock') {
      showToast('This piece is currently unavailable.', 'crimson');
      return;
    }
    const color = selectedColor || product.colors[0] || 'Signature Finish';
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.selectedColor === color
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: Math.min(99, next[idx].quantity + quantity) };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity,
          selectedColor: color,
          imageUrl: product.images[0] || '',
          category: product.category,
          isSample: product.isSample,
        },
      ];
    });
    showToast(`Added ${product.name} to your Shopping Bag.`, 'rose');
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedColor === selectedColor))
    );
  };

  const updateCartQuantity = (productId: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: Math.min(99, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const toggleWishlist = async (productId: string) => {
    if (user && user.emailVerified) {
      const ref = doc(db, `users/${user.uid}/wishlist`, productId);
      const exists = cloudWishlist.includes(productId);
      try {
        if (exists) {
          await deleteDoc(ref);
          showToast('Removed from your Wishlist.', 'neutral');
        } else {
          await setDoc(ref, {
            productId,
            addedAt: serverTimestamp(),
          });
          showToast('Saved to your Wishlist.', 'rose');
        }
      } catch (error) {
        handleFirestoreError(
          error,
          exists ? OperationType.DELETE : OperationType.CREATE,
          `users/${user.uid}/wishlist/${productId}`
        );
      }
    } else {
      setGuestWishlist((prev) => {
        const exists = prev.includes(productId);
        showToast(
          exists ? 'Removed from Wishlist.' : 'Saved to Wishlist (Sign in to sync across devices).',
          exists ? 'neutral' : 'rose'
        );
        return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <StoreContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        signInWithGoogle,
        logout,
        products,
        productsLoading,
        isUsingSampleCatalog,
        settings,
        galleryItems,
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        showToast,
        toasts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
