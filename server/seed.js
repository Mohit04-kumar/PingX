const User = require('./models/User');
const Chat = require('./models/Chat');
const Product = require('./models/Product');
const Ping = require('./models/Ping');

const initialAccounts = [
  {
    id: 'user_1',
    name: 'Rahul Verma',
    username: 'rahulv',
    email: 'rahul@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Frontend engineer & PingX enthusiast',
    status: 'online',
    role: 'Admin',
    location: 'Bangalore, India'
  },
  {
    id: 'user_2',
    name: 'Ananya Singh',
    username: 'ananya',
    email: 'ananya@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Product designer & UX researcher',
    status: 'online',
    role: 'Member',
    location: 'Mumbai, India'
  },
  {
    id: 'user_3',
    name: 'Mohit Sharma',
    username: 'mohit',
    email: 'mohit@pingx.app',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    bio: 'Full Stack Engineer & AI Developer',
    status: 'online',
    role: 'Lead Developer',
    location: 'Delhi, India'
  }
];

const initialChats = [
  {
    id: 'chat_user_1_user_2',
    type: 'direct',
    participants: ['user_1', 'user_2'],
    messages: [
      {
        id: 'm1',
        senderId: 'user_1',
        senderName: 'Rahul Verma',
        content: 'Hey Ananya! Welcome to PingX 👋',
        timestamp: new Date().toISOString(),
        status: 'read'
      },
      {
        id: 'm2',
        senderId: 'user_2',
        senderName: 'Ananya Singh',
        content: 'Hey Rahul! Excited to test the MongoDB real-time chat integration 🚀',
        timestamp: new Date().toISOString(),
        status: 'read'
      }
    ],
    lastMessage: {
      content: 'Hey Rahul! Excited to test the MongoDB real-time chat integration 🚀',
      timestamp: new Date().toISOString(),
      senderId: 'user_2'
    }
  }
];

const initialProducts = [
  {
    id: 'p1',
    name: 'Sony WH-CH720N Noise Canceling Headphones',
    title: 'Sony WH-CH720N Noise Canceling Headphones',
    category: 'Electronics',
    subCategory: 'Headphones',
    rating: 4.6,
    reviewsCount: 1420,
    price: 7990,
    originalPrice: 14990,
    discount: '47% OFF',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    merchants: [
      { name: 'Amazon', price: 7990, url: 'https://www.amazon.in/s?k=Sony+WH-CH720N', isLowest: true },
      { name: 'Flipkart', price: 8299, url: 'https://www.flipkart.com/search?q=Sony+WH-CH720N', isLowest: false },
      { name: 'Croma', price: 8490, url: 'https://www.croma.com/search?q=Sony+WH-CH720N', isLowest: false }
    ],
    aiSummary: 'Lowest price currently on Amazon (₹7,990). Active Noise Cancellation & ultralight design.'
  },
  {
    id: 'p2',
    name: 'Apple MacBook Air M3 (13.6-inch)',
    title: 'Apple MacBook Air M3 (13.6-inch)',
    category: 'Computers',
    subCategory: 'Laptops',
    rating: 4.9,
    reviewsCount: 3200,
    price: 104900,
    originalPrice: 114900,
    discount: '9% OFF',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    merchants: [
      { name: 'Amazon', price: 104900, url: 'https://www.amazon.in/s?k=MacBook+Air+M3', isLowest: true },
      { name: 'Flipkart', price: 107900, url: 'https://www.flipkart.com/search?q=MacBook+Air+M3', isLowest: false },
      { name: 'Apple Store', price: 114900, url: 'https://www.apple.com/in', isLowest: false }
    ],
    aiSummary: 'Top rated ultraportable laptop with 18h battery life and industry-leading M3 performance.'
  }
];

const seedDatabase = async () => {
  try {
    // Note: User and Chat seeding disabled so database starts from 0 accounts for new registrations
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding initial products into MongoDB...');
      await Product.insertMany(initialProducts);
      console.log('✅ Initial products seeded successfully.');
    }
  } catch (error) {
    console.warn('⚠️ Seeding note:', error.message);
  }
};

module.exports = seedDatabase;
