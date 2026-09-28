const mongoose = require('mongoose');
const dns = require('dns');

// On Windows or environments where default ISP DNS fails SRV lookups, set public DNS resolvers
if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    console.warn('⚠️ Could not set custom DNS servers:', e.message);
  }
}

const DEFAULT_ATLAS_URI = 'mongodb+srv://mrmohitkumar004_db_user:dk50ILaPswZFzDK9@cluster0.hqfkwu6.mongodb.net/pingx?retryWrites=true&w=majority&appName=Cluster0';

let lastError = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    lastError = null;
    return conn;
  } catch (error) {
    lastError = error.message;
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`👉 To connect to MongoDB: Ensure your current IP is whitelisted in MongoDB Atlas Network Access OR run a local MongoDB instance.`);
    return null;
  }
};

connectDB.getLastError = () => lastError;

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

module.exports = connectDB;

