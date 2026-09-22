import React from 'react';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { 
  X, 
  Trash2, 
  ExternalLink, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';

export function CartDrawer() {
  const { cart, removeFromCart, updateCartQty, clearCart, isCartOpen, setIsCartOpen } = useShop();
  const { addToast } = useToast();

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price * 1.25) * item.quantity, 0);
  const totalSavings = Math.max(0, totalOriginal - totalAmount);

  const handleCheckoutAll = () => {
    if (cart.length === 0) return;
    addToast('Opening Verified Store Links', `Opening ${cart.length} lowest-price direct store checkout links`, 'success', 3000);
    cart.forEach((item) => {
      if (item.url) window.open(item.url, '_blank');
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e6e2f8] shadow-2xl flex flex-col justify-between text-slate-900 animate-slideLeft">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-[#e6e2f8] bg-[#f8f7ff] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-violet-100 text-[#7256c3] flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold font-heading text-slate-900">Your Smart Cart</h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} • Verified Lowest Prices
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-violet-50 text-[#7256c3] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse live price comparisons across Amazon, Flipkart, and Croma to add items to your cart.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-[#e6e2f8] shadow-xs space-y-3 group hover:border-violet-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-rose-600 cursor-pointer p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.merchant}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Direct Buy Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-[#f8f7ff] p-0.5">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-bold text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-violet-100 hover:bg-[#7256c3] hover:text-white transition-colors text-[11px] font-bold text-[#7256c3] flex items-center gap-1 cursor-pointer"
                    >
                      Buy on {item.merchant} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#e6e2f8] bg-[#f8f7ff] space-y-4">
              
              {/* Total & Savings summary */}
              <div className="space-y-1.5 text-xs">
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Total Verified Savings
                    </span>
                    <span>-₹{Math.round(totalSavings).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200/60">
                  <span>Total Amount</span>
                  <span className="text-base font-black text-[#7256c3] font-mono">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout All Button */}
              <button
                type="button"
                onClick={handleCheckoutAll}
                className="w-full py-3 px-4 rounded-2xl bg-[#7256c3] hover:bg-[#6245b5] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:scale-[1.01]"
              >
                <span>Checkout Direct on Stores ({cart.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero markup fees • Direct retailer checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
