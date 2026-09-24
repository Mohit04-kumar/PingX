const mongoose = require('mongoose');
const dns = require('dns');

// On Windows or environments where default ISP DNS fails SRV lookups, set public DNS resolvers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('⚠️ Could not set custom DNS servers:', e.message);
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pingx';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`👉 To connect to MongoDB: Ensure your current IP is whitelisted in MongoDB Atlas Network Access OR run a local MongoDB instance.`);
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

module.exports = connectDB;

