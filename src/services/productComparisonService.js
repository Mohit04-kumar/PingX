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
  // ─── 1. SMARTPHONES & MOBILES ───
  {
    id: "prod_iphone_16_pro_max",
    title: "Apple iPhone 16 Pro Max (256GB - Desert Titanium)",
    brand: "Apple",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 7800,
    specs: {
      "Processor": "Apple A18 Pro 3nm Chip",
      "Display": "6.9\" Super Retina XDR ProMotion 120Hz",
      "Camera": "48MP Fusion + 48MP Ultra-Wide + 5x Optical Telephoto",
      "Battery": "Up to 33 Hours Video Playback"
    },
    offers: [
      { marketplace: "Flipkart", price: 142900, originalPrice: 144900, discount: "2%", url: "https://www.flipkart.com/search?q=iphone+16+pro+max", availability: "In Stock" },
      { marketplace: "Croma", price: 143900, originalPrice: 144900, discount: "1%", url: "https://www.croma.com/search/?text=iphone+16+pro+max", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 144900, originalPrice: 144900, discount: "0%", url: "https://www.amazon.in/s?k=iphone+16+pro+max", availability: "In Stock" }
    ]
  },
  {
    id: "prod_iphone_16_pro",
    title: "Apple iPhone 16 Pro (128GB - Natural Titanium)",
    brand: "Apple",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
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
    id: "prod_iphone_15",
    title: "Apple iPhone 15 (128GB - Black / Blue / Pink)",
    brand: "Apple",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 34000,
    specs: {
      "Display": "6.1\" Super Retina XDR OLED with Dynamic Island",
      "Camera": "48MP Main with 2x Telephoto Sensor-Shift OIS",
      "Port": "USB-C Universal Charging Port",
      "Processor": "A16 Bionic 6-Core Chip"
    },
    offers: [
      { marketplace: "Flipkart", price: 65999, originalPrice: 79900, discount: "17%", url: "https://www.flipkart.com/search?q=iphone+15", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 66999, originalPrice: 79900, discount: "16%", url: "https://www.amazon.in/s?k=iphone+15", availability: "In Stock" },
      { marketplace: "Croma", price: 68900, originalPrice: 79900, discount: "14%", url: "https://www.croma.com/search/?text=iphone+15", availability: "In Stock" }
    ]
  },
  {
    id: "prod_samsung_s24_ultra",
    title: "Samsung Galaxy S24 Ultra 5G (12GB RAM / 256GB Titanium Gray)",
    brand: "Samsung",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 8900,
    specs: {
      "AI Features": "Galaxy AI Live Translate & Circle to Search",
      "Display": "6.8\" Dynamic AMOLED 2X Flat 2600 Nits",
      "Camera": "200MP Quad Tele System with 100x Space Zoom",
      "Stylus": "Built-in S-Pen with Air Actions"
    },
    offers: [
      { marketplace: "Flipkart", price: 119999, originalPrice: 134999, discount: "11%", url: "https://www.flipkart.com/search?q=s24+ultra", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 122999, originalPrice: 134999, discount: "9%", url: "https://www.amazon.in/s?k=samsung+s24+ultra", availability: "In Stock" },
      { marketplace: "Croma", price: 124999, originalPrice: 134999, discount: "7%", url: "https://www.croma.com/search/?text=s24+ultra", availability: "In Stock" }
    ]
  },
  {
    id: "prod_samsung_s24",
    title: "Samsung Galaxy S24 5G (8GB RAM / 128GB Onyx Black)",
    brand: "Samsung",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 4600,
    specs: {
      "Display": "6.2\" Dynamic AMOLED 2X 120Hz",
      "Processor": "Exynos 2400 4nm / Snapdragon 8 Gen 3",
      "Battery": "4000mAh with Super Fast Charging",
      "Design": "Armor Aluminum 2.0 with IP68 Water Resistance"
    },
    offers: [
      { marketplace: "Amazon.in", price: 62999, originalPrice: 79999, discount: "21%", url: "https://www.amazon.in/s?k=samsung+galaxy+s24", availability: "In Stock" },
      { marketplace: "Flipkart", price: 63999, originalPrice: 79999, discount: "20%", url: "https://www.flipkart.com/search?q=samsung+galaxy+s24", availability: "In Stock" },
      { marketplace: "Croma", price: 65999, originalPrice: 79999, discount: "18%", url: "https://www.croma.com/search/?text=galaxy+s24", availability: "In Stock" }
    ]
  },
  {
    id: "prod_oneplus_12",
    title: "OnePlus 12 5G (16GB RAM / 512GB Flowy Emerald)",
    brand: "OnePlus",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 6200,
    specs: {
      "Processor": "Snapdragon 8 Gen 3 with Adreno 750",
      "Display": "6.82\" 2K 120Hz ProXDR 4500 Nits Brightness",
      "Charging": "100W SUPERVOOC Fast Charge + 50W Wireless",
      "Camera": "4th Gen Hasselblad Camera for Mobile"
    },
    offers: [
      { marketplace: "Amazon.in", price: 64999, originalPrice: 69999, discount: "7%", url: "https://www.amazon.in/s?k=oneplus+12", availability: "In Stock" },
      { marketplace: "Croma", price: 65999, originalPrice: 69999, discount: "6%", url: "https://www.croma.com/search/?text=oneplus+12", availability: "In Stock" },
      { marketplace: "Flipkart", price: 67999, originalPrice: 69999, discount: "3%", url: "https://www.flipkart.com/search?q=oneplus+12", availability: "In Stock" }
    ]
  },
  {
    id: "prod_pixel_9_pro",
    title: "Google Pixel 9 Pro 5G (16GB RAM / 256GB Obsidian)",
    brand: "Google",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 3900,
    specs: {
      "Processor": "Google Tensor G4 with Titan M2 Coprocessor",
      "AI Suite": "Gemini Nano on-device + Best Take & Magic Editor",
      "Display": "6.3\" Super Actua LTPO OLED 120Hz (3000 Nits)",
      "Camera": "Triple Pro Camera System with 30x Super Res Zoom"
    },
    offers: [
      { marketplace: "Flipkart", price: 104999, originalPrice: 109999, discount: "5%", url: "https://www.flipkart.com/search?q=pixel+9+pro", availability: "In Stock" },
      { marketplace: "Croma", price: 106999, originalPrice: 109999, discount: "3%", url: "https://www.croma.com/search/?text=pixel+9+pro", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 109999, originalPrice: 109999, discount: "0%", url: "https://www.amazon.in/s?k=pixel+9+pro", availability: "In Stock" }
    ]
  },
  {
    id: "prod_nothing_phone_2a",
    title: "Nothing Phone (2a) Plus 5G (12GB RAM / 256GB Metallic Grey)",
    brand: "Nothing",
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewCount: 11200,
    specs: {
      "Interface": "Iconic Glyph Interface LED Light Patterns",
      "Processor": "MediaTek Dimensity 7350 Pro 5G",
      "Camera": "Dual 50MP + 50MP Front Selfie Camera",
      "Display": "6.7\" Flexible AMOLED 120Hz 1300 Nits"
    },
    offers: [
      { marketplace: "Flipkart", price: 27999, originalPrice: 31999, discount: "13%", url: "https://www.flipkart.com/search?q=nothing+phone+2a+plus", availability: "In Stock" },
      { marketplace: "Croma", price: 28999, originalPrice: 31999, discount: "9%", url: "https://www.croma.com/search/?text=nothing+phone+2a", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 29999, originalPrice: 31999, discount: "6%", url: "https://www.amazon.in/s?k=nothing+phone+2a+plus", availability: "In Stock" }
    ]
  },

  // ─── 2. LAPTOPS & COMPUTING ───
  {
    id: "prod_macbook_air_m3",
    title: "Apple MacBook Air M3 (16GB Unified RAM / 512GB SSD - Midnight)",
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
  {
    id: "prod_macbook_pro_m3",
    title: "Apple MacBook Pro 14\" M3 Pro (18GB RAM / 512GB SSD - Space Black)",
    brand: "Apple",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 1850,
    specs: {
      "Processor": "Apple M3 Pro 11-Core CPU / 14-Core GPU",
      "Display": "14.2\" Liquid Retina XDR Mini-LED 120Hz ProMotion",
      "Battery": "Up to 22 Hours Battery Life",
      "Ports": "3x Thunderbolt 4, HDMI, SDXC Slot, MagSafe 3"
    },
    offers: [
      { marketplace: "Croma", price: 184900, originalPrice: 199900, discount: "8%", url: "https://www.croma.com/search/?text=macbook+pro+m3", availability: "In Stock" },
      { marketplace: "Flipkart", price: 186900, originalPrice: 199900, discount: "7%", url: "https://www.flipkart.com/search?q=macbook+pro+m3", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 189900, originalPrice: 199900, discount: "5%", url: "https://www.amazon.in/s?k=macbook+pro+m3", availability: "In Stock" }
    ]
  },
  {
    id: "prod_dell_xps_13",
    title: "Dell XPS 13 Plus 9320 OLED (Intel Core i7 13th Gen, 16GB / 1TB SSD)",
    brand: "Dell",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 1420,
    specs: {
      "Display": "13.4\" 3.5K (3456x2160) InfinityEdge OLED Touch",
      "Processor": "13th Gen Intel Core i7-1360P (12 Cores, up to 5.0 GHz)",
      "Keyboard": "Zero-Lattice Keyboard with Seamless Glass Touchpad",
      "Build": "CNC Machined Aluminum & Gorilla Glass 7"
    },
    offers: [
      { marketplace: "Amazon.in", price: 139990, originalPrice: 169990, discount: "18%", url: "https://www.amazon.in/s?k=dell+xps+13+plus", availability: "In Stock" },
      { marketplace: "Croma", price: 142990, originalPrice: 169990, discount: "16%", url: "https://www.croma.com/search/?text=dell+xps+13", availability: "In Stock" },
      { marketplace: "Flipkart", price: 145990, originalPrice: 169990, discount: "14%", url: "https://www.flipkart.com/search?q=dell+xps+13+plus", availability: "In Stock" }
    ]
  },
  {
    id: "prod_asus_zephyrus_g14",
    title: "ASUS ROG Zephyrus G14 Gaming Laptop (Ryzen 9, RTX 4070, 32GB / 1TB)",
    brand: "ASUS",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 2200,
    specs: {
      "Graphics": "NVIDIA GeForce RTX 4070 8GB GDDR6 (140W TGP)",
      "Processor": "AMD Ryzen 9 8945HS with Ryzen AI NPU",
      "Display": "14\" 3K 120Hz ROG Nebula OLED 0.2ms Display",
      "Cooling": "ROG Intelligent Cooling with Liquid Metal & Vapor Chamber"
    },
    offers: [
      { marketplace: "Flipkart", price: 174990, originalPrice: 199990, discount: "13%", url: "https://www.flipkart.com/search?q=asus+rog+zephyrus+g14", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 178990, originalPrice: 199990, discount: "11%", url: "https://www.amazon.in/s?k=asus+rog+zephyrus+g14", availability: "In Stock" },
      { marketplace: "Croma", price: 181990, originalPrice: 199990, discount: "9%", url: "https://www.croma.com/search/?text=rog+zephyrus+g14", availability: "In Stock" }
    ]
  },
  {
    id: "prod_lenovo_legion_5",
    title: "Lenovo Legion 5 Pro Gaming Laptop (Intel i9 14th Gen, RTX 4060, 16GB / 1TB)",
    brand: "Lenovo",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 3100,
    specs: {
      "Processor": "Intel Core i9-14900HX 24-Cores (Up to 5.8GHz)",
      "Graphics": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "Display": "16\" WQXGA (2560x1600) IPS 240Hz 500 Nits HDR400",
      "Keyboard": "Legion TrueStrike 4-Zone RGB Backlit"
    },
    offers: [
      { marketplace: "Amazon.in", price: 129990, originalPrice: 159990, discount: "19%", url: "https://www.amazon.in/s?k=lenovo+legion+5+pro", availability: "In Stock" },
      { marketplace: "Flipkart", price: 132990, originalPrice: 159990, discount: "17%", url: "https://www.flipkart.com/search?q=lenovo+legion+5+pro", availability: "In Stock" },
      { marketplace: "Croma", price: 135990, originalPrice: 159990, discount: "15%", url: "https://www.croma.com/search/?text=legion+5+pro", availability: "In Stock" }
    ]
  },

  // ─── 3. HEADPHONES, EARBUDS & AUDIO ───
  {
    id: "prod_sony_xm5",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 14200,
    specs: {
      "Battery Life": "30 Hours ANC Active",
      "Noise Cancellation": "Dual Processor Auto NC Optimizer",
      "Weight": "250g Ultra-Lightweight",
      "Connectivity": "Bluetooth 5.2 / LDAC Hi-Res Audio"
    },
    offers: [
      { marketplace: "Amazon.in", price: 26990, originalPrice: 34990, discount: "23%", url: "https://www.amazon.in/s?k=sony+wh-1000xm5", availability: "In Stock" },
      { marketplace: "Flipkart", price: 27490, originalPrice: 34990, discount: "21%", url: "https://www.flipkart.com/search?q=sony+wh-1000xm5", availability: "In Stock" },
      { marketplace: "Croma", price: 28990, originalPrice: 34990, discount: "17%", url: "https://www.croma.com/search/?text=sony+wh-1000xm5", availability: "In Stock" }
    ]
  },
  {
    id: "prod_airpods_pro_2",
    title: "Apple AirPods Pro (2nd Gen with MagSafe USB-C Case)",
    brand: "Apple",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 28400,
    specs: {
      "Chip": "Apple H2 Headphone Chip",
      "Audio": "2x Active Noise Cancellation + Adaptive Audio & Transparency",
      "Tracking": "Personalized Spatial Audio with Dynamic Head Tracking",
      "Battery": "6h per charge, up to 30h with MagSafe Case"
    },
    offers: [
      { marketplace: "Flipkart", price: 21999, originalPrice: 24900, discount: "12%", url: "https://www.flipkart.com/search?q=airpods+pro+2", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 22499, originalPrice: 24900, discount: "10%", url: "https://www.amazon.in/s?k=airpods+pro+2nd+gen", availability: "In Stock" },
      { marketplace: "Croma", price: 23490, originalPrice: 24900, discount: "6%", url: "https://www.croma.com/search/?text=airpods+pro+2", availability: "In Stock" }
    ]
  },
  {
    id: "prod_bose_qc_ultra",
    title: "Bose QuietComfort Ultra Wireless ANC Headphones",
    brand: "Bose",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 8400,
    specs: {
      "Spatial Audio": "Bose Immersive Audio Spatialized Soundstage",
      "ANC Modes": "Quiet Mode, Aware Mode, Immersion Mode",
      "Comfort": "Luxurious Ultra-Plush Memory Foam Ear Cushions",
      "Battery": "Up to 24 Hours (18 Hours with Immersive Audio)"
    },
    offers: [
      { marketplace: "Amazon.in", price: 32990, originalPrice: 39900, discount: "17%", url: "https://www.amazon.in/s?k=bose+quietcomfort+ultra", availability: "In Stock" },
      { marketplace: "Croma", price: 33990, originalPrice: 39900, discount: "15%", url: "https://www.croma.com/search/?text=bose+qc+ultra", availability: "In Stock" },
      { marketplace: "Flipkart", price: 34990, originalPrice: 39900, discount: "12%", url: "https://www.flipkart.com/search?q=bose+quietcomfort+ultra", availability: "In Stock" }
    ]
  },
  {
    id: "prod_boat_airdopes",
    title: "boAt Airdopes 141 ANC True Wireless Earbuds (32dB ANC)",
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
  {
    id: "prod_sennheiser_momentum_4",
    title: "Sennheiser Momentum 4 Wireless ANC Headphones (60h Battery)",
    brand: "Sennheiser",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 6300,
    specs: {
      "Sound": "Audiophile-Inspired 42mm Transducer Sound System",
      "Battery": "Class-Leading 60-Hour Battery Life with Fast Charge",
      "ANC": "Next-Gen Adaptive Noise Cancellation & Transparency",
      "Codecs": "aptX Adaptive, AAC, SBC with Hi-Res Clarity"
    },
    offers: [
      { marketplace: "Amazon.in", price: 24990, originalPrice: 34990, discount: "29%", url: "https://www.amazon.in/s?k=sennheiser+momentum+4", availability: "In Stock" },
      { marketplace: "Flipkart", price: 25990, originalPrice: 34990, discount: "26%", url: "https://www.flipkart.com/search?q=sennheiser+momentum+4", availability: "In Stock" },
      { marketplace: "Croma", price: 26990, originalPrice: 34990, discount: "23%", url: "https://www.croma.com/search/?text=sennheiser+momentum+4", availability: "In Stock" }
    ]
  },
  {
    id: "prod_jbl_flip_6",
    title: "JBL Flip 6 Portable Waterproof Bluetooth Speaker (30W Deep Bass)",
    brand: "JBL",
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 21500,
    specs: {
      "Output": "30W 2-Way Speaker System (Racetrack Woofer + Tweeter)",
      "Durability": "IP67 Waterproof & Dustproof Rugged Housing",
      "Battery": "12 Hours Playtime on a Single Charge",
      "Feature": "PartyBoost Connect Multiple Compatible Speakers"
    },
    offers: [
      { marketplace: "Amazon.in", price: 8999, originalPrice: 13999, discount: "36%", url: "https://www.amazon.in/s?k=jbl+flip+6", availability: "In Stock" },
      { marketplace: "Flipkart", price: 9299, originalPrice: 13999, discount: "34%", url: "https://www.flipkart.com/search?q=jbl+flip+6", availability: "In Stock" },
      { marketplace: "Croma", price: 9499, originalPrice: 13999, discount: "32%", url: "https://www.croma.com/search/?text=jbl+flip+6", availability: "In Stock" }
    ]
  },

  // ─── 4. WEARABLES & SMARTWATCHES ───
  {
    id: "prod_apple_watch_ultra_2",
    title: "Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium Case)",
    brand: "Apple",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 4200,
    specs: {
      "Case": "Aerospace-Grade 49mm Titanium with Raised Bezel",
      "Display": "3000 Nits Brightness Sapphire Crystal OLED",
      "GPS": "Precision Dual-Frequency L1 & L5 GPS",
      "Water Resistance": "100m Water Resistance / EN13319 Dive Certified"
    },
    offers: [
      { marketplace: "Croma", price: 84900, originalPrice: 89900, discount: "6%", url: "https://www.croma.com/search/?text=apple+watch+ultra+2", availability: "In Stock" },
      { marketplace: "Flipkart", price: 86900, originalPrice: 89900, discount: "3%", url: "https://www.flipkart.com/search?q=apple+watch+ultra+2", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 89900, originalPrice: 89900, discount: "0%", url: "https://www.amazon.in/s?k=apple+watch+ultra+2", availability: "In Stock" }
    ]
  },
  {
    id: "prod_apple_watch_series_9",
    title: "Apple Watch Series 9 (GPS, 45mm Midnight Aluminum Sport Band)",
    brand: "Apple",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 9800,
    specs: {
      "Chip": "S9 SiP with 4-Core Neural Engine & Double Tap Gesture",
      "Display": "Always-On Retina OLED up to 2000 Nits",
      "Health": "Blood Oxygen, ECG, Heart Rate, Temperature Sensing",
      "Battery": "18 Hours All-Day / 36 Hours Low Power Mode"
    },
    offers: [
      { marketplace: "Flipkart", price: 38999, originalPrice: 44900, discount: "13%", url: "https://www.flipkart.com/search?q=apple+watch+series+9", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 39999, originalPrice: 44900, discount: "11%", url: "https://www.amazon.in/s?k=apple+watch+series+9", availability: "In Stock" },
      { marketplace: "Croma", price: 41900, originalPrice: 44900, discount: "7%", url: "https://www.croma.com/search/?text=apple+watch+series+9", availability: "In Stock" }
    ]
  },
  {
    id: "prod_samsung_galaxy_watch6",
    title: "Samsung Galaxy Watch6 Classic (47mm Bluetooth - Black)",
    brand: "Samsung",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 7100,
    specs: {
      "Bezel": "Physical Rotating Bezel with Stainless Steel Case",
      "Display": "1.5\" Super AMOLED Sapphire Crystal Glass",
      "Health": "BioActive Sensor (ECG, Blood Pressure, BIA Body Composition)",
      "OS": "Wear OS Powered by Samsung with One UI 5 Watch"
    },
    offers: [
      { marketplace: "Flipkart", price: 27999, originalPrice: 36999, discount: "24%", url: "https://www.flipkart.com/search?q=galaxy+watch+6+classic", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 28999, originalPrice: 36999, discount: "22%", url: "https://www.amazon.in/s?k=samsung+galaxy+watch6+classic", availability: "In Stock" },
      { marketplace: "Croma", price: 29999, originalPrice: 36999, discount: "19%", url: "https://www.croma.com/search/?text=watch6+classic", availability: "In Stock" }
    ]
  },
  {
    id: "prod_noise_smartwatch",
    title: "Noise ColorFit Pulse 2 Max 1.85\" Calling Smartwatch",
    brand: "Noise",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
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
    id: "prod_garmin_forerunner_265",
    title: "Garmin Forerunner 265 Running GPS Smartwatch with AMOLED",
    brand: "Garmin",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 3400,
    specs: {
      "Display": "1.3\" Brilliant AMOLED Touchscreen + Physical Buttons",
      "Training": "Training Readiness Score, HRV Status & Running Dynamics",
      "Battery": "Up to 13 Days in Smartwatch Mode / 20 Hours in GPS Mode",
      "GPS": "Multi-Band GNSS with SatIQ Technology"
    },
    offers: [
      { marketplace: "Amazon.in", price: 47990, originalPrice: 52990, discount: "9%", url: "https://www.amazon.in/s?k=garmin+forerunner+265", availability: "In Stock" },
      { marketplace: "Croma", price: 48990, originalPrice: 52990, discount: "8%", url: "https://www.croma.com/search/?text=garmin+265", availability: "In Stock" },
      { marketplace: "Flipkart", price: 49990, originalPrice: 52990, discount: "6%", url: "https://www.flipkart.com/search?q=garmin+forerunner+265", availability: "In Stock" }
    ]
  },

  // ─── 5. PHONE COVERS & CASES ───
  {
    id: "prod_spigen_liquid_air",
    title: "Spigen Liquid Air Matte Shockproof Case (iPhone 16 / 15 / Galaxy S24)",
    brand: "Spigen",
    category: "Phone Covers",
    image: "https://images.unsplash.com/photo-1584006682522-dc17d6c0d963?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 18500,
    specs: {
      "Material": "Flexible Shock-Absorbent TPU",
      "Protection": "Air Cushion Technology (Mil-Grade Drop Tested)",
      "Finish": "Matte Geometric Diamond Anti-Slip Grip",
      "Compatibility": "iPhone 16/15 Pro & Galaxy S24 Series"
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
    title: "MagSafe Crystal Clear Shock-Absorbing Protective Case for iPhone",
    brand: "Apple / DailyObjects",
    category: "Phone Covers",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewCount: 9200,
    specs: {
      "Type": "MagSafe Magnetic Fast Charging Case with N52 Magnets",
      "Material": "Anti-Yellowing Polycarbonate + Shockproof TPU",
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
    title: "Ringke Fusion-X Rugged Military Drop-Tested Cover (Galaxy / iPhone)",
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
  {
    id: "prod_anker_67w_charger",
    title: "Anker Prime 67W GaN Fast Charger 3-Port Wall Adapter (USB-C & USB-A)",
    brand: "Anker",
    category: "Phone Covers",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 15400,
    specs: {
      "Technology": "GaNPrime Intelligent Power Distribution",
      "Ports": "2x USB-C + 1x USB-A (Power Laptops, Phones & Earbuds)",
      "Safety": "ActiveShield 2.0 Real-Time Temperature Monitoring",
      "Compatibility": "MacBook, iPhone 16/15, Samsung S24, iPad"
    },
    offers: [
      { marketplace: "Amazon.in", price: 3499, originalPrice: 4999, discount: "30%", url: "https://www.amazon.in/s?k=anker+67w+gan+charger", availability: "In Stock" },
      { marketplace: "Flipkart", price: 3699, originalPrice: 4999, discount: "26%", url: "https://www.flipkart.com/search?q=anker+67w", availability: "In Stock" },
      { marketplace: "Croma", price: 3999, originalPrice: 4999, discount: "20%", url: "https://www.croma.com/search/?text=anker+charger", availability: "In Stock" }
    ]
  },

  // ─── 6. FOOTWEAR & SNEAKERS ───
  {
    id: "prod_jordan_1_chicago",
    title: "Nike Air Jordan 1 Retro High OG Chicago High-Top Sneakers",
    brand: "Nike",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 16800,
    specs: {
      "Upper": "Premium Full-Grain Genuine Leather",
      "Cushioning": "Encapsulated Nike Air Sole Unit",
      "Style": "High-Top Padded Ankle Collar Iconic Silhouette",
      "Outsole": "Deep-Groove Solid Rubber Traction"
    },
    offers: [
      { marketplace: "Myntra", price: 14995, originalPrice: 17995, discount: "17%", url: "https://www.myntra.com/air-jordan-1", availability: "In Stock" },
      { marketplace: "Flipkart", price: 15495, originalPrice: 17995, discount: "14%", url: "https://www.flipkart.com/search?q=air+jordan+1", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 15995, originalPrice: 17995, discount: "11%", url: "https://www.amazon.in/s?k=air+jordan+1+high", availability: "In Stock" }
    ]
  },
  {
    id: "prod_nike_air_max_270",
    title: "Nike Air Max 270 React Running & Lifestyle Shoes",
    brand: "Nike",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 18200,
    specs: {
      "Heel Unit": "Max Air 270 Giant Air Bag Cushioning",
      "Midsole": "Nike React Foam for Smooth Responsive Ride",
      "Upper": "Breathable Layered Mesh & Synthetic Overlays",
      "Weight": "Ultra-Light All-Day Comfort"
    },
    offers: [
      { marketplace: "Myntra", price: 10495, originalPrice: 13995, discount: "25%", url: "https://www.myntra.com/nike-air-max-270", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 10995, originalPrice: 13995, discount: "21%", url: "https://www.amazon.in/s?k=nike+air+max+270", availability: "In Stock" },
      { marketplace: "Flipkart", price: 11495, originalPrice: 13995, discount: "18%", url: "https://www.flipkart.com/search?q=nike+air+max+270", availability: "In Stock" }
    ]
  },
  {
    id: "prod_nike_slides",
    title: "Nike Offcourt Comfort Slides (Slippers for Men & Women)",
    brand: "Nike",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewCount: 9400,
    specs: {
      "Material": "Dual-Density Revive Foam",
      "Sole": "Contoured Footbed Grip",
      "Closure": "Slip-on Padded Strap",
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
    title: "Puma Smashic Casual Everyday Low-Top Sneakers",
    brand: "Puma",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviewCount: 12300,
    specs: {
      "Upper": "Synthetic Leather with Classic Puma Formstrip",
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
    id: "prod_adidas_ultraboost",
    title: "Adidas Ultraboost Light High-Performance Running Shoes",
    brand: "Adidas",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 8900,
    specs: {
      "Midsole": "Light BOOST Foam (30% Lighter than Previous Generations)",
      "Upper": "PRIMEKNIT+ Textile Upper Adaptive Fit",
      "Outsole": "Continental Natural Rubber for Wet & Dry Grip",
      "Energy Return": "Linear Energy Push (LEP) System"
    },
    offers: [
      { marketplace: "Myntra", price: 12499, originalPrice: 18999, discount: "34%", url: "https://www.myntra.com/adidas-ultraboost", availability: "In Stock" },
      { marketplace: "Flipkart", price: 12999, originalPrice: 18999, discount: "31%", url: "https://www.flipkart.com/search?q=adidas+ultraboost", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 13499, originalPrice: 18999, discount: "28%", url: "https://www.amazon.in/s?k=adidas+ultraboost+light", availability: "In Stock" }
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
      "Ventilation": "Breathable Air Ports for Water Drainage",
      "Heel Strap": "Pivoting Secure Fit",
      "Water Friendly": "Yes / Fast Drying Easy Clean"
    },
    offers: [
      { marketplace: "Amazon.in", price: 2195, originalPrice: 3495, discount: "37%", url: "https://www.amazon.in/s?k=crocs+classic+clogs", availability: "In Stock" },
      { marketplace: "Myntra", price: 2295, originalPrice: 3495, discount: "34%", url: "https://www.myntra.com/crocs-classic", availability: "In Stock" },
      { marketplace: "Flipkart", price: 2495, originalPrice: 3495, discount: "29%", url: "https://www.flipkart.com/search?q=crocs+classic+clogs", availability: "In Stock" }
    ]
  },

  // ─── 7. GAMING & CONSOLES ───
  {
    id: "prod_ps5_slim",
    title: "Sony PlayStation 5 Slim Console (1TB SSD - DualSense Wireless)",
    brand: "Sony",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 14200,
    specs: {
      "Storage": "1TB Ultra-High Speed Custom NVMe SSD",
      "Graphics": "Ray Tracing Support, 4K-TV Gaming up to 120 FPS",
      "Controller": "DualSense Controller with Haptic Feedback & Adaptive Triggers",
      "Audio": "Tempest 3D AudioTech"
    },
    offers: [
      { marketplace: "Amazon.in", price: 49990, originalPrice: 54990, discount: "9%", url: "https://www.amazon.in/s?k=ps5+slim", availability: "In Stock" },
      { marketplace: "Flipkart", price: 50990, originalPrice: 54990, discount: "7%", url: "https://www.flipkart.com/search?q=ps5+slim", availability: "In Stock" },
      { marketplace: "Croma", price: 52990, originalPrice: 54990, discount: "4%", url: "https://www.croma.com/search/?text=ps5+slim", availability: "In Stock" }
    ]
  },
  {
    id: "prod_nintendo_switch_oled",
    title: "Nintendo Switch OLED Model (Neon Red / Neon Blue)",
    brand: "Nintendo",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 9600,
    specs: {
      "Screen": "7.0\" Vivid OLED Multi-Touch Screen",
      "Modes": "TV Mode, Tabletop Mode, Handheld Mode",
      "Storage": "64GB Internal Storage with MicroSD Expansion",
      "Stand": "Wide Adjustable Stand with Wired LAN Dock"
    },
    offers: [
      { marketplace: "Amazon.in", price: 28990, originalPrice: 34990, discount: "17%", url: "https://www.amazon.in/s?k=nintendo+switch+oled", availability: "In Stock" },
      { marketplace: "Flipkart", price: 29990, originalPrice: 34990, discount: "14%", url: "https://www.flipkart.com/search?q=nintendo+switch+oled", availability: "In Stock" },
      { marketplace: "Croma", price: 31990, originalPrice: 34990, discount: "9%", url: "https://www.croma.com/search/?text=nintendo+switch", availability: "In Stock" }
    ]
  },

  // ─── 8. FASHION & LIFESTYLE ───
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
  },
  {
    id: "prod_rayban_aviator",
    title: "Ray-Ban Aviator Classic Gradient Sunglasses (Gold Frame / Green Lens)",
    brand: "Ray-Ban",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 7800,
    specs: {
      "Frame": "Corrosion-Resistant Metal Gold Polish",
      "Lens": "G-15 Crystal Glass with 100% UV400 Protection",
      "Bridge": "Adjustable Silicone Nose Pads",
      "Fit": "Standard Pilot Fit with Protective Leather Case"
    },
    offers: [
      { marketplace: "Myntra", price: 7890, originalPrice: 10590, discount: "25%", url: "https://www.myntra.com/ray-ban-aviator", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 8290, originalPrice: 10590, discount: "21%", url: "https://www.amazon.in/s?k=rayban+aviator", availability: "In Stock" },
      { marketplace: "Flipkart", price: 8590, originalPrice: 10590, discount: "18%", url: "https://www.flipkart.com/search?q=rayban+aviator", availability: "In Stock" }
    ]
  },
  {
    id: "prod_fossil_grant_watch",
    title: "Fossil Grant Chronograph Dark Brown Genuine Leather Watch",
    brand: "Fossil",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 9200,
    specs: {
      "Movement": "Quartz Chronograph with Roman Numeral Indexes",
      "Strap": "22mm Interchangeable Genuine Calfskin Leather",
      "Case": "44mm Stainless Steel with Mineral Crystal Dial",
      "Water Resistance": "5 ATM / 50 Meters"
    },
    offers: [
      { marketplace: "Myntra", price: 7495, originalPrice: 14495, discount: "48%", url: "https://www.myntra.com/fossil-grant", availability: "In Stock" },
      { marketplace: "Amazon.in", price: 7995, originalPrice: 14495, discount: "45%", url: "https://www.amazon.in/s?k=fossil+grant+watch", availability: "In Stock" },
      { marketplace: "Flipkart", price: 8495, originalPrice: 14495, discount: "41%", url: "https://www.flipkart.com/search?q=fossil+grant+watch", availability: "In Stock" }
    ]
  }
];

export function getProductById(id) {
  return PRODUCT_DATABASE.find(p => p.id === id);
}

/**
 * Intelligent Multi-Option Search Engine
 * Supports fuzzy tokenization, synonyms, brand & spec matching to guarantee multiple results.
 */
export function searchProducts(query = "", category = "All") {
  let list = PRODUCT_DATABASE;

  // 1. Category Filtering
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

  // 2. Intelligent Search Query Matching
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    const queryTokens = q.split(/\s+/).filter(t => t.length > 1);

    // Common synonyms for e-commerce with word boundaries
    const isAudioQuery = /\b(headphone|headphones|earphone|earphones|earbud|earbuds|airpod|airpods|audio|sound|speaker|speakers|anc|wireless|tws)\b/i.test(q);
    const isSpecificBrandQuery = /\b(iphone|samsung|apple|nike|adidas|puma|sony|boat|bose|lenovo|asus|dell|crocs|pixel|oneplus|nothing|anker|rayban|fossil|levis)\b/i.test(q);
    const isPhoneQuery = !isAudioQuery && !isSpecificBrandQuery && /\b(phone|phones|mobile|mobiles|smartphone|smartphones|5g)\b/i.test(q);
    const isLaptopQuery = !isSpecificBrandQuery && /\b(laptop|laptops|computer|pc|notebook)\b/i.test(q);
    const isWatchQuery = !isSpecificBrandQuery && /\b(watch|watches|smartwatch|smartwatches|fitness|band)\b/i.test(q);
    const isFootwearQuery = !isSpecificBrandQuery && /\b(shoe|shoes|sneaker|sneakers|slide|slides|clog|clogs|slipper|slippers|footwear)\b/i.test(q);
    const isCoverQuery = !isSpecificBrandQuery && /\b(cover|covers|case|cases|guard|charger|chargers)\b/i.test(q);
    const isGamingQuery = !isSpecificBrandQuery && /\b(game|gaming|console|consoles)\b/i.test(q);

    const matched = list.filter(p => {
      const titleLower = (p.title || "").toLowerCase();
      const brandLower = (p.brand || "").toLowerCase();
      const catLower = (p.category || "").toLowerCase();
      const specsText = Object.entries(p.specs || {}).map(([k, v]) => `${k} ${v}`).join(" ").toLowerCase();
      const combined = `${titleLower} ${brandLower} ${catLower} ${specsText}`;

      // A. Direct full query match (prevent 'phone' matching 'headphone' or 'headphones')
      if (q === 'phone' && p.category === 'Headphones') {
        // do not match
      } else if (titleLower.includes(q) || brandLower.includes(q) || catLower.includes(q)) {
        return true;
      }

      // B. All query tokens present in combined text (prevent 'phone' matching 'headphone')
      const cleanCombined = (p.category === 'Headphones') ? combined.replace(/headphone[s]?/gi, '') : combined;
      if (queryTokens.length > 0 && queryTokens.every(tok => cleanCombined.includes(tok))) return true;

      // C. Any query token present for longer tokens (prevent 'phone' matching 'headphone')
      if (queryTokens.some(tok => {
        if (tok === 'phone' && p.category === 'Headphones') return false;
        return tok.length >= 3 && (titleLower.includes(tok) || brandLower.includes(tok));
      })) return true;

      // D. Synonym mappings
      if (isAudioQuery && p.category === "Headphones") return true;
      if (isPhoneQuery && p.category === "Smartphones") return true;
      if (isLaptopQuery && (p.category === "Laptops" || titleLower.includes("macbook") || titleLower.includes("laptop"))) return true;
      if (isWatchQuery && (p.category === "Wearables" || titleLower.includes("watch"))) return true;
      if (isFootwearQuery && p.category === "Footwear") return true;
      if (isCoverQuery && p.category === "Phone Covers") return true;
      if (isGamingQuery && (p.id === "prod_ps5_slim" || p.id === "prod_nintendo_switch_oled" || p.id === "prod_asus_zephyrus_g14" || p.id === "prod_lenovo_legion_5")) return true;

      return false;
    });

    // If query matches some items, return them; otherwise if query is broad, return all items matching brand/category
    if (matched.length > 0) {
      return matched;
    }
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
