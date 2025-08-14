#!/usr/bin/env node

const mongoose = require('mongoose');

// Simple product schema for migration
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  status: { type: String, default: 'active' },
  reviews: [],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Sample products from your static data
const products = [
  {
    name: "Handwoven Ceramic Bowl",
    description: "A beautiful handwoven ceramic bowl perfect for serving or as a decorative piece.",
    price: 45,
    images: ["/images/products/ceramic-bowl.jpg"],
    category: "pottery"
  },
  {
    name: "Macrame Wall Hanging", 
    description: "Intricate macrame wall hanging that adds bohemian charm to any space.",
    price: 78,
    images: ["/images/products/macrame-wall.jpg"],
    category: "textiles"
  }
];

async function simpleMigration() {
  try {
    console.log('🚀 Starting simple migration...');
    
    await mongoose.connect('mongodb://localhost:27017/handcrafted-haven');
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`✅ Inserted ${result.length} products`);
    
    result.forEach(product => {
      console.log(`   📦 ${product.name} -> ${product._id}`);
    });
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    console.log('✅ Migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

simpleMigration();
