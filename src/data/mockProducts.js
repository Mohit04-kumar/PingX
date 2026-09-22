export const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Sony WH-CH720N Noise Canceling Headphones",
    category: "Electronics",
    subCategory: "Headphones",
    rating: 4.6,
    reviewsCount: 1420,
    price: 7990,
    originalPrice: 14990,
    discount: "47% OFF",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
    ],
    merchants: [
      { name: "Amazon", price: 7990, url: "https://www.amazon.in/s?k=Sony+WH-CH720N", isLowest: true },
      { name: "Flipkart", price: 8299, url: "https://www.flipkart.com/search?q=Sony+WH-CH720N", isLowest: false },
      { name: "Shopsy", price: 8490, url: "https://www.shopsy.in/search?q=Sony+WH-CH720N", isLowest: false },
      { name: "Croma", price: 8490, url: "https://www.croma.com/search?q=Sony+WH-CH720N", isLowest: false }
    ],
    specs: {
      battery: "35 Hours",
      connectivity: "Bluetooth 5.2",
      weight: "192g",
      warranty: "1 Year Manufacturer",
      noiseControl: "Active Noise Canceling (ANC)"
    },
    aiSummary: "Lowest price currently on Amazon (₹7,990). Exceptional Active Noise Cancellation & ultralight 192g design."
  },
  {
    id: "p2",
    name: "JBL Tune 770NC Wireless Headphones",
    category: "Electronics",
    subCategory: "Headphones",
    rating: 4.4,
    reviewsCount: 890,
    price: 5499,
    originalPrice: 9999,
    discount: "45% OFF",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
    ],
    merchants: [
      { name: "Flipkart", price: 5499, url: "https://www.flipkart.com/search?q=JBL+Tune+770NC", isLowest: true },
      { name: "Amazon", price: 5699, url: "https://www.amazon.in/s?k=JBL+Tune+770NC", isLowest: false },
      { name: "Myntra", price: 5799, url: "https://www.myntra.com/jbl-tune-770nc", isLowest: false },
      { name: "Reliance Digital", price: 5999, url: "https://reliancedigital.in", isLowest: false }
    ],
    specs: {
      battery: "70 Hours",
      connectivity: "Bluetooth 5.3",
      weight: "232g",
      warranty: "1 Year",
      noiseControl: "Adaptive Noise Canceling"
    },
    aiSummary: "Lowest price on Flipkart (₹5,499). Monster 70-hour battery life with punchy JBL Pure Bass sound."
  },
  {
    id: "p3",
    name: "boAt Rockerz 450 Pro Wireless On-Ear",
    category: "Electronics",
    subCategory: "Headphones",
    rating: 4.1,
    reviewsCount: 4500,
    price: 1999,
    originalPrice: 3990,
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80"
    ],
    merchants: [
      { name: "Amazon", price: 1999, url: "https://www.amazon.in/s?k=boAt+Rockerz+450+Pro", isLowest: true },
      { name: "Shopsy", price: 2099, url: "https://www.shopsy.in/search?q=boAt+Rockerz+450", isLowest: false },
      { name: "Croma", price: 2199, url: "https://croma.com", isLowest: false }
    ],
    specs: {
      battery: "70 Hours",
      connectivity: "Bluetooth 5.0",
      weight: "168g",
      warranty: "1 Year",
      noiseControl: "Passive Isolation"
    },
    aiSummary: "Cheapest on Amazon (₹1,999). Budget-friendly everyday headphone with fast 10-min ASAP charging."
  },
  {
    id: "p4",
    name: "Apple MacBook Air M2 (16GB, 256GB SSD)",
    category: "Electronics",
    subCategory: "Laptops",
    rating: 4.8,
    reviewsCount: 3100,
    price: 89900,
    originalPrice: 109900,
    discount: "18% OFF",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
    ],
    merchants: [
      { name: "Amazon", price: 89900, url: "https://www.amazon.in/s?k=MacBook+Air+M2", isLowest: true },
      { name: "Flipkart", price: 90900, url: "https://www.flipkart.com/search?q=MacBook+Air+M2", isLowest: false },
      { name: "Croma", price: 92900, url: "https://croma.com", isLowest: false }
    ],
    specs: {
      battery: "18 Hours",
      connectivity: "Wi-Fi 6, Thunderbolt 4",
      weight: "1.24 kg",
      warranty: "1 Year Apple Care",
      processor: "Apple M2 8-core CPU"
    },
    aiSummary: "Lowest price on Amazon (₹89,900). Silent fanless cooling and day-long battery performance."
  },
  {
    id: "p5",
    name: "Asus ROG Zephyrus G14 Gaming Laptop",
    category: "Electronics",
    subCategory: "Laptops",
    rating: 4.7,
    reviewsCount: 780,
    price: 114990,
    originalPrice: 145990,
    discount: "21% OFF",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
    ],
    merchants: [
      { name: "Flipkart", price: 114990, url: "https://www.flipkart.com/search?q=Asus+ROG+Zephyrus+G14", isLowest: true },
      { name: "Amazon", price: 116990, url: "https://www.amazon.in/s?k=Asus+ROG+Zephyrus+G14", isLowest: false }
    ],
    specs: {
      battery: "10 Hours",
      connectivity: "Wi-Fi 6E, HDMI 2.1",
      weight: "1.65 kg",
      warranty: "1 Year Brand",
      processor: "AMD Ryzen 9 7940HS + RTX 4060"
    },
    aiSummary: "Cheapest on Flipkart (₹1,14,990). High-performance OLED 120Hz gaming laptop."
  },
  {
    id: "p6",
    name: "Samsung Galaxy Watch6 LTE (44mm)",
    category: "Gadgets",
    subCategory: "Smartwatches",
    rating: 4.5,
    reviewsCount: 1650,
    price: 24999,
    originalPrice: 36999,
    discount: "32% OFF",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80"
    ],
    merchants: [
      { name: "Amazon", price: 24999, url: "https://www.amazon.in/s?k=Samsung+Galaxy+Watch6", isLowest: true },
      { name: "Flipkart", price: 25499, url: "https://www.flipkart.com/search?q=Samsung+Galaxy+Watch6", isLowest: false },
      { name: "Myntra", price: 25999, url: "https://www.myntra.com/galaxy-watch6", isLowest: false }
    ],
    specs: {
      battery: "40 Hours",
      connectivity: "Bluetooth 5.3, LTE, NFC",
      weight: "33.3g",
      warranty: "1 Year",
      features: "ECG, Body Composition, Sleep Tracking"
    },
    aiSummary: "Lowest price on Amazon (₹24,999). Advanced wellness sensors and direct standalone LTE calling."
  }
];
