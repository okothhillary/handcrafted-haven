// Manual Review Adder - Simple Node.js script
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/handcrafted-haven';

async function addManualReview() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const reviewsCollection = db.collection('reviews');
    
    // Add a sample review
    const review = {
      productId: 1, // Static product ID
      userId: 'user123',
      userName: 'John Doe',
      rating: 5,
      title: 'Amazing Product!',
      content: 'This is a fantastic handcrafted item. The quality is outstanding and it arrived quickly.',
      verified: true,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await reviewsCollection.insertOne(review);
    console.log('✅ Review added:', result.insertedId);
    
    // List all reviews
    const allReviews = await reviewsCollection.find({}).toArray();
    console.log('\n📋 All Reviews:');
    allReviews.forEach(review => {
      console.log(`   Product ${review.productId}: ${review.title} (${review.rating}⭐)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

addManualReview();
