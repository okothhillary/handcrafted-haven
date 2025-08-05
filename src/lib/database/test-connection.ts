import mongoose from 'mongoose';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Artisan } from '../../models/artisan';
import { Order } from '../../models/order';
import { Cart } from '../../models/cart';
import { Coupon } from '../../models/coupon';
import { Wishlist } from '../../models/wishlist';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/handcrafted-haven-test';

async function testDatabaseConnection() {
  try {
    console.log('🔧 Testing database connection...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Test model compilation
    console.log('🔧 Testing model compilation...');
    
    // Test that all models can be instantiated
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      role: 'customer',
      emailVerified: true,
      profile: {
        firstName: 'Test',
        lastName: 'User'
      },
      preferences: {
        newsletter: false,
        notifications: {
          email: true,
          sms: false,
          push: false
        }
      }
    });

    const testCategory = new Category({
      name: 'Test Category',
      description: 'A test category',
      slug: 'test-category',
      image: '/test.jpg',
      isActive: true,
      displayOrder: 1
    });

    const testProduct = new Product({
      name: 'Test Product',
      description: 'A test product',
      shortDescription: 'Test',
      price: 99.99,
      images: ['/test.jpg'],
      primaryImage: '/test.jpg',
      stock: 10,
      materials: ['Test Material'],
      techniques: ['Test Technique'],
      origin: 'Test Origin',
      seller: testUser._id,
      category: testCategory._id,
      status: 'active',
      tags: ['test'],
      seo: {
        keywords: ['test'],
        metaTitle: 'Test Product',
        metaDescription: 'A test product'
      }
    });

    console.log('✅ All models compiled successfully');
    console.log('📊 Database models available:');
    console.log('  - User');
    console.log('  - Product');
    console.log('  - Category');
    console.log('  - Artisan');
    console.log('  - Order');
    console.log('  - Cart');
    console.log('  - Coupon');
    console.log('  - Wishlist');

    // Test database operations (without saving)
    console.log('🔧 Testing model validation...');
    
    // Validate models without saving
    await testUser.validate();
    await testCategory.validate();
    await testProduct.validate();
    
    console.log('✅ Model validation passed');
    
    // Test indexes
    console.log('🔧 Testing index creation...');
    await Promise.all([
      User.createIndexes(),
      Product.createIndexes(),
      Category.createIndexes(),
      Artisan.createIndexes(),
      Order.createIndexes(),
      Cart.createIndexes(),
      Coupon.createIndexes(),
      Wishlist.createIndexes()
    ]);
    console.log('✅ Database indexes created successfully');

    console.log('\n🎉 Database test completed successfully!');
    console.log('💡 You can now run the seeding script with: npm run db:seed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection();
}

export { testDatabaseConnection };
