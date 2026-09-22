export const PRODUCT_CATEGORIES = ['Electronics', 'Gadgets', 'Home', 'Fashion', 'Books', 'Accessories'];

export function normalizeProduct(rawProduct = {}) {
  const price = Number(rawProduct.price || rawProduct.currentPrice || 0);
  const originalPrice = Number(rawProduct.originalPrice || rawProduct.mrp || price);
  const discount = rawProduct.discount || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  return {
    id: rawProduct.id || `product_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: rawProduct.title || rawProduct.name || 'Product',
    name: rawProduct.name || rawProduct.title || 'Product',
    image: rawProduct.image || rawProduct.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    marketplace: rawProduct.marketplace || rawProduct.store || 'Marketplace',
    price,
    originalPrice,
    discount: typeof discount === 'number' ? `${discount}% OFF` : String(discount),
    currency: rawProduct.currency || 'INR',
    rating: Number(rawProduct.rating || 0),
    reviewCount: Number(rawProduct.reviewCount || 0),
    url: rawProduct.url || 'https://www.amazon.in',
    availability: rawProduct.availability || 'In Stock',
    category: rawProduct.category || 'Electronics',
    subCategory: rawProduct.subCategory || rawProduct.category || 'General',
    specifications: rawProduct.specifications || rawProduct.specs || {},
    source: rawProduct.source || 'local',
    fetchedAt: rawProduct.fetchedAt || new Date().toISOString(),
    merchants: Array.isArray(rawProduct.merchants) ? rawProduct.merchants.map((merchant) => ({
      name: merchant.name || merchant.marketplace || 'Marketplace',
      price: Number(merchant.price || merchant.currentPrice || 0),
      url: merchant.url || 'https://www.amazon.in',
      isLowest: !!merchant.isLowest
    })) : [{
      name: rawProduct.marketplace || 'Marketplace',
      price,
      url: rawProduct.url || 'https://www.amazon.in',
      isLowest: true
    }],
    galleryImages: Array.isArray(rawProduct.galleryImages) ? rawProduct.galleryImages : [rawProduct.image || rawProduct.thumbnail].filter(Boolean),
    aiSummary: rawProduct.aiSummary || 'AI-verified product recommendation based on active marketplace offers.'
  };
}

export async function searchProducts(query = '') {
  const safeQuery = String(query || '').trim();

  if (!safeQuery) {
    return [];
  }

  const baseProducts = [
    {
      id: 'prod_headphones_sony',
      name: 'Sony WH-CH720N Noise Canceling Headphones',
      title: 'Sony WH-CH720N Noise Canceling Headphones',
      category: 'Electronics',
      subCategory: 'Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'],
      price: 7990,
      originalPrice: 14990,
      discount: '47% OFF',
      rating: 4.6,
      reviewCount: 1420,
      marketplace: 'Amazon',
      url: 'https://www.amazon.in/s?k=Sony+WH-CH720N',
      availability: 'In Stock',
      merchants: [
        { name: 'Amazon', price: 7990, url: 'https://www.amazon.in/s?k=Sony+WH-CH720N', isLowest: true },
        { name: 'Flipkart', price: 8299, url: 'https://www.flipkart.com/search?q=Sony+WH-CH720N', isLowest: false },
        { name: 'Croma', price: 8490, url: 'https://www.croma.com/search?q=Sony+WH-CH720N', isLowest: false }
      ],
      aiSummary: 'Best premium wireless headphone deal with effective ANC and strong battery life.'
    },
    {
      id: 'prod_laptop_m2',
      name: 'Apple MacBook Air M2 (16GB, 256GB SSD)',
      title: 'Apple MacBook Air M2 (16GB, 256GB SSD)',
      category: 'Electronics',
      subCategory: 'Laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'],
      price: 89900,
      originalPrice: 109900,
      discount: '18% OFF',
      rating: 4.8,
      reviewCount: 3100,
      marketplace: 'Amazon',
      url: 'https://www.amazon.in/s?k=MacBook+Air+M2',
      availability: 'In Stock',
      merchants: [
        { name: 'Amazon', price: 89900, url: 'https://www.amazon.in/s?k=MacBook+Air+M2', isLowest: true },
        { name: 'Flipkart', price: 90900, url: 'https://www.flipkart.com/search?q=MacBook+Air+M2', isLowest: false },
        { name: 'Croma', price: 92900, url: 'https://www.croma.com/search?q=MacBook+Air+M2', isLowest: false }
      ],
      aiSummary: 'Excellent ultrabook recommendation for coding, office work and portability.'
    },
    {
      id: 'prod_watch_watch6',
      name: 'Samsung Galaxy Watch6 LTE (44mm)',
      title: 'Samsung Galaxy Watch6 LTE (44mm)',
      category: 'Gadgets',
      subCategory: 'Smartwatches',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
      price: 24999,
      originalPrice: 36999,
      discount: '32% OFF',
      rating: 4.5,
      reviewCount: 1650,
      marketplace: 'Amazon',
      url: 'https://www.amazon.in/s?k=Samsung+Galaxy+Watch6',
      availability: 'In Stock',
      merchants: [
        { name: 'Amazon', price: 24999, url: 'https://www.amazon.in/s?k=Samsung+Galaxy+Watch6', isLowest: true },
        { name: 'Flipkart', price: 25499, url: 'https://www.flipkart.com/search?q=Samsung+Galaxy+Watch6', isLowest: false }
      ],
      aiSummary: 'Strong smartwatch value if you want fitness tracking and LTE connectivity.'
    }
  ];

  const queryLower = safeQuery.toLowerCase();
  return baseProducts
    .filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.subCategory} ${product.aiSummary}`.toLowerCase();
      return haystack.includes(queryLower);
    })
    .map((product) => normalizeProduct(product));
}
