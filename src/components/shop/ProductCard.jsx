import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Star, ExternalLink, SlidersHorizontal, BellPlus, Flame, Eye } from 'lucide-react';

export function ProductCard({ product, onSelectProduct }) {
  const { comparisonList, addToComparison, removeFromComparison, watchlist, toggleWatchlist } = useShop();

  const isComparing = comparisonList.some((item) => item.id === product.id);
  const isWatched = watchlist.includes(product.id);

  const title = product.title || product.name;
  const price = product.bestPrice || product.price;
  const originalPrice = product.originalPrice || price * 1.25;
  const offers = product.offers || [];
  const cheapestOffer = product.cheapestDeal || offers[0] || { marketplace: 'Amazon.in', price: price, url: `https://www.amazon.in/s?k=${encodeURIComponent(title)}` };

  return (
    <div 
      className="rounded-3xl p-5 border space-y-4 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:scale-[1.01]"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      
      {/* Top Image & Discounts */}
      <div className="space-y-3">
        <div 
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="relative h-48 rounded-2xl overflow-hidden border cursor-pointer group-hover:shadow-lg transition-all"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
        >
          <img
            src={product.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span 
            className="absolute top-3 right-3 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg font-mono"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {product.discount || '20% OFF'}
          </span>
          <span 
            className="absolute top-3 left-3 backdrop-blur-md text-[10px] px-2.5 py-1 rounded-md font-bold border flex items-center gap-1"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> Lowest on {cheapestOffer.marketplace}
          </span>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity">
            <Eye className="w-4 h-4" /> Quick Specs View
          </div>
        </div>

        {/* Title & Rating */}
        <div onClick={() => onSelectProduct && onSelectProduct(product)} className="cursor-pointer space-y-1">
          <h4 
            className="text-sm font-bold line-clamp-2 font-heading leading-tight transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-amber-500 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>({product.reviewCount || 1200} reviews)</span>
          </div>
        </div>

        {/* Prices & Marketplace Cards */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold font-mono" style={{ color: 'var(--accent)' }}>
              ₹{price.toLocaleString()}
            </span>
            <span className="text-xs line-through font-mono" style={{ color: 'var(--text-muted)' }}>
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
                className="px-2 py-0.5 rounded font-mono border hover:opacity-80 transition-opacity"
                style={
                  offer.marketplace === cheapestOffer.marketplace
                    ? {
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--accent)',
                        borderColor: 'var(--accent)',
                        fontWeight: 'bold'
                      }
                    : {
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border)'
                      }
                }
              >
                {offer.marketplace}: ₹{offer.price.toLocaleString()}
              </a>
            ))}
          </div>
        </div>

        {/* Specs snippet */}
        {product.specs && (
          <div 
            className="text-[11px] p-2.5 rounded-xl border space-y-1"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare & Watch Actions */}
      <div className="space-y-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => isComparing ? removeFromComparison(product.id) : addToComparison(product)}
            className="py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border"
            style={
              isComparing
                ? { backgroundColor: 'var(--accent)', color: '#ffffff', borderColor: 'var(--accent)' }
                : { backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
            }
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {isComparing ? 'Comparing ✓' : 'Compare'}
          </button>

          <button
            onClick={() => toggleWatchlist(product, price - 500)}
            className="py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border"
            style={
              isWatched
                ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: '#f59e0b' }
                : { backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
            }
          >
            <BellPlus className="w-3.5 h-3.5" />
            {isWatched ? 'Watching' : 'Watch Price'}
          </button>
        </div>

        {/* Direct Destination Button for Lowest Merchant */}
        <a
          href={cheapestOffer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-transform hover:scale-102"
        >
          Buy on {cheapestOffer.marketplace} (₹{price.toLocaleString()}) <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
