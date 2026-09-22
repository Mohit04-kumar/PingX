// Quick verification script for Mongoose models and server setup
require('dotenv').config();
const User = require('./models/User');
const Chat = require('./models/Chat');
const FriendRequest = require('./models/FriendRequest');
const Product = require('./models/Product');
const Ping = require('./models/Ping');
const connectDB = require('./config/db');

async function testModels() {
  console.log('🔍 Testing Mongoose Schema validation...');

  // Test User document instantiation
  const testUser = new User({
    name: 'Test Student',
    username: 'teststudent',
    email: 'test@pingx.app',
    bio: 'Testing Mongoose integration'
  });
  const userValidation = testUser.validateSync();
  if (userValidation) {
    console.error('❌ User schema validation failed:', userValidation);
    process.exit(1);
  } else {
    console.log('✅ User schema validated successfully.');
  }

  // Test Chat document instantiation
  const testChat = new Chat({
    type: 'direct',
    participants: ['user_1', 'user_2'],
    messages: [
      {
        senderId: 'user_1',
        senderName: 'Test',
        content: 'Hello World',
        status: 'sent'
      }
    ]
  });
  const chatValidation = testChat.validateSync();
  if (chatValidation) {
    console.error('❌ Chat schema validation failed:', chatValidation);
    process.exit(1);
  } else {
    console.log('✅ Chat schema with embedded messages validated successfully.');
  }

  // Test FriendRequest document instantiation
  const testReq = new FriendRequest({
    senderId: 'user_1',
    receiverId: 'user_2',
    status: 'pending'
  });
  const reqValidation = testReq.validateSync();
  if (reqValidation) {
    console.error('❌ FriendRequest schema validation failed:', reqValidation);
    process.exit(1);
  } else {
    console.log('✅ FriendRequest schema validated successfully.');
  }

  // Test Product document instantiation
  const testProd = new Product({
    name: 'Test Product',
    price: 999,
    category: 'Electronics',
    merchants: [{ name: 'Amazon', price: 999, isLowest: true }]
  });
  const prodValidation = testProd.validateSync();
  if (prodValidation) {
    console.error('❌ Product schema validation failed:', prodValidation);
    process.exit(1);
  } else {
    console.log('✅ Product schema validated successfully.');
  }

  // Test Ping document instantiation
  const testPing = new Ping({
    title: 'New Notification',
    content: 'MongoDB is configured!',
    type: 'system'
  });
  const pingValidation = testPing.validateSync();
  if (pingValidation) {
    console.error('❌ Ping schema validation failed:', pingValidation);
    process.exit(1);
  } else {
    console.log('✅ Ping schema validated successfully.');
  }

  console.log('\n🎉 ALL MONGOOSE MODELS VALIDATED CLEANLY!');
  process.exit(0);
}

testModels();
