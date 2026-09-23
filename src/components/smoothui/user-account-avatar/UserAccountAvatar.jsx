import React, { useState } from 'react';
import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from '@radix-ui/react-popover';
import { Eye, Package, User, Check, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';

const mockOrders = [
  { date: '2026-03-15', id: 'ORD-8492', progress: 100, status: 'delivered', item: 'Sony WH-1000XM5' },
  { date: '2026-03-18', id: 'ORD-9104', progress: 68, status: 'shipped', item: 'Nike Air Max 270' },
  { date: '2026-03-19', id: 'ORD-9231', progress: 25, status: 'processing', item: 'MacBook Air M3' },
];

export function UserAccountAvatar({
  user = {
    name: 'Mohit Kumar',
    email: 'mohit@pingx.app',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  orders = mockOrders,
  onProfileSave,
  onOrderView,
  className = '',
}) {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState(null);
  const [userData, setUserData] = useState(user);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Sync if parent user updates
  React.useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const cleanHandle = (userData.username || userData.email?.split('@')[0] || userData.name || 'user')
    .toLowerCase()
    .replace(/@.*$/, '')
    .replace(/\s+/g, '');

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...userData,
      email: formData.get('email') || userData.email,
      name: formData.get('name') || userData.name,
    };
    setUserData(updatedUser);
    if (onProfileSave) {
      onProfileSave(updatedUser);
    }
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      setActiveSection(null);
    }, 700);
  };

  const getStatusColor = (status) => {
    if (status === 'processing') return 'bg-blue-500';
    if (status === 'shipped') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderEditProfile = () => (
    <form className="flex flex-col gap-3 p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800" onSubmit={handleProfileSave}>
      <div className="flex flex-col gap-1 text-left">
        <label className="font-bold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="avatar-name">
          Full Name
        </label>
        <input
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none transition-colors focus:border-[#7256c3] focus:ring-1 focus:ring-[#7256c3]"
          defaultValue={userData.name}
          id="avatar-name"
          name="name"
          placeholder="Your full name"
          type="text"
        />
      </div>
      <div className="flex flex-col gap-1 text-left">
        <label className="font-bold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="avatar-email">
          Email Address
        </label>
        <input
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none transition-colors focus:border-[#7256c3] focus:ring-1 focus:ring-[#7256c3]"
          defaultValue={userData.email}
          id="avatar-email"
          name="email"
          placeholder="your.email@example.com"
          type="email"
        />
      </div>

      <button
        className="mt-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-[#7256c3] hover:bg-[#6044b3] px-4 py-2.5 font-bold text-xs text-white shadow-sm transition-all active:scale-[0.98]"
        type="submit"
      >
        {saveFeedback ? (
          <>
            <Check size={14} className="text-white" /> Saved!
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );

  const renderLastOrders = () => (
    <div className="flex flex-col gap-2.5 p-3.5 max-h-72 overflow-y-auto bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
      {orders.map((order) => (
        <div
          className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 transition-colors hover:border-[#7256c3]/40 text-left shadow-2xs"
          key={order.id}
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-xs text-slate-900 dark:text-white">{order.id}</div>
            <div className="text-[10px] text-slate-400">{order.date}</div>
          </div>
          {order.item && (
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{order.item}</div>
          )}
          <div className="flex items-center gap-2.5">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{order.status}</span>
                <span className="text-slate-400 font-mono">{order.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  animate={shouldReduceMotion ? {} : { width: `${order.progress}%` }}
                  className={`h-full rounded-full ${getStatusColor(order.status)}`}
                  initial={shouldReduceMotion ? {} : { width: 0 }}
                  transition={{ damping: 30, duration: 0.5, stiffness: 300, type: 'spring' }}
                />
              </div>
            </div>
            <button
              aria-label="View Order"
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 transition-colors hover:border-[#7256c3] hover:text-[#7256c3]"
              onClick={() => onOrderView?.(order.id)}
              type="button"
            >
              <Eye size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'group relative flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5 transition-all hover:scale-105 hover:border-[#7256c3] focus:outline-none focus:ring-2 focus:ring-[#7256c3]/40 shadow-xs',
            className
          )}
          type="button"
          aria-label="User profile and orders"
        >
          <img
            alt={userData.name || 'User Avatar'}
            className="rounded-full object-cover size-8 sm:size-9"
            draggable={false}
            src={userData.avatar}
          />
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </button>
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          align="end"
          className="z-[999] w-80 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-slate-900 dark:text-slate-100 ring-1 ring-black/5 animate-scaleUp"
          onOpenAutoFocus={(e) => e.preventDefault()}
          sideOffset={12}
        >
          {/* Header Profile Summary with Opaque Solid Background */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <img
              alt={userData.name}
              className="rounded-full object-cover size-12 border-2 border-white dark:border-slate-700 shadow-xs shrink-0"
              src={userData.avatar}
            />
            <div className="flex-1 min-w-0 text-left">
              <div className="font-extrabold text-sm truncate text-slate-900 dark:text-white font-heading">
                {userData.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                @{cleanHandle}
              </div>
              <div className="text-[11px] text-slate-400 truncate pt-0.5">
                {userData.email}
              </div>
            </div>
          </div>

          <motion.div
            animate={shouldReduceMotion ? {} : { height: 'auto' }}
            initial={shouldReduceMotion ? {} : { height: 'auto' }}
            transition={{ bounce: 0, duration: 0.2, type: 'spring' }}
          >
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* Profile Toggle */}
              <button
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between px-4 py-3 font-semibold transition-colors text-left',
                  activeSection === 'profile'
                    ? 'bg-violet-50 dark:bg-violet-950/40 text-[#7256c3] dark:text-violet-300'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                )}
                onClick={() => handleSectionClick('profile')}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <User size={15} className="text-[#7256c3]" /> Edit Profile Details
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {activeSection === 'profile' ? 'Hide' : 'Open'}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {activeSection === 'profile' && (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { height: 'auto', opacity: 1 }
                        : { height: 'auto', opacity: 1 }
                    }
                    exit={
                      shouldReduceMotion
                        ? { height: 0, opacity: 0 }
                        : { height: 0, opacity: 0 }
                    }
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ bounce: 0, duration: 0.22, type: 'spring' }}
                  >
                    {renderEditProfile()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Orders Toggle */}
              <button
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between px-4 py-3 font-semibold transition-colors text-left',
                  activeSection === 'orders'
                    ? 'bg-violet-50 dark:bg-violet-950/40 text-[#7256c3] dark:text-violet-300'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                )}
                onClick={() => handleSectionClick('orders')}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <Package size={15} className="text-[#7256c3]" /> Recent Orders & Tracking
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {activeSection === 'orders' ? 'Hide' : 'Open'}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {activeSection === 'orders' && (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { height: 'auto', opacity: 1 }
                        : { height: 'auto', opacity: 1 }
                    }
                    exit={
                      shouldReduceMotion
                        ? { height: 0, opacity: 0 }
                        : { height: 0, opacity: 0 }
                    }
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ bounce: 0, duration: 0.22, type: 'spring' }}
                  >
                    {renderLastOrders()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign Out Action Button */}
              <button
                onClick={() => {
                  if (logout) logout();
                }}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                type="button"
              >
                <span className="flex items-center gap-2">
                  <LogOut size={15} /> Sign Out
                </span>
                <span className="text-[10px] uppercase font-bold text-red-400">
                  PingX
                </span>
              </button>
            </div>
          </motion.div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
}

export default UserAccountAvatar;
