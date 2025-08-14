import mongoose from 'mongoose';

async function testConnection() {
  const MONGODB_URI = 'mongodb://localhost:27017/handcrafted-haven';
  
  console.log('🧪 Testing MongoDB connection...');
  console.log(`📍 Connecting to: ${MONGODB_URI}`);
  
  try {
    // Set a short timeout for the connection
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      bufferCommands: false,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📚 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
