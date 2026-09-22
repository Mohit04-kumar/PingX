export const MOCK_CHATS = [
  {
    id: "chat_1",
    type: "direct",
    user: {
      id: "user_1",
      name: "Rahul Verma",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      status: "online"
    },
    unreadCount: 2,
    pinned: true,
    lastMessage: {
      content: "Let's meet tomorrow at 6 PM near the main cafeteria.",
      timestamp: "10:42 AM",
      senderId: "user_1",
      actionable: {
        type: "reminder",
        title: "Meeting with Rahul",
        date: "Tomorrow, 6:00 PM",
        location: "Main Cafeteria"
      }
    },
    messages: [
      {
        id: "m1",
        senderId: "user_1",
        senderName: "Rahul Verma",
        content: "Hey Priyanjali! Have you reviewed the PingX UI mockup?",
        timestamp: "10:30 AM",
        status: "read"
      },
      {
        id: "m2",
        senderId: "user_me",
        senderName: "Priyanjali",
        content: "Yes! The glassmorphic AI assistant floating panel looks incredible 🚀",
        timestamp: "10:32 AM",
        status: "read"
      },
      {
        id: "m3",
        senderId: "user_1",
        senderName: "Rahul Verma",
        content: "Awesome! Let's meet tomorrow at 6 PM near the main cafeteria.",
        timestamp: "10:42 AM",
        status: "delivered",
        suggestedReplies: [
          "Sure, see you tomorrow at 6 PM!",
          "Can we reschedule to 7 PM instead?",
          "I'll confirm by evening."
        ],
        actionable: {
          type: "reminder",
          title: "Meeting with Rahul",
          date: "Tomorrow, 6:00 PM",
          location: "Main Cafeteria"
        }
      }
    ]
  },
  {
    id: "chat_group_1",
    type: "group",
    group: {
      id: "grp_1",
      name: "PingX Core Engineering ⚡",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80",
      membersCount: 6,
      members: ["user_me", "user_1", "user_2", "user_3", "user_5", "user_8"]
    },
    unreadCount: 0,
    pinned: true,
    lastMessage: {
      content: "Rahul: I'll arrange transportation for Sunday's demo presentation.",
      timestamp: "11:15 AM",
      senderId: "user_1"
    },
    messages: [
      {
        id: "gm1",
        senderId: "user_3",
        senderName: "Dev Team Lead",
        content: "Team, the final year project viva is approaching. We need to align on 6 PM presentation.",
        timestamp: "11:00 AM"
      },
      {
        id: "gm2",
        senderId: "user_2",
        senderName: "Ananya Roy",
        content: "Agreed! Can we move the prep meeting to Sunday at 6 PM?",
        timestamp: "11:05 AM"
      },
      {
        id: "gm3",
        senderId: "user_1",
        senderName: "Rahul Verma",
        content: "Everyone agreed on 6 PM. I will arrange transportation for Sunday's demo presentation.",
        timestamp: "11:15 AM"
      }
    ],
    summary: {
      todaysSummary: [
        "Meeting moved to Sunday at 6 PM.",
        "Everyone agreed on the 6 PM slot.",
        "Rahul will arrange transportation."
      ],
      decisions: [
        "Final year project presentation date finalized for Sunday.",
        "Transportation duty assigned to Rahul."
      ],
      tasks: [
        "Priyanjali: Complete PingX frontend build",
        "Rahul: Logistics & transportation setup",
        "Ananya: Design slide deck review"
      ],
      importantMessages: [
        "Sunday 6 PM - Viva rehearsal in Block C"
      ]
    }
  },
  {
    id: "chat_2",
    type: "direct",
    user: {
      id: "user_2",
      name: "Ananya Roy",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      status: "online"
    },
    unreadCount: 0,
    pinned: false,
    lastMessage: {
      content: "Could you send me the latest price comparison report for wireless headphones?",
      timestamp: "9:15 AM",
      senderId: "user_2"
    },
    messages: [
      {
        id: "m2_1",
        senderId: "user_2",
        senderName: "Ananya Roy",
        content: "Hey, I saw PingX Shop recommended Sony vs JBL headphones!",
        timestamp: "9:10 AM"
      },
      {
        id: "m2_2",
        senderId: "user_2",
        senderName: "Ananya Roy",
        content: "Could you send me the latest price comparison report for wireless headphones?",
        timestamp: "9:15 AM",
        suggestedReplies: [
          "Sure, I'll send it by 8 PM.",
          "I'll need until tomorrow morning.",
          "I've already saved it in PingX Shop!"
        ]
      }
    ]
  },
  {
    id: "chat_3",
    type: "direct",
    user: {
      id: "user_5",
      name: "Aarav Mehta",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      status: "online"
    },
    unreadCount: 1,
    pinned: false,
    lastMessage: {
      content: "Check out this laptop deal on Amazon! ₹58,999 down from ₹69,999.",
      timestamp: "Yesterday",
      senderId: "user_5"
    },
    messages: [
      {
        id: "m3_1",
        senderId: "user_5",
        senderName: "Aarav Mehta",
        content: "Check out this laptop deal on Amazon! ₹58,999 down from ₹69,999.",
        timestamp: "Yesterday",
        actionable: {
          type: "product",
          title: "Asus ROG Gaming Laptop",
          price: "₹58,999",
          merchant: "Amazon"
        }
      }
    ]
  }
];
