/**
 * PingX Core Application Configuration
 */

export const APP_CONFIG = {
  name: "PingX",
  tagline: "Connect. Communicate. Discover.",
  subTagline: "One place to connect, chat, discover and get things done.",
  heroHeading: "A smarter way to chat, explore and get things done.",
  
  brand: {
    pingText: "Ping",
    xText: "X"
  },

  features: {
    enableGeminiApi: true,
    enableMockShopping: true,
    enablePriceWatch: true,
    enableFocusMode: true,
    enableSmartGroupSummary: true
  },

  supportedMerchants: [
    { id: "amazon", name: "Amazon", color: "#FF9900", bg: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    { id: "flipkart", name: "Flipkart", color: "#2874F0", bg: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { id: "croma", name: "Croma", color: "#00E5D1", bg: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
    { id: "reliance", name: "Reliance Digital", color: "#E42529", bg: "bg-red-500/10 text-red-500 border-red-500/20" }
  ]
};
