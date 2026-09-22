/**
 * AI-Powered Product Comparison & Multi-Marketplace Price Engine
 * Aggregates real e-commerce offers from Amazon.in, Flipkart, Croma, Myntra & Shopsy.
 */

export const MARKETPLACES = [
  { id: 'amazon', name: 'Amazon.in', logo: '🛒', color: '#FF9900' },
  { id: 'flipkart', name: 'Flipkart', logo: '🛍️', color: '#2874F0' },
  { id: 'myntra', name: 'Myntra', logo: '👗', color: '#FF3F6C' },
  { id: 'croma', name: 'Croma', logo: '🔌', color: '#00B699' },
  { id: 'shopsy', name: 'Shopsy', logo: '🏷️', color: '#84CC16' }
];

export const PRODUCT_DATABASE = [
  // --- PHONE COVERS & CASES ---
  {
    id: "prod_spigen_liquid_air",
    title: "Spigen Liquid Air Matte Shockproof Case (iPhone / Samsung)",
    brand: "Spigen",
    category: "Phone Covers",
    image: "https://images.unsplash.com/photo-1584006682522-dc17d6c0d963?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 18500,
    specs: {
      "Material": "Flexible Shock-Absorbent TPU",
      "Protection": "Air Cushion Technology (Mil-Grade)",
      "Finish": "Matte Geometric Diamond Grip",
      "Compatibility": "iPhone 15 / 16 & Galaxy S24 Series"
    },
    offers: [
      { marketplace: "Shopsy", price: 949, originalPrice: 1499, discount: "37%", url: "https://www.shopsy.in/spigen-liquid-air", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 999, originalPrice: 1499, discount: "33%", url: "https://www.amazon.in/s?k=spigen+liquid+air", availability: "In Stock" },
      { marketplace: "Flipkart", price: 1099, originalPrice: 1499, discount: "27%", url: "https://www.flipkart.com/search?q=spigen+liquid+air", availability: "In Stock" },
      { marketplace: "Croma", price: 1199, originalPrice: 1499, discount: "20%", url: "https://www.croma.com/search/?text=spigen+case", availability: "In Stock" }
    ]
  },
  {
    id: "prod_magsafe_clear_case",
    title: "MagSafe Crystal Clear Shock-Absorbing Protective Case",
    brand: "Apple / DailyObjects",
    category: "Phone Covers",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewCount: 9200,
    specs: {
      "Type": "MagSafe Magnetic Fast Charging Case",
      "Material": "Anti-Yellowing Polycarbonate + TPU",
      "Camera Guard": "Raised 1.5mm Bezel Protection",
      "Drop Protection": "Reinforced 4-Corner Air Bags"
    },
    offers: [
      { marketplace: "Shopsy", price: 649, originalPrice: 1299, discount: "50%", url: "https://www.shopsy.in/magsafe-clear-case", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 699, originalPrice: 1299, discount: "46%", url: "https://www.amazon.in/s?k=magsafe+clear+case", availability: "In Stock" },
      { marketplace: "Flipkart", price: 749, originalPrice: 1299, discount: "42%", url: "https://www.flipkart.com/search?q=magsafe+clear+case", availability: "In Stock" },
      { marketplace: "Myntra", price: 799, originalPrice: 1299, discount: "38%", url: "https://www.myntra.com/phone-covers", availability: "In Stock" }
    ]
  },
  {
    id: "prod_ringke_fusion_case",
    title: "Ringke Fusion-X Rugged Military Drop-Tested Cover",
    brand: "Ringke",
    category: "Phone Covers",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 7600,
    specs: {
      "Design": "Heavy-Duty Translucent Camo Back",
      "Drop Test": "MIL-STD 810G-516.6 Certified",
      "Lanyard Holes": "Dual QuikCatch Straps Ready",
      "Buttons": "Tactile Textured Response"
    },
    offers: [
      { marketplace: "Shopsy", price: 1149, originalPrice: 1999, discount: "42%", url: "https://www.shopsy.in/ringke-fusion-x", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 1199, originalPrice: 1999, discount: "40%", url: "https://www.amazon.in/s?k=ringke+fusion+case", availability: "In Stock" },
      { marketplace: "Flipkart", price: 1299, originalPrice: 1999, discount: "35%", url: "https://www.flipkart.com/search?q=ringke+fusion", availability: "In Stock" },
      { marketplace: "Croma", price: 1349, originalPrice: 1999, discount: "32%", url: "https://www.croma.com/search/?text=ringke", availability: "In Stock" }
    ]
  },
  {
    id: "prod_silicone_pastel_case",
    title: "Soft Velvet Microfiber Liquid Silicone Slim Phone Cover",
    brand: "DailyObjects",
    category: "Phone Covers",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviewCount: 11400,
    specs: {
      "Feel": "Baby-Skin Soft Touch Silicone",
      "Inside": "Microfiber Anti-Scratch Lining",
      "Wireless Charging": "Fully Compatible",
      "Colors": "Midnight Black, Pine Green, Lavender"
    },
    offers: [
      { marketplace: "Shopsy", price: 399, originalPrice: 899, discount: "56%", url: "https://www.shopsy.in/silicone-phone-cover", availability: "In Stock" },
      { marketplace: "Flipkart", price: 449, originalPrice: 899, discount: "50%", url: "https://www.flipkart.com/search?q=silicone+phone-case", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 499, originalPrice: 899, discount: "44%", url: "https://www.amazon.in/s?k=silicone+phone+case", availability: "In Stock" },
      { marketplace: "Myntra", price: 529, originalPrice: 899, discount: "41%", url: "https://www.myntra.com/silicone-case", availability: "In Stock" }
    ]
  },

  // --- FOOTWEAR & SHOES ---
  {
    id: "prod_nike_slides",
    title: "Nike Offcourt Comfort Slides (Slippers)",
    brand: "Nike",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewCount: 9400,
    specs: {
      "Material": "Dual-Density Revive Foam",
      "Sole": "Contoured Footbed Grip",
      "Closure": "Slip-on Strap",
      "Ideal For": "Men & Women Casual Daily Wear"
    },
    offers: [
      { marketplace: "Myntra", price: 1695, originalPrice: 2495, discount: "32%", url: "https://www.myntra.com/nike-slides", availability: "In Stock" },
      { marketplace: "Shopsy", price: 1749, originalPrice: 2495, discount: "30%", url: "https://www.shopsy.in/nike-slides", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 1895, originalPrice: 2495, discount: "24%", url: "https://www.amazon.in/s?k=nike+offcourt+slides", availability: "In Stock" },
      { marketplace: "Flipkart", price: 1999, originalPrice: 2495, discount: "20%", url: "https://www.flipkart.com/search?q=nike+offcourt+slides", availability: "In Stock" }
    ]
  },
  {
    id: "prod_puma_sneakers",
    title: "Puma Smashic Casual Everyday Sneakers",
    brand: "Puma",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviewCount: 12300,
    specs: {
      "Upper": "Synthetic Leather",
      "Cushioning": "SoftFoam+ Comfort Sockliner",
      "Outsole": "Durable High-Traction Rubber",
      "Type": "Low-Top Lace-up Sneakers"
    },
    offers: [
      { marketplace: "Flipkart", price: 1599, originalPrice: 3999, discount: "60%", url: "https://www.flipkart.com/search?q=puma+smashic", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 1799, originalPrice: 3999, discount: "55%", url: "https://www.amazon.in/s?k=puma+smashic", availability: "In Stock" },
      { marketplace: "Myntra", price: 1849, originalPrice: 3999, discount: "54%", url: "https://www.myntra.com/puma-smashic", availability: "In Stock" }
    ]
  },
  {
    id: "prod_crocs_clogs",
    title: "Crocs Classic Unisex Water-Resistant Clogs",
    brand: "Crocs",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 22000,
    specs: {
      "Material": "Croslite Lightweight Resin",
      "Ventilation": "Breathable Air Ports",
      "Heel Strap": "Pivoting Secure Fit",
      "Water Friendly": "Yes / Fast Drying"
    },
    offers: [
      { marketplace: "Amazon.in", price: 2195, originalPrice: 3495, discount: "37%", url: "https://www.amazon.in/s?k=crocs+classic+clogs", availability: "In Stock" },
      { marketplace: "Myntra", price: 2295, originalPrice: 3495, discount: "34%", url: "https://www.myntra.com/crocs-classic", availability: "In Stock" },
      { marketplace: "Flipkart", price: 2495, originalPrice: 3495, discount: "29%", url: "https://www.flipkart.com/search?q=crocs+classic+clogs", availability: "In Stock" }
    ]
  },

  // --- HEADPHONES & AUDIO ---
  {
    id: "prod_sony_xm5",
    title: "Sony WH-1000XM5 Wireless ANC Headphones",
    brand: "Sony",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 14200,
    specs: {
      "Battery Life": "30 Hours ANC Active",
      "Noise Cancellation": "Dual Processor Auto NC Optimizer",
      "Weight": "250g Ultra-Lightweight",
      "Connectivity": "Bluetooth 5.2 / LDAC Hi-Res"
    },
    offers: [
      { marketplace: "Amazon.in", price: 26990, originalPrice: 34990, discount: "23%", url: "https://www.amazon.in/s?k=sony+wh-1000xm5", availability: "In Stock" },
      { marketplace: "Flipkart", price: 27490, originalPrice: 34990, discount: "21%", url: "https://www.flipkart.com/search?q=sony+wh-1000xm5", availability: "In Stock" },
      { marketplace: "Croma", price: 28990, originalPrice: 34990, discount: "17%", url: "https://www.croma.com/search/?text=sony+wh-1000xm5", availability: "In Stock" }
    ]
  },
  {
    id: "prod_boat_airdopes",
    title: "boAt Airdopes 141 ANC True Wireless Earbuds",
    brand: "boAt",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
    reviewCount: 38000,
    specs: {
      "Playtime": "42 Hours Total Playback",
      "Driver": "8mm Dynamic Bass Drivers",
      "Latency": "BEAST Mode 50ms Low Latency",
      "Charging": "ENx Tech ASAP Fast Charge"
    },
    offers: [
      { marketplace: "Shopsy", price: 1149, originalPrice: 4490, discount: "74%", url: "https://www.shopsy.in/boat-airdopes", availability: "In Stock" },
      { marketplace: "Flipkart", price: 1199, originalPrice: 4490, discount: "73%", url: "https://www.flipkart.com/search?q=boat+airdopes+141", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 1299, originalPrice: 4490, discount: "71%", url: "https://www.amazon.in/s?k=boat+airdopes+141", availability: "In Stock" },
      { marketplace: "Croma", price: 1399, originalPrice: 4490, discount: "69%", url: "https://www.croma.com/search/?text=boat+airdopes", availability: "In Stock" }
    ]
  },

  // --- SMARTPHONES & LAPTOPS ---
  {
    id: "prod_iphone_16_pro",
    title: "Apple iPhone 16 Pro (128GB - Natural Titanium)",
    brand: "Apple",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 5200,
    specs: {
      "Processor": "Apple A18 Pro Bionic Chip",
      "Display": "6.3\" Super Retina XDR ProMotion 120Hz",
      "Camera": "48MP Fusion + 5x Telephoto Tetraprism",
      "Build": "Grade 5 Titanium with Ceramic Shield"
    },
    offers: [
      { marketplace: "Croma", price: 114900, originalPrice: 119900, discount: "4%", url: "https://www.croma.com/search/?text=iphone+16+pro", availability: "In Stock" },
      { marketplace: "Flipkart", price: 116900, originalPrice: 119900, discount: "3%", url: "https://www.flipkart.com/search?q=iphone+16+pro", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 119900, originalPrice: 119900, discount: "0%", url: "https://www.amazon.in/s?k=iphone+16+pro", availability: "In Stock" }
    ]
  },
  {
    id: "prod_samsung_s24_ultra",
    title: "Samsung Galaxy S24 Ultra 5G (12GB RAM / 256GB)",
    brand: "Samsung",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 6800,
    specs: {
      "AI Features": "Galaxy AI Live Translate & Circle to Search",
      "Display": "6.8\" Dynamic AMOLED 2X Flat 2600 Nits",
      "Camera": "200MP Quad Tele System with 100x Zoom",
      "Stylus": "Built-in S-Pen with Air Actions"
    },
    offers: [
      { marketplace: "Flipkart", price: 119999, originalPrice: 134999, discount: "11%", url: "https://www.flipkart.com/search?q=s24+ultra", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 122999, originalPrice: 134999, discount: "9%", url: "https://www.amazon.in/s?k=samsung+s24+ultra", availability: "In Stock" },
      { marketplace: "Croma", price: 124999, originalPrice: 134999, discount: "7%", url: "https://www.croma.com/search/?text=s24+ultra", availability: "In Stock" }
    ]
  },
  {
    id: "prod_macbook_air_m3",
    title: "Apple MacBook Air M3 (16GB RAM / 512GB SSD)",
    brand: "Apple",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 3100,
    specs: {
      "Processor": "Apple M3 8-Core CPU / 10-Core GPU",
      "RAM": "16GB Unified High-Speed Memory",
      "Storage": "512GB Fast PCIe SSD",
      "Display": "13.6\" Liquid Retina with True Tone (500 nits)"
    },
    offers: [
      { marketplace: "Flipkart", price: 119900, originalPrice: 134900, discount: "11%", url: "https://www.flipkart.com/search?q=macbook+air+m3", availability: "In Stock" },
      { marketplace: "Croma", price: 122900, originalPrice: 134900, discount: "9%", url: "https://www.croma.com/search/?text=macbook+air+m3", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 124900, originalPrice: 134900, discount: "7%", url: "https://www.amazon.in/s?k=macbook+air+m3", availability: "In Stock" }
    ]
  },

  // --- WEARABLES & FASHION ---
  {
    id: "prod_noise_smartwatch",
    title: "Noise ColorFit Pulse 2 Max 1.85\" Calling Smartwatch",
    brand: "Noise",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
    reviewCount: 29000,
    specs: {
      "Display": "1.85\" TFT 550 Nits Brightness",
      "Calling": "BT Calling with Dialpad & Mic",
      "Battery": "10 Days Typical Usage",
      "Sensors": "SpO2, Heart Rate, Sleep Tracking"
    },
    offers: [
      { marketplace: "Flipkart", price: 1399, originalPrice: 5999, discount: "77%", url: "https://www.flipkart.com/search?q=noise+colorfit+pulse+2", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 1499, originalPrice: 5999, discount: "75%", url: "https://www.amazon.in/s?k=noise+smartwatch", availability: "In Stock" },
      { marketplace: "Croma", price: 1599, originalPrice: 5999, discount: "73%", url: "https://www.croma.com/search/?text=noise+colorfit", availability: "In Stock" }
    ]
  },
  {
    id: "prod_levis_tshirt",
    title: "Levi's Classic 100% Pure Cotton Graphic Tee",
    brand: "Levi's",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviewCount: 6500,
    specs: {
      "Fabric": "100% Breathable Cotton",
      "Fit": "Regular Fit Crew Neck",
      "Pattern": "Classic Batwing Logo",
      "Care": "Machine Wash Warm"
    },
    offers: [
      { marketplace: "Shopsy", price: 679, originalPrice: 1499, discount: "55%", url: "https://www.shopsy.in/levis-tee", availability: "In Stock" },
      { marketplace: "Myntra", price: 699, originalPrice: 1499, discount: "53%", url: "https://www.myntra.com/levis-tee", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 749, originalPrice: 1499, discount: "50%", url: "https://www.amazon.in/s?k=levis+tshirt", availability: "In Stock" },
      { marketplace: "Flipkart", price: 799, originalPrice: 1499, discount: "47%", url: "https://www.flipkart.com/search?q=levis+tshirt", availability: "In Stock" }
    ]
  }
];

export function getProductById(id) {
  return PRODUCT_DATABASE.find(p => p.id === id);
}

export function searchProducts(query = "", category = "All") {
  let list = PRODUCT_DATABASE;

  // Category Filtering
  if (category && category !== "All") {
    const catLower = category.toLowerCase();
    if (catLower.includes("cover") || catLower.includes("case")) {
      list = list.filter(p => p.category === "Phone Covers");
    } else if (catLower.includes("footwear") || catLower.includes("shoe")) {
      list = list.filter(p => p.category === "Footwear");
    } else if (catLower.includes("headphone") || catLower.includes("audio")) {
      list = list.filter(p => p.category === "Headphones");
    } else if (catLower.includes("laptop")) {
      list = list.filter(p => p.category === "Laptops");
    } else if (catLower.includes("phone")) {
      list = list.filter(p => p.category === "Smartphones");
    } else if (catLower.includes("wearable")) {
      list = list.filter(p => p.category === "Wearables");
    } else if (catLower.includes("fashion")) {
      list = list.filter(p => p.category === "Fashion");
    }
  }

  // Search Query Matching (Smart Fuzzy Synonyms)
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    
    // Keyword synonyms
    const isCoverSearch = q.includes("cover") || q.includes("case") || q.includes("back cover") || q.includes("guard");
    const isFootwearSearch = q.includes("shoe") || q.includes("slipper") || q.includes("slide") || q.includes("clog") || q.includes("sneaker");
    const isAudioSearch = q.includes("headphone") || q.includes("earbud") || q.includes("airpod") || q.includes("audio") || q.includes("boat") || q.includes("sony");
    const isLaptopSearch = q.includes("laptop") || q.includes("macbook") || q.includes("notebook");
    const isPhoneSearch = q.includes("phone") || q.includes("iphone") || q.includes("samsung") || q.includes("mobile");

    list = list.filter(p => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSynonym = 
        (isCoverSearch && p.category === "Phone Covers") ||
        (isFootwearSearch && p.category === "Footwear") ||
        (isAudioSearch && p.category === "Headphones") ||
        (isLaptopSearch && p.category === "Laptops") ||
        (isPhoneSearch && (p.category === "Smartphones" || p.category === "Phone Covers"));

      return matchTitle || matchBrand || matchCat || matchSynonym;
    });
  }

  return list;
}

export function searchAndCompareProducts({ query = "", category = "All", sortBy = "match" } = {}) {
  const products = searchProducts(query, category).map((product) => {
    const bestOffer = getBestPrice(product);
    return {
      ...product,
      bestPrice: bestOffer.price,
      bestStore: bestOffer.marketplace,
      bestMarketplace: bestOffer.marketplace,
      discount: bestOffer.discount || '20%',
      cheapestDeal: bestOffer
    };
  });

  return products.sort((a, b) => {
    if (sortBy === "price-low") return a.bestPrice - b.bestPrice;
    if (sortBy === "price-high") return b.bestPrice - a.bestPrice;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "discount") {
      const discountVal = (p) => Number.parseInt(p.discount?.replace('%', '') || "0", 10);
      return discountVal(b) - discountVal(a);
    }
    return b.rating - a.rating;
  });
}

export function getBestPrice(product) {
  if (!product?.offers || product.offers.length === 0) return { price: 0, marketplace: 'N/A', discount: '0%' };
  const sorted = [...product.offers].sort((a, b) => a.price - b.price);
  return sorted[0];
}
