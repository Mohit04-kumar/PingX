export const MOCK_PINGS = [
  {
    id: "ping_1",
    type: "price_alert",
    badge: "🔥 Price Drop",
    title: "Sony WH-CH720N Headphones Dropped!",
    content: "Your watched headphones dropped from ₹9,499 down to ₹7,990 (16% price drop).",
    timestamp: "10 mins ago",
    read: false,
    action: {
      label: "View Product",
      type: "open_product",
      productId: "p1"
    }
  },
  {
    id: "ping_2",
    type: "reminder",
    badge: "⏰ Reminder",
    title: "Group Viva Rehearsal Meeting",
    content: "Meeting starts in 30 minutes with Rahul and the core engineering team.",
    timestamp: "25 mins ago",
    read: false,
    action: {
      label: "Open Group Chat",
      type: "open_chat",
      chatId: "chat_group_1"
    }
  },
  {
    id: "ping_3",
    type: "ai_suggestion",
    badge: "✨ PingX AI Insight",
    title: "Group Chat Summary Ready",
    content: "PingX AI generated today's summary for 'PingX Core Engineering ⚡'. 3 tasks pending.",
    timestamp: "1 hour ago",
    read: true,
    action: {
      label: "View Summary",
      type: "open_chat_summary",
      chatId: "chat_group_1"
    }
  },
  {
    id: "ping_4",
    type: "social",
    badge: "💬 New Ping",
    title: "Rahul Verma sent a message",
    content: "'Let's meet tomorrow at 6 PM near the main cafeteria.'",
    timestamp: "2 hours ago",
    read: true,
    action: {
      label: "Reply Now",
      type: "open_chat",
      chatId: "chat_1"
    }
  }
];
