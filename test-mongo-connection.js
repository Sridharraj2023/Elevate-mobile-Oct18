import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

console.log('🔍 Testing MongoDB Connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
console.log('MONGO_URI length:', process.env.MONGO_URI?.length);

const testConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:');
    console.log('Error:', error.message);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check if MongoDB Atlas cluster is running');
    console.log('2. Verify IP whitelist includes 0.0.0.0/0');
    console.log('3. Check database user permissions');
    console.log('4. Wait 2-3 minutes for IP changes to take effect');
  }
};

testConnection();
