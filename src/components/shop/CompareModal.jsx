import React from 'react';
import { useShop } from '../../context/ShopContext';
import { X, ExternalLink, CheckCircle2, Star, Sparkles } from 'lucide-react';

export function CompareModal() {
  const { comparisonList, compareModalOpen, setCompareModalOpen, removeFromComparison, clearComparison } = useShop();

  if (!compareModalOpen || comparisonList.length === 0) return null;

  // Best product recommendation logic
  const bestProduct = [...comparisonList].sort((a, b) => (b.rating / (b.bestPrice || b.price)) - (a.rating / (a.bestPrice || a.price)))[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-3xl p-6 sm:p-8 border border-[#e6e2f8] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#7256c3] uppercase tracking-wider font-mono">SPECIFICATION MATRIX</span>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">Product Comparison Matrix</h3>
            <p className="text-xs text-slate-500">Side-by-side spec evaluation & PingX AI Recommendation</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearComparison}
              className="text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-xl border border-[#e6e2f8] hover:bg-slate-50 transition-colors cursor-pointer font-bold"
            >
              Clear All
            </button>
            <button
              onClick={() => setCompareModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Verdict Banner */}
        {bestProduct && (
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 flex items-start gap-3 text-xs text-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-emerald-800 font-heading">PingX AI Recommendation: Best Value Verdict</h4>
              <p className="mt-1 leading-relaxed text-slate-700">
                <strong>{bestProduct.title || bestProduct.name}</strong> offers the best value-to-performance ratio in this comparison, featuring a rating of {bestProduct.rating}⭐ at ₹{(bestProduct.bestPrice || bestProduct.price).toLocaleString()}.
              </p>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="p-3 font-bold text-slate-500 w-36 uppercase font-mono text-[11px]">Product Spec</th>
                {comparisonList.map((prod) => {
                  const title = prod.title || prod.name;
                  const price = prod.bestPrice || prod.price;
                  return (
                    <th key={prod.id} className="p-3 min-w-[200px]">
                      <div className="space-y-2">
                        <div className="relative h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-xs">
                          <img src={prod.image} alt={title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeFromComparison(prod.id)}
                            className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h5 className="font-bold text-slate-900 line-clamp-2 leading-tight">{title}</h5>
                        <span className="text-[#7256c3] font-black text-sm block font-mono">₹{price.toLocaleString()}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3 font-bold text-slate-500 uppercase font-mono text-[11px]">Rating</td>
                {comparisonList.map((p) => (
                  <td key={p.id} className="p-3 font-semibold text-amber-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {p.rating} ({p.reviewCount || 1000})
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 uppercase font-mono text-[11px]">Tracked Stores</td>
                {comparisonList.map((p) => (
                  <td key={p.id} className="p-3 font-mono text-[11px] text-slate-600">
                    {(p.offers || []).map(o => o.marketplace).join(', ') || 'Amazon.in, Flipkart, Croma'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 uppercase font-mono text-[11px]">Key Specs</td>
                {comparisonList.map((p) => (
                  <td key={p.id} className="p-3 space-y-1">
                    {p.specs && Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="text-[11px]">
                        <span className="text-slate-400">{k}:</span> <span className="text-slate-800 font-bold">{v}</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 uppercase font-mono text-[11px]">Cheapest Deal</td>
                {comparisonList.map((p) => {
                  const cheapest = p.cheapestDeal || p.offers?.[0] || { marketplace: 'Amazon.in', url: '#' };
                  return (
                    <td key={p.id} className="p-3">
                      <a
                        href={cheapest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        Buy on {cheapest.marketplace} <ExternalLink className="w-3 h-3 text-white" />
                      </a>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
