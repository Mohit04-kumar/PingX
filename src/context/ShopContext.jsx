import React, { createContext, useContext, useState } from 'react';
import { searchAndCompareProducts, PRODUCT_DATABASE } from '../services/productComparisonService';

const ShopContext = createContext();

export function ShopProvider({ children, onAddPing }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [comparisonList, setComparisonList] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(['prod_sony_xm5']);
  const [activeProductDetail, setActiveProductDetail] = useState(null);

  // Dynamic Multi-Merchant Search & Price Matrix
  const filteredProducts = searchAndCompareProducts({
    query: searchQuery,
    category: selectedCategory,
    sortBy: sortBy
  });

  const addToComparison = (product) => {
    if (comparisonList.some((item) => item.id === product.id)) return;
    if (comparisonList.length >= 4) {
      alert("You can compare up to 4 products at a time.");
      return;
    }
    setComparisonList((prev) => [...prev, product]);
  };

  const removeFromComparison = (productId) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const toggleWatchlist = (product, targetPrice) => {
    const isWatched = watchlist.includes(product.id);
    if (isWatched) {
      setWatchlist((prev) => prev.filter((id) => id !== product.id));
    } else {
      setWatchlist((prev) => [...prev, product.id]);
      if (onAddPing) {
        onAddPing({
          id: `watch_${Date.now()}`,
          type: 'price_alert',
          badge: '⭐ Price Watch Activated',
          title: `Watching ${product.title || product.name}`,
          content: `Target price set to ₹${targetPrice || product.bestPrice || product.price}. Ping alert will notify you on price drop!`,
          timestamp: 'Just now',
          read: false,
          action: {
            label: 'View Product',
            type: 'open_product',
            productId: product.id
          }
        });
      }
    }
  };

  return (
    <ShopContext.Provider value={{
      products: PRODUCT_DATABASE,
      filteredProducts,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      sortBy,
      setSortBy,
      comparisonList,
      addToComparison,
      removeFromComparison,
      clearComparison,
      compareModalOpen,
      setCompareModalOpen,
      watchlist,
      toggleWatchlist,
      activeProductDetail,
      setActiveProductDetail
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
