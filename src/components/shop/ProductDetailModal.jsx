import React, { useState } from 'react';
import { X, ExternalLink, Star, Flame, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductDetailModal({ product, isOpen, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = product.galleryImages || [product.image];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const title = product.title || product.name;
  const price = product.bestPrice || product.price;
  const originalPrice = product.originalPrice || price * 1.25;
  const offers = product.offers || [];
  const cheapestOffer = product.cheapestDeal || offers[0] || { marketplace: 'Amazon.in', price: price, url: `https://www.amazon.in/s?k=${encodeURIComponent(title)}` };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-2xl border flex items-center justify-center transition-colors cursor-pointer z-20 hover:opacity-75"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Gallery & Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Multi-Image Carousel Container */}
          <div className="space-y-3">
            <div 
              className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border group"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
              <img
                src={images[activeImageIndex]}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <span 
                className="absolute top-3 right-3 text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg uppercase font-heading"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {product.discount || '20% OFF'}
              </span>
              
              <span 
                className="absolute top-3 left-3 backdrop-blur-md text-[10px] px-2.5 py-1 rounded-xl font-bold border flex items-center gap-1"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Multi-Store Verified
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'scale-105 shadow-md' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderColor: activeImageIndex === idx ? 'var(--accent)' : 'var(--border)' }}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider font-heading" style={{ color: 'var(--accent)' }}>
                {product.category} • {product.brand}
              </span>
              <h3 className="text-xl font-black font-heading leading-tight mt-1 uppercase" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h3>
              <div className="flex items-center gap-2 text-amber-400 text-xs mt-1.5 font-bold">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" /> {product.rating}
                </div>
                <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
                  ({product.reviewCount || 1500} verified ratings)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black" style={{ color: 'var(--accent)' }}>
                ₹{price.toLocaleString()}
              </span>
              <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                ₹{Math.round(originalPrice).toLocaleString()}
              </span>
            </div>

            {/* AI Verdict (No Sparkles Icon) */}
            <div 
              className="p-4 rounded-2xl border text-xs space-y-1"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
              <span className="font-black flex items-center uppercase font-heading" style={{ color: 'var(--accent)' }}>
                PingX AI Price Verdict
              </span>
              <p className="leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                Lowest verified deal available on <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>{cheapestOffer.marketplace}</strong> for ₹{price.toLocaleString()}.
              </p>
            </div>
          </div>
        </div>

        {/* Live Merchant Price Comparison Table */}
        <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <h4 className="text-xs font-black font-heading uppercase flex items-center gap-2 tracking-wider" style={{ color: 'var(--text-primary)' }}>
            <ShoppingBag className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Live Marketplace Merchant Offers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {offers.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border flex items-center justify-between transition-all"
                style={{
                  backgroundColor: m.marketplace === cheapestOffer.marketplace ? 'var(--bg-elevated)' : 'var(--bg-subtle)',
                  borderColor: m.marketplace === cheapestOffer.marketplace ? 'var(--accent)' : 'var(--border)'
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs" style={{ color: 'var(--text-primary)' }}>{m.marketplace}</span>
                    {m.marketplace === cheapestOffer.marketplace && (
                      <span 
                        className="text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        Cheapest
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black" style={{ color: 'var(--accent)' }}>₹{m.price.toLocaleString()}</span>
                </div>

                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                  style={{
                    backgroundColor: m.marketplace === cheapestOffer.marketplace ? 'var(--accent)' : 'var(--bg-card)',
                    color: m.marketplace === cheapestOffer.marketplace ? '#ffffff' : 'var(--text-primary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  Buy <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Matrix */}
        {product.specs && (
          <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <h4 className="text-xs font-black font-heading uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Key Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div 
                  key={key} 
                  className="p-3 rounded-2xl border space-y-1"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                >
                  <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{key}</span>
                  <p className="font-extrabold" style={{ color: 'var(--text-primary)' }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
