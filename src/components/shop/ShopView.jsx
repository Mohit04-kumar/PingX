import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CompareModal } from './CompareModal';
import { ProductDetailModal } from './ProductDetailModal';
import { 
  Search, 
  ShoppingBag, 
  SlidersHorizontal, 
  ExternalLink, 
  ArrowUpDown, 
  Bookmark, 
  Trash2,
  CheckCheck
} from 'lucide-react';

export function ShopView() {
  const { 
    products,
    filteredProducts, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    sortBy,
    setSortBy,
    comparisonList,
    setCompareModalOpen,
    watchlist,
    toggleWatchlist
  } = useShop();

  const [selectedProductModal, setSelectedProductModal] = useState(null);

  const categories = [
    'All', 
    'Phone Covers & Cases', 
    'Footwear', 
    'Headphones & Audio', 
    'Smartphones', 
    'Laptops', 
    'Wearables', 
    'Fashion'
  ];

  // List of all items currently saved in user's Watchlist
  const watchedProducts = (products || []).filter(p => (watchlist || []).includes(p.id));

  // Handler to open all lowest marketplace deals for watched items
  const handleBuyTogether = () => {
    if (watchedProducts.length === 0) return;
    watchedProducts.forEach(p => {
      const bestOffer = p.offers && p.offers.length > 0 
        ? [...p.offers].sort((a, b) => a.price - b.price)[0]
        : null;
      if (bestOffer?.url) {
        window.open(bestOffer.url, '_blank');
      }
    });
  };

  const totalWatchlistCost = watchedProducts.reduce((sum, p) => {
    const minPrice = p.offers && p.offers.length > 0 
      ? Math.min(...p.offers.map(o => o.price))
      : (p.bestPrice || p.price || 0);
    return sum + minPrice;
  }, 0);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-10">
      
      {/* Theme-Adaptive Multi-Merchant Storefront Banner */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border space-y-6 shadow-sm relative transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span 
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono"
              style={{ color: 'var(--accent)' }}
            >
              <ShoppingBag className="w-4 h-4" /> AI Product Comparison & Multi-Merchant Storefront
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
              Amazon, Flipkart, Croma & Myntra Price Matrix
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Aggregated real-time prices across Indian e-commerce merchants with verified cheapest deals & direct buy links.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://www.amazon.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: '#FF9900' }}
            >
              Amazon.in <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.flipkart.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: '#2874F0' }}
            >
              Flipkart <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.croma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: '#00B699' }}
            >
              Croma <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.myntra.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: '#FF3F6C' }}
            >
              Myntra <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* E-Commerce Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-3.5" style={{ color: 'var(--accent)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phone covers, shoes, laptops, headphones, smartphones..."
            className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm border outline-none shadow-sm transition-colors"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Filters & Sorting Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-1.5 rounded-xl transition-all cursor-pointer border"
                style={
                  selectedCategory === cat
                    ? {
                        backgroundColor: 'var(--accent)',
                        borderColor: 'var(--accent)',
                        color: '#ffffff',
                        fontWeight: '800'
                      }
                    : {
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)'
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-muted)' }} className="font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl px-3 py-1.5 text-xs border outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="match">Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

      </div>

      {/* Floating Comparison Sticky Trigger Bar */}
      {comparisonList.length > 0 && (
        <div 
          className="sticky top-20 z-30 p-3.5 rounded-2xl border shadow-xl flex items-center justify-between animate-fadeIn backdrop-blur-md"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--accent)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--accent)' }} /> 
              Comparison Matrix Tray ({comparisonList.length}/4)
            </span>
            <div className="hidden sm:flex gap-1">
              {comparisonList.map(p => (
                <span 
                  key={p.id} 
                  className="px-2 py-0.5 rounded text-[10px] truncate max-w-[120px] border"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  {p.title || p.name}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCompareModalOpen(true)}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Open Comparison Matrix →
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div 
            className="col-span-full p-12 text-center text-sm rounded-3xl border space-y-3"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <p className="font-bold">No products found matching "{searchQuery}".</p>
            <p className="text-xs">Try searching for "Phone cover", "Shoes", "Sony Headphones", or "MacBook".</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={(p) => setSelectedProductModal(p)}
            />
          ))
        )}
      </div>

      {/* ── Watchlist & Buy Together Section ── */}
      <div 
        className="rounded-3xl p-6 border space-y-5 shadow-sm"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
                My Price Watchlist ({watchedProducts.length} items)
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Track live price drops across Amazon, Flipkart, Croma, Myntra & Shopsy.
              </p>
            </div>
          </div>

          {watchedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Combined Lowest Cost</span>
                <p className="text-lg font-black font-mono" style={{ color: 'var(--accent)' }}>
                  ₹{totalWatchlistCost.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleBuyTogether}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-black text-white cursor-pointer shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <ShoppingBag className="w-4 h-4" /> Buy All / Open Store Deals
              </button>
            </div>
          )}
        </div>

        {watchedProducts.length === 0 ? (
          <div className="text-center py-8 text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
            <p className="font-semibold">Your Watchlist is empty.</p>
            <p className="text-[11px]">Click "Watch Price" on any product card above to track its lowest price and buy together here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchedProducts.map((product) => {
              const bestOffer = product.offers && product.offers.length > 0 
                ? [...product.offers].sort((a, b) => a.price - b.price)[0]
                : { price: product.bestPrice || product.price, marketplace: 'Amazon.in', url: '#' };

              return (
                <div 
                  key={product.id}
                  className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                      style={{ borderColor: 'var(--border)' }}
                    />
                    <div className="truncate">
                      <h5 className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {product.title}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-extrabold font-mono" style={{ color: 'var(--accent)' }}>
                          ₹{bestOffer.price.toLocaleString()}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          on {bestOffer.marketplace}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={bestOffer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 hover:scale-105 transition-transform"
                      style={{ backgroundColor: 'var(--accent)', color: '#ffffff', borderColor: 'var(--accent)' }}
                      title="Open store deal"
                    >
                      Buy <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => toggleWatchlist(product)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compare Modal */}
      <CompareModal />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductModal}
        isOpen={!!selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onWatchPrice={toggleWatchlist}
      />

    </div>
  );
}
