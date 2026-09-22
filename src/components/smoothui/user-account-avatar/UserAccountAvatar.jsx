import React, { useState } from 'react';
import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from '@radix-ui/react-popover';
import { Eye, Package, User, Check } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../lib/utils';

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
  const [activeSection, setActiveSection] = useState(null);
  const [userData, setUserData] = useState(user);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Sync if parent user updates
  React.useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

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
    <form className="flex flex-col gap-3 p-4" onSubmit={handleProfileSave}>
      <div className="flex flex-col gap-1.5 text-left">
        <label className="font-medium text-xs text-muted-foreground" htmlFor="avatar-name">
          Full Name
        </label>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          defaultValue={userData.name}
          id="avatar-name"
          name="name"
          placeholder="Your full name"
          type="text"
        />
      </div>
      <div className="flex flex-col gap-1.5 text-left">
        <label className="font-medium text-xs text-muted-foreground" htmlFor="avatar-email">
          Email Address
        </label>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          defaultValue={userData.email}
          id="avatar-email"
          name="email"
          placeholder="your.email@example.com"
          type="email"
        />
      </div>

      <button
        className="mt-2 flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-orange-600 px-4 py-2 font-bold text-xs text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.98]"
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
    <div className="flex flex-col gap-2.5 p-3.5 max-h-72 overflow-y-auto">
      {orders.map((order) => (
        <div
          className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3 transition-colors hover:bg-muted/70 text-left"
          key={order.id}
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-xs text-foreground">{order.id}</div>
            <div className="text-[10px] text-muted-foreground">{order.date}</div>
          </div>
          {order.item && (
            <div className="text-xs font-medium text-foreground truncate">{order.item}</div>
          )}
          <div className="flex items-center gap-2.5">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground capitalize">{order.status}</span>
                <span className="text-muted-foreground font-mono">{order.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
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
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-background p-1.5 transition-colors hover:border-orange-500 hover:text-orange-500"
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
            'group relative flex cursor-pointer items-center gap-2 rounded-full border border-border/80 bg-background p-0.5 transition-all hover:scale-105 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40',
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
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        </button>
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          align="end"
          className="z-50 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl text-foreground"
          onOpenAutoFocus={(e) => e.preventDefault()}
          sideOffset={10}
        >
          {/* Header Profile Summary */}
          <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/20">
            <img
              alt={userData.name}
              className="rounded-full object-cover size-11 border border-border"
              src={userData.avatar}
            />
            <div className="flex-1 min-w-0 text-left">
              <div className="font-bold text-sm truncate text-foreground">{userData.name}</div>
              <div className="text-xs text-muted-foreground truncate">{userData.email}</div>
            </div>
          </div>

          <motion.div
            animate={shouldReduceMotion ? {} : { height: 'auto' }}
            initial={shouldReduceMotion ? {} : { height: 'auto' }}
            transition={{ bounce: 0, duration: 0.2, type: 'spring' }}
          >
            <div className="flex flex-col divide-y divide-border text-sm">
              {/* Profile Toggle */}
              <button
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between px-4 py-3 font-semibold text-xs transition-colors',
                  activeSection === 'profile'
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-foreground hover:bg-muted/50'
                )}
                onClick={() => handleSectionClick('profile')}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <User size={15} /> Edit Profile Details
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
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
                  'flex w-full cursor-pointer items-center justify-between px-4 py-3 font-semibold text-xs transition-colors',
                  activeSection === 'orders'
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-foreground hover:bg-muted/50'
                )}
                onClick={() => handleSectionClick('orders')}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <Package size={15} /> Recent Orders & Tracking
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
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
            </div>
          </motion.div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
}

export default UserAccountAvatar;
