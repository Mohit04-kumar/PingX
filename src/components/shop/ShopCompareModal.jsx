import React from 'react';
import { X, ExternalLink, ArrowRight, ShieldCheck, Check, TrendingDown } from 'lucide-react';

export function ShopCompareModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const lowestPrice = Math.min(...product.merchants.map((m) => m.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#e6e2f8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#e6e2f8] bg-[#f8f7ff] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 overflow-hidden border border-[#e6e2f8] shadow-xs">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#7256c3] uppercase font-mono tracking-wider block">MULTI-STORE PRICE MATRIX</span>
              <h3 className="text-xl font-black text-slate-900 font-heading">{product.name}</h3>
              <p className="text-xs text-emerald-600 font-bold">Lowest Verified Price: ₹{lowestPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-slate-900 border border-[#e6e2f8] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="p-3 font-extrabold text-[#7256c3] uppercase font-mono text-[11px]">Merchant Platform</th>
                <th className="p-3 font-extrabold text-[#7256c3] uppercase font-mono text-[11px]">Listed Price</th>
                <th className="p-3 font-extrabold text-[#7256c3] uppercase font-mono text-[11px]">Original MRP</th>
                <th className="p-3 font-extrabold text-[#7256c3] uppercase font-mono text-[11px]">Savings</th>
                <th className="p-3 font-extrabold text-[#7256c3] uppercase font-mono text-[11px]">Delivery Status</th>
                <th className="p-3 font-extrabold text-[#7256c3] uppercase font-mono text-[11px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {product.merchants.map((m) => {
                const isLowest = m.price === lowestPrice;
                const savings = m.originalPrice - m.price;
                const discount = Math.round((savings / m.originalPrice) * 100);

                return (
                  <tr key={m.name} className={`transition-colors ${isLowest ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}`}>
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 text-[#7256c3] flex items-center justify-center font-extrabold text-xs">
                        {m.name[0]}
                      </div>
                      <span className="font-bold">{m.name}</span>
                      {isLowest && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Lowest Price
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-black text-slate-900 font-mono">
                      ₹{m.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-slate-400 line-through font-mono">
                      ₹{m.originalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-emerald-600 font-bold">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>{discount}% OFF (Save ₹{savings.toLocaleString('en-IN')})</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> In Stock • Fast Dispatch
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          isLowest
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-[#7256c3] hover:bg-[#6245b5] text-white'
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
        <div className="p-4 border-t border-[#e6e2f8] bg-[#f8f7ff] flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Live Automated Multi-Merchant Price Sync Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#e6e2f8] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
}
