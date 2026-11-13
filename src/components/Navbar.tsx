import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { BrandEmblem, SquircleIcon } from './GlassUI';
import { LUXURY_CATEGORIES } from '../data/catalogDefaults';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlistIds,
    setIsCartOpen,
    setIsSearchOpen,
    user,
    isAdmin,
  } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Collections', to: '/collections', hasDropdown: true },
    { label: 'Jewellery', to: '/collections/artificial-jewellery' },
    { label: 'Accessories', to: '/collections/fashion-accessories' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const isRouteActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-2 pointer-events-none no-print">
      <div className="max-w-[1320px] mx-auto pointer-events-auto">
        <div className="glass-panel rounded-[22px] px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8 relative">
          {/* Zone 1: Brand Title */}
          <Link
            to="/"
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5123B] rounded-[14px]"
          >
            <SquircleIcon variant="crimson" className="w-10 h-10">
              <BrandEmblem className="w-5 h-5" />
            </SquircleIcon>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.14em] text-[#230B14] group-hover:text-[#B5123B] transition-colors whitespace-nowrap">
              BILAL SHEIKH
            </span>
          </Link>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav
            className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#230B14]"
            aria-label="Primary Navigation"
          >
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => navigate(item.to)}
                    className={`inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isRouteActive(item.to)
                        ? 'text-[#B5123B] font-semibold'
                        : 'text-[#230B14] hover:text-[#B5123B]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[520px]"
                      >
                        <div className="glass-panel-strong rounded-[24px] p-5 grid grid-cols-2 gap-2.5">
                          {LUXURY_CATEGORIES.map((cat) => (
                            <Link
                              key={cat.slug}
                              to={
                                cat.slug === 'custom-items'
                                  ? '/custom'
                                  : `/collections/${cat.slug}`
                              }
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] hover:bg-white/65 transition-colors group"
                            >
                              <span className="text-[13px] font-medium text-[#230B14] group-hover:text-[#B5123B]">
                                {cat.name}
                              </span>
                              <span className="text-[11px] text-[#6E3F50]">Explore</span>
                            </Link>
                          ))}
                          <div className="col-span-2 pt-2 mt-1 border-t border-[#F7A8C4]/40 flex items-center justify-between px-2">
                            <Link
                              to="/gallery"
                              onClick={() => setDropdownOpen(false)}
                              className="text-xs font-semibold text-[#B5123B] hover:underline"
                            >
                              Editorial Gallery
                            </Link>
                            <Link
                              to="/custom"
                              onClick={() => setDropdownOpen(false)}
                              className="text-xs font-semibold text-[#230B14] hover:text-[#B5123B]"
                            >
                              Your Style. Your Creation.
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative py-2 whitespace-nowrap shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#B5123B] font-semibold'
                        : 'text-[#230B14] hover:text-[#B5123B]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-underline"
                          className="absolute left-0 right-0 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#B5123B] to-[#E32652]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            )}
          </nav>

          {/* Zone 3: Squircle Glass Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Products"
              className="glass-squircle-icon w-10 h-10 flex items-center justify-center text-[#230B14] hover:text-[#B5123B] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              to="/account"
              aria-label="Wishlist"
              className="relative glass-squircle-icon w-10 h-10 flex items-center justify-center text-[#230B14] hover:text-[#B5123B] hover:-translate-y-0.5 transition-all"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-[7px] bg-[#E32652] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Shopping Bag"
              className="relative glass-squircle-icon w-10 h-10 flex items-center justify-center text-[#230B14] hover:text-[#B5123B] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-[7px] bg-[#B5123B] text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Link
              to={isAdmin ? '/admin' : '/account'}
              aria-label={user ? 'Account and Admin' : 'Sign In / Account'}
              className="hidden sm:flex glass-squircle-icon w-10 h-10 items-center justify-center text-[#230B14] hover:text-[#B5123B] hover:-translate-y-0.5 transition-all overflow-hidden"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Account'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle Mobile Menu"
              className="lg:hidden glass-squircle-icon w-10 h-10 flex items-center justify-center text-[#230B14] cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Glass Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden mt-2 glass-panel-strong rounded-[24px] p-5 space-y-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-[14px] bg-white/55 text-sm font-medium text-[#230B14] hover:text-[#B5123B]"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/custom"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-[14px] bg-[#FFE0EB]/75 text-sm font-semibold text-[#B5123B]"
                >
                  Custom Studio
                </Link>
                <Link
                  to="/gallery"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-[14px] bg-white/55 text-sm font-medium text-[#230B14]"
                >
                  Gallery
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-[14px] bg-white/55 text-sm font-medium text-[#230B14]"
                >
                  Account &amp; Wishlist
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-[14px] glass-crimson-btn text-sm font-semibold text-white"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
