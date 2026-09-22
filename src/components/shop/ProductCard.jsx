import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Star, ExternalLink, SlidersHorizontal, BellPlus, Flame, Eye, ShoppingBag } from 'lucide-react';

export function ProductCard({ product, onSelectProduct }) {
  const { comparisonList, addToComparison, removeFromComparison, watchlist, toggleWatchlist, addToCart } = useShop();

  const isComparing = comparisonList.some((item) => item.id === product.id);
  const isWatched = watchlist.includes(product.id);

  const title = product.title || product.name;
  const price = product.bestPrice || product.price;
  const originalPrice = product.originalPrice || price * 1.25;
  const offers = product.offers || [];
  const cheapestOffer = product.cheapestDeal || offers[0] || { marketplace: 'Amazon.in', price: price, url: `https://www.amazon.in/s?k=${encodeURIComponent(title)}` };

  return (
    <div 
      className="rounded-3xl p-5 border space-y-4 transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-md bg-white border-[#e6e2f8]"
    >
      
      {/* Top Image & Discounts */}
      <div className="space-y-3">
        <div 
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group-hover:shadow-md transition-all bg-slate-50"
        >
          <img
            src={product.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span 
            className="absolute top-3 right-3 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs font-mono bg-[#7256c3]"
          >
            {product.discount || '20% OFF'}
          </span>
          <span 
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] px-2.5 py-1 rounded-md font-bold border border-slate-200 text-slate-800 flex items-center gap-1 shadow-2xs"
          >
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> Lowest on {cheapestOffer.marketplace}
          </span>

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity">
            <Eye className="w-4 h-4" /> Quick Specs View
          </div>
        </div>

        {/* Title & Rating */}
        <div onClick={() => onSelectProduct && onSelectProduct(product)} className="cursor-pointer space-y-1">
          <h4 
            className="text-sm font-bold line-clamp-2 font-heading leading-tight text-slate-900 group-hover:text-[#7256c3] transition-colors"
          >
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-amber-500 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-[11px] text-slate-400 font-medium">({product.reviewCount || 1200} reviews)</span>
          </div>
        </div>

        {/* Prices & Marketplace Cards */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black font-mono text-[#7256c3]">
              ₹{price.toLocaleString()}
            </span>
            <span className="text-xs line-through font-mono text-slate-400">
              ₹{Math.round(originalPrice).toLocaleString()}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 text-[10px] pt-1">
            {offers.map((offer, idx) => (
              <a
                key={idx}
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-2 py-0.5 rounded font-mono border transition-all ${
                  offer.marketplace === cheapestOffer.marketplace
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                    : 'bg-[#f8f7ff] text-slate-600 border-[#e6e2f8] hover:bg-slate-100'
                }`}
              >
                {offer.marketplace}: ₹{offer.price.toLocaleString()}
              </a>
            ))}
          </div>
        </div>

        {/* Specs snippet */}
        {product.specs && (
          <div 
            className="text-[11px] p-2.5 rounded-xl border border-[#e6e2f8] bg-[#f8f7ff] space-y-1"
          >
            {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-400">{k}:</span>
                <span className="font-bold text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare, Watch & Add to Cart Actions */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => isComparing ? removeFromComparison(product.id) : addToComparison(product)}
            className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              isComparing
                ? 'bg-[#7256c3] text-white border-[#7256c3]'
                : 'bg-white text-slate-600 border-[#e6e2f8] hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {isComparing ? 'Comparing ✓' : 'Compare'}
          </button>

          <button
            onClick={() => toggleWatchlist(product, price - 500)}
            className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              isWatched
                ? 'bg-amber-50 text-amber-600 border-amber-300'
                : 'bg-white text-slate-600 border-[#e6e2f8] hover:bg-slate-50'
            }`}
          >
            <BellPlus className="w-3.5 h-3.5" />
            {isWatched ? 'Watching' : 'Watch Price'}
          </button>
        </div>

        {/* Dual Actions: Add to Cart + Direct Buy on Store */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => addToCart(product, cheapestOffer)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-violet-100 hover:bg-violet-200 text-[#7256c3] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>

          <a
            href={cheapestOffer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#7256c3] hover:bg-[#6245b5] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center"
          >
            Buy Direct <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
}
