import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Heart, LogIn, LogOut, Package, Palette, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OperationType, db, handleFirestoreError } from '../lib/firebase';
import { CustomRequest, Order } from '../types';
import { formatPKR } from '../utils/formatters';
import { ProductCard } from '../components/ProductCard';
import { SquircleIcon } from '../components/GlassUI';

export const AccountPage: React.FC = () => {
  const {
    user,
    authReady,
    isAdmin,
    signInWithGoogle,
    logout,
    products,
    wishlistIds,
  } = useStore();

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [myRequests, setMyRequests] = useState<CustomRequest[]>([]);

  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setMyOrders([]);
      setMyRequests([]);
      return;
    }

    const ordersQuery = query(
      collection(db, 'orders'),
      where('customerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubOrders = onSnapshot(
      ordersQuery,
      (snap) => {
        setMyOrders(snap.docs.map((d) => ({ ...(d.data() as Order), id: d.id })));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    const reqQuery = query(
      collection(db, 'customRequests'),
      where('customerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubReqs = onSnapshot(
      reqQuery,
      (snap) => {
        setMyRequests(
          snap.docs.map((d) => ({ ...(d.data() as CustomRequest), id: d.id }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'customRequests');
      }
    );

    return () => {
      unsubOrders();
      unsubReqs();
    };
  }, [authReady, user]);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="px-2.5 min-[375px]:px-3.5 sm:px-6 pt-3 sm:pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-8 sm:space-y-10">
        {/* Account Banner */}
        <div className="glass-panel-strong rounded-[26px] sm:rounded-[32px] p-5 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-[18px] sm:rounded-[20px] overflow-hidden border-2 border-white shadow-md bg-[#FFE0EB] flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Profile'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-2xl font-bold text-[#B5123B]">
                      {(user.displayName || 'B')[0]}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#B5123B] font-semibold">
                    Member Account
                  </p>
                  <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[#230B14] truncate">
                    {user.displayName || 'BILAL SHEIKH Guest'}
                  </h1>
                  <p className="text-xs text-[#6E3F50] truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col min-[375px]:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="glass-crimson-btn min-h-[44px] px-5 py-3 rounded-[14px] text-white text-xs font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Open Admin Dashboard</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="glass-squircle-icon min-h-[44px] px-5 py-3 text-xs font-semibold text-[#230B14] hover:text-[#B5123B] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#B5123B] font-semibold mb-1">
                  Account &amp; Synced Wishlist
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14]">
                  Sign In to Sync Your Collection
                </h1>
                <p className="text-xs sm:text-sm text-[#6E3F50] mt-1.5 max-w-xl">
                  Sign in with Google to save your wishlist permanently across devices, track your orders, and review custom jewellery requests.
                </p>
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="glass-crimson-btn w-full sm:w-auto min-h-[48px] px-7 py-4 rounded-[16px] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Sign In with Google</span>
              </button>
            </>
          )}
        </div>

        {/* Wishlist Section */}
        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3">
            <SquircleIcon variant="pink" className="w-10 h-10">
              <Heart className="w-4 h-4" />
            </SquircleIcon>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#230B14]">
                Saved Wishlist
              </h2>
              <p className="text-xs text-[#6E3F50]">
                {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="glass-panel rounded-[24px] sm:rounded-[26px] p-8 sm:p-10 text-center">
              <p className="text-sm text-[#6E3F50] mb-4">
                Tap the heart icon on any jewellery piece to save it here.
              </p>
              <Link
                to="/collections"
                className="glass-squircle-icon min-h-[44px] px-6 py-3 text-xs font-semibold text-[#B5123B] inline-flex items-center justify-center"
              >
                Discover Pieces
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[375px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Signed-in Order & Custom Request History */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <section className="glass-panel rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <SquircleIcon variant="pink" className="w-10 h-10">
                  <Package className="w-4 h-4" />
                </SquircleIcon>
                <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
                  My Orders
                </h2>
              </div>

              {myOrders.length === 0 ? (
                <p className="text-sm text-[#6E3F50]">No orders placed while signed in yet.</p>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-[18px] bg-white/60 border border-white p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-serif text-lg font-semibold text-[#230B14]">
                          {order.orderCode}
                        </p>
                        <p className="text-xs text-[#6E3F50] truncate">
                          {order.items.length} item(s) · {order.status}
                        </p>
                      </div>
                      <p className="font-bold text-sm text-[#B5123B] tabular-nums shrink-0">
                        {formatPKR(order.totalAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="glass-panel rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <SquircleIcon variant="pink" className="w-10 h-10">
                  <Palette className="w-4 h-4" />
                </SquircleIcon>
                <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
                  My Custom Requests
                </h2>
              </div>

              {myRequests.length === 0 ? (
                <p className="text-sm text-[#6E3F50]">No custom design requests submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-[18px] bg-white/60 border border-white p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-serif text-lg font-semibold text-[#230B14] truncate">
                          {req.itemName}
                        </p>
                        <p className="text-xs text-[#6E3F50] truncate">
                          {req.requestCode} · {req.jewelleryType} · {req.status}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[#B5123B] shrink-0">
                        {req.budgetRange}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
