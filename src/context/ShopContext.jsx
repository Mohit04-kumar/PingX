import React, { createContext, useContext, useState } from 'react';
import { searchAndCompareProducts, PRODUCT_DATABASE } from '../services/productComparisonService';

const ShopContext = createContext();

export function ShopProvider({ children, onAddPing }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [comparisonList, setComparisonList] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [activeProductDetail, setActiveProductDetail] = useState(null);

  // Shopping Cart State
  const [cart, setCart] = useState([
    {
      id: 'cart-1',
      productId: 'prod_sony_xm5',
      title: 'Sony WH-1000XM5 Wireless ANC Headphones',
      price: 26990,
      originalPrice: 28990,
      merchant: 'Amazon.in',
      url: 'https://www.amazon.in',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamic Multi-Merchant Search & Price Matrix
  const filteredProducts = searchAndCompareProducts({
    query: searchQuery,
    category: selectedCategory,
    sortBy: sortBy
  });

  const addToCart = (product, merchantOverride = null) => {
    const title = product.title || product.name;
    const price = merchantOverride?.price || product.bestPrice || product.price;
    const merchant = merchantOverride?.name || merchantOverride?.marketplace || product.cheapestDeal?.marketplace || 'Amazon.in';
    const url = merchantOverride?.url || product.cheapestDeal?.url || 'https://www.amazon.in';
    const image = product.image || (product.images && product.images[0]);

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          productId: product.id,
          title,
          price,
          originalPrice: product.originalPrice || price * 1.2,
          merchant,
          url,
          image,
          quantity: 1
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId && item.productId !== cartItemId));
  };

  const updateCartQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId || item.productId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

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

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('pingx_watchlist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['prod_sony_xm5'];
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('pingx_watchlist', JSON.stringify(watchlist));
    } catch {}
  }, [watchlist]);

  const removeFromWatchlist = (targetIdOrItem) => {
    const targetId = typeof targetIdOrItem === 'object' && targetIdOrItem !== null 
      ? (targetIdOrItem.id || targetIdOrItem.productId) 
      : targetIdOrItem;
      
    setWatchlist((prev) =>
      prev.filter((item) => {
        if (!item || !targetId) return false;
        const id = typeof item === 'object' && item !== null ? (item.id || item.productId) : item;
        return id !== targetId && item !== targetId;
      })
    );
  };

  const clearWatchlist = () => {
    setWatchlist([]);
    try {
      localStorage.removeItem('pingx_watchlist');
    } catch {}
  };

  const toggleWatchlist = (product, targetPrice) => {
    const prodId = typeof product === 'object' ? product.id : product;
    const isWatched = watchlist.some((item) => {
      const id = typeof item === 'object' ? item.id : item;
      return id === prodId;
    });
    if (isWatched) {
      removeFromWatchlist(prodId);
    } else {
      setWatchlist((prev) => [...prev, product]);
      if (onAddPing && typeof product === 'object') {
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
      removeFromWatchlist,
      clearWatchlist,
      activeProductDetail,
      setActiveProductDetail,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
