import React from 'react';
import { useShop } from '../../context/ShopContext';
import { X, ExternalLink, CheckCircle2, Star } from 'lucide-react';

export function CompareModal() {
  const { comparisonList, compareModalOpen, setCompareModalOpen, removeFromComparison, clearComparison } = useShop();

  if (!compareModalOpen || comparisonList.length === 0) return null;

  // Best product recommendation logic
  const bestProduct = [...comparisonList].sort((a, b) => (b.rating / (b.bestPrice || b.price)) - (a.rating / (a.bestPrice || a.price)))[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-5xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto bg-[#150f23]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-bold text-white font-heading">Product Comparison Matrix</h3>
              <p className="text-xs text-gray-300">Side-by-side spec evaluation & PingX AI Recommendation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearComparison}
              className="text-xs text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-xl glass-card cursor-pointer button-cap-tracked"
            >
              Clear All
            </button>
            <button
              onClick={() => setCompareModalOpen(false)}
              className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Verdict Banner */}
        {bestProduct && (
          <div className="glass-panel p-4 rounded-2xl border border-[#c2ef4e]/30 bg-[#1f1633] flex items-start gap-3 text-xs text-gray-200">
            <CheckCircle2 className="w-5 h-5 text-[#c2ef4e] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#c2ef4e] button-cap-tracked">PingX AI Recommendation: Best Value</h4>
              <p className="mt-1 leading-relaxed">
                <strong>{bestProduct.title || bestProduct.name}</strong> offers the best value-to-performance ratio in this comparison, featuring a rating of {bestProduct.rating}⭐ at ₹{(bestProduct.bestPrice || bestProduct.price).toLocaleString()}.
              </p>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 font-semibold text-gray-400 w-36 button-cap-tracked">Product Spec</th>
                {comparisonList.map((prod) => {
                  const title = prod.title || prod.name;
                  const price = prod.bestPrice || prod.price;
                  return (
                    <th key={prod.id} className="p-3 min-w-[200px]">
                      <div className="space-y-2">
                        <div className="relative h-24 rounded-xl overflow-hidden bg-black/40 border border-white/10">
                          <img src={prod.image} alt={title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeFromComparison(prod.id)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <h5 className="font-bold text-white line-clamp-2">{title}</h5>
                        <span className="text-[#c2ef4e] font-extrabold text-sm block font-mono">₹{price.toLocaleString()}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              <tr>
                <td className="p-3 font-bold text-gray-400 button-cap-tracked">Rating</td>
                {comparisonList.map((p) => (
                  <td key={p.id} className="p-3 font-semibold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {p.rating} ({p.reviewCount || 1000})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-400 button-cap-tracked">Tracked Stores</td>
                {comparisonList.map((p) => (
                  <td key={p.id} className="p-3 font-mono text-[11px] text-[#fa7faa]">
                    {(p.offers || []).map(o => o.marketplace).join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-400 button-cap-tracked">Key Specs</td>
                {comparisonList.map((p) => (
                  <td key={p.id} className="p-3 space-y-1">
                    {p.specs && Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="text-[10px]">
                        <span className="text-gray-400">{k}:</span> <span className="text-white font-bold">{v}</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-400 button-cap-tracked">Cheapest Deal</td>
                {comparisonList.map((p) => {
                  const cheapest = p.cheapestDeal || p.offers?.[0] || { marketplace: 'Amazon.in', url: '#' };
                  return (
                    <td key={p.id} className="p-3">
                      <a
                        href={cheapest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-discord-green px-3 py-1.5 rounded-xl text-[11px] font-black inline-flex items-center gap-1 cursor-pointer button-cap-tracked"
                      >
                        Buy on {cheapest.marketplace} <ExternalLink className="w-3 h-3 text-black" />
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
