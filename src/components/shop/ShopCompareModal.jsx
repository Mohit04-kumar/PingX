import React from 'react';
import { X, ExternalLink, ArrowRight, ShieldCheck, Check, TrendingDown } from 'lucide-react';

export function ShopCompareModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const lowestPrice = Math.min(...product.merchants.map((m) => m.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e2353] w-full max-w-4xl rounded-3xl border border-[#5865f2]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#5865f2]/20 bg-[#0a0d3a] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 overflow-hidden border border-[#5865f2]/30">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#ec48bd] uppercase font-heading tracking-widest block">PAGE FLOWS COMPARISON MATRIX</span>
              <h3 className="text-xl font-black text-white font-heading uppercase">{product.name}</h3>
              <p className="text-xs text-[#35ed7e] font-bold">Lowest Price: ₹{lowestPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#1e2353] text-gray-300 hover:text-white border border-[#5865f2]/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#5865f2]/20 text-gray-300">
                <th className="p-3 font-black text-[#5865f2] uppercase font-heading">Merchant Platform</th>
                <th className="p-3 font-black text-[#5865f2] uppercase font-heading">Listed Price</th>
                <th className="p-3 font-black text-[#5865f2] uppercase font-heading">Original MRP</th>
                <th className="p-3 font-black text-[#5865f2] uppercase font-heading">Savings</th>
                <th className="p-3 font-black text-[#5865f2] uppercase font-heading">Delivery Status</th>
                <th className="p-3 font-black text-[#5865f2] uppercase font-heading text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5865f2]/10 font-semibold">
              {product.merchants.map((m) => {
                const isLowest = m.price === lowestPrice;
                const savings = m.originalPrice - m.price;
                const discount = Math.round((savings / m.originalPrice) * 100);

                return (
                  <tr key={m.name} className={`transition-colors ${isLowest ? 'bg-[#35ed7e]/10' : 'hover:bg-[#0a0d3a]/50'}`}>
                    <td className="p-4 font-extrabold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-black text-[10px] text-white">
                        {m.name[0]}
                      </div>
                      <span>{m.name}</span>
                      {isLowest && (
                        <span className="bg-[#35ed7e] text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                          Best Deal
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-black text-white">
                      ₹{m.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-gray-400 line-through">
                      ₹{m.originalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-[#35ed7e] font-black">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>{discount}% OFF (Save ₹{savings})</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#35ed7e]">
                        <Check className="w-3.5 h-3.5" /> In Stock • Fast Dispatch
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isLowest ? 'btn-discord-green' : 'btn-discord-blurple'
                        }`}
                      >
                        Buy on {m.name}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#5865f2]/20 bg-[#0a0d3a] flex items-center justify-between text-xs text-gray-300">
          <span className="flex items-center gap-1.5 text-gray-300">
            <ShieldCheck className="w-4 h-4 text-[#35ed7e]" /> Live Automated Multi-Merchant Price Sync Active
          </span>
          <button
            onClick={onClose}
            className="btn-discord-ghost px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
}
