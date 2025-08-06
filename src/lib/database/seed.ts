import mongoose from 'mongoose';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Artisan } from '../../models/artisan';
import { Order } from '../../models/order';
import { Cart } from '../../models/cart';
import { Coupon } from '../../models/coupon';
import { Wishlist } from '../../models/wishlist';
import * as bcrypt from 'bcryptjs';

// Helper interface for document properties
interface DocumentWithProps extends mongoose.Document {
  slug?: string;
  name?: string;
  role?: string;
  email?: string;
  displayName?: string;
  code?: string;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/handcrafted-haven';

// Sample data
const categories = [
  {
    name: 'Home Décor',
    description: 'Beautiful handcrafted items to decorate your home',
    slug: 'home-decor',
    image: '/images/categories/home-decor.jpg',
    isActive: true,
    isFeatured: true,
    displayOrder: 1
  },
  {
    name: 'Wall Art',
    description: 'Unique wall art pieces from talented artisans',
    slug: 'wall-art',
    parent: null, // Will be set to Home Décor ID
    image: '/images/categories/wall-art.jpg',
    isActive: true,
    displayOrder: 1
  },
  {
    name: 'Pottery & Ceramics',
    description: 'Handmade pottery and ceramic pieces',
    slug: 'pottery-ceramics',
    image: '/images/categories/pottery.jpg',
    isActive: true,
    isFeatured: true,
    displayOrder: 2
  },
  {
    name: 'Textiles',
    description: 'Handwoven textiles and fabric art',
    slug: 'textiles',
    image: '/images/categories/textiles.jpg',
    isActive: true,
    isFeatured: true,
    displayOrder: 3
  },
  {
    name: 'Jewelry',
    description: 'Unique handcrafted jewelry pieces',
    slug: 'jewelry',
    image: '/images/categories/jewelry.jpg',
    isActive: true,
    isFeatured: true,
    displayOrder: 4
  },
  {
    name: 'Woodwork',
    description: 'Beautiful handcrafted wooden items',
    slug: 'woodwork',
    image: '/images/categories/woodwork.jpg',
    isActive: true,
    displayOrder: 5
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@handcraftedhaven.com',
    password: 'admin123',
    role: 'admin',
    emailVerified: true,
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01')
    },
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  },
  {
    name: 'John Customer',
    email: 'john@example.com',
    password: 'customer123',
    role: 'customer',
    emailVerified: true,
    profile: {
      firstName: 'John',
      lastName: 'Customer',
      phone: '+1234567891'
    },
    addresses: [{
      type: 'shipping',
      firstName: 'John',
      lastName: 'Customer',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      isDefault: true
    }]
  },
  {
    name: 'Sarah Seller',
    email: 'sarah@example.com',
    password: 'seller123',
    role: 'seller',
    emailVerified: true,
    profile: {
      firstName: 'Sarah',
      lastName: 'Seller',
      phone: '+1234567892'
    },
    sellerProfile: {
      businessName: 'Sarah\'s Crafts',
      businessType: 'individual',
      verified: true,
      verificationLevel: 'basic',
      taxId: 'TX123456789',
      commissionRate: 0.15
    }
  }
];

const artisans = [
  {
    displayName: 'Elena Vasquez',
    bio: 'Elena is a master potter from Oaxaca, Mexico, who has been creating beautiful ceramic pieces for over 20 years. Her work combines traditional Mexican techniques with contemporary designs.',
    primaryCraft: 'Pottery & Ceramics',
    specialties: ['Traditional Mexican pottery', 'Glazing techniques', 'Sculptural ceramics'],
    techniques: ['Coil building', 'Wheel throwing', 'Raku firing'],
    materials: ['Clay', 'Natural glazes', 'Traditional pigments'],
    yearsOfExperience: 20,
    location: {
      city: 'Oaxaca',
      state: 'Oaxaca',
      country: 'Mexico'
    },
    profileImage: '/images/artisans/elena-vasquez.jpg',
    verified: true,
    verificationLevel: 'enhanced',
    status: 'active',
    featuredArtisan: true,
    popularityScore: 85
  },
  {
    displayName: 'Marcus Thompson',
    bio: 'Marcus is a woodworker from Vermont who creates stunning furniture and decorative pieces using traditional joinery techniques passed down through generations.',
    primaryCraft: 'Woodwork',
    specialties: ['Furniture making', 'Wood carving', 'Traditional joinery'],
    techniques: ['Mortise and tenon', 'Dovetail joints', 'Hand carving'],
    materials: ['Hardwood', 'Reclaimed wood', 'Natural finishes'],
    yearsOfExperience: 15,
    location: {
      city: 'Burlington',
      state: 'Vermont',
      country: 'US'
    },
    profileImage: '/images/artisans/marcus-thompson.jpg',
    verified: true,
    verificationLevel: 'basic',
    status: 'active',
    popularityScore: 78
  }
];

const products = [
  {
    name: 'Handwoven Oaxacan Bowl',
    description: 'Beautiful ceramic bowl handcrafted using traditional Oaxacan techniques. Perfect for serving or as a decorative piece.',
    shortDescription: 'Traditional Oaxacan ceramic bowl with intricate patterns.',
    price: 45.00,
    compareAtPrice: 60.00,
    images: ['/images/products/oaxacan-bowl-1.jpg', '/images/products/oaxacan-bowl-2.jpg'],
    primaryImage: '/images/products/oaxacan-bowl-1.jpg',
    stock: 12,
    materials: ['Clay', 'Natural glazes'],
    techniques: ['Hand throwing', 'Traditional glazing'],
    origin: 'Oaxaca, Mexico',
    handmadeDetails: {
      timeToMake: '2-3 days',
      skillLevel: 'advanced',
      story: 'This bowl is created using techniques passed down through four generations of potters in Elena\'s family.'
    },
    shipping: {
      weight: 1.5,
      dimensions: { length: 8, width: 8, height: 4 },
      shippingClass: 'fragile',
      processingTime: 2
    },
    status: 'active',
    isFeatured: true,
    tags: ['pottery', 'decorative', 'kitchen', 'mexican', 'traditional']
  },
  {
    name: 'Rustic Wooden Cutting Board',
    description: 'Handcrafted cutting board made from reclaimed Vermont maple. Features beautiful grain patterns and a food-safe finish.',
    shortDescription: 'Reclaimed maple cutting board with beautiful grain.',
    price: 75.00,
    images: ['/images/products/maple-cutting-board-1.jpg'],
    primaryImage: '/images/products/maple-cutting-board-1.jpg',
    stock: 8,
    materials: ['Reclaimed maple wood', 'Food-safe finish'],
    techniques: ['Hand sanding', 'Traditional finishing'],
    origin: 'Vermont, USA',
    handmadeDetails: {
      timeToMake: '1 week',
      skillLevel: 'intermediate',
      story: 'Each board is made from wood reclaimed from old Vermont barns, giving new life to historic timber.'
    },
    shipping: {
      weight: 2.0,
      dimensions: { length: 16, width: 12, height: 1.5 },
      shippingClass: 'standard',
      processingTime: 5
    },
    status: 'active',
    tags: ['woodwork', 'kitchen', 'functional', 'reclaimed', 'sustainable']
  }
];

const coupons = [
  {
    code: 'WELCOME10',
    name: 'Welcome Discount',
    description: '10% off for new customers',
    type: 'percentage',
    value: 10,
    usageLimit: { total: 1000, perUser: 1 },
    minimumOrderAmount: 25,
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    isActive: true,
    isPublic: true,
    userRestrictions: { newUsersOnly: true },
    source: 'email_campaign'
  },
  {
    code: 'FREESHIP50',
    name: 'Free Shipping',
    description: 'Free shipping on orders over $50',
    type: 'free_shipping',
    value: 0,
    minimumOrderAmount: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    isPublic: true,
    isAutoApply: true,
    source: 'manual'
  }
];

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Artisan.deleteMany({}),
    Order.deleteMany({}),
    Cart.deleteMany({}),
    Coupon.deleteMany({}),
    Wishlist.deleteMany({})
  ]);
  console.log('Database cleared');
}

async function seedCategories() {
  console.log('Seeding categories...');
  const createdCategories: DocumentWithProps[] = [];
  
  // Create main categories first
  for (const categoryData of categories.filter(c => !c.parent)) {
    const category = new Category(categoryData);
    await category.save();
    createdCategories.push(category as DocumentWithProps);
    console.log(`Created category: ${category.name}`);
  }
  
  // Create subcategories
  for (const categoryData of categories.filter(c => c.parent)) {
    const parentCategory = createdCategories.find(c => c.slug === 'home-decor');
    if (parentCategory) {
      const category = new Category({
        ...categoryData,
        parent: parentCategory._id
      });
      await category.save();
      createdCategories.push(category as DocumentWithProps);
      console.log(`Created subcategory: ${category.name}`);
    }
  }
  
  return createdCategories;
}

async function seedUsers() {
  console.log('Seeding users...');
  const createdUsers: DocumentWithProps[] = [];
  
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    await user.save();
    createdUsers.push(user as DocumentWithProps);
    console.log(`Created user: ${user.email}`);
  }
  
  return createdUsers;
}

async function seedArtisans(createdUsers: DocumentWithProps[], createdCategories: DocumentWithProps[]) {
  console.log('Seeding artisans...');
  const createdArtisans: DocumentWithProps[] = [];
  
  // Find seller users to associate with artisans
  const sellerUser = createdUsers.find(u => u.role === 'seller');
  if (!sellerUser) return [];
  
  for (const artisanData of artisans) {
    const craftCategory = createdCategories.find(c => c.name === artisanData.primaryCraft);
    const artisan = new Artisan({
      ...artisanData,
      user: sellerUser._id,
      craftCategories: craftCategory ? [craftCategory._id] : []
    });
    await artisan.save();
    createdArtisans.push(artisan as DocumentWithProps);
    console.log(`Created artisan: ${artisan.displayName}`);
  }
  
  return createdArtisans;
}

async function seedProducts(createdUsers: DocumentWithProps[], createdCategories: DocumentWithProps[], createdArtisans: DocumentWithProps[]) {
  console.log('Seeding products...');
  const createdProducts: DocumentWithProps[] = [];
  
  const sellerUser = createdUsers.find(u => u.role === 'seller');
  if (!sellerUser) return [];
  
  for (let i = 0; i < products.length; i++) {
    const productData = products[i];
    const artisan = createdArtisans[i % createdArtisans.length];
    const category = createdCategories.find(c => 
      productData.materials.some(material => 
        c.name?.toLowerCase().includes(material.toLowerCase().split(' ')[0])
      )
    ) || createdCategories[0];
    
    const product = new Product({
      ...productData,
      seller: sellerUser._id,
      artisan: artisan._id,
      category: category._id,
      seo: {
        metaTitle: `${productData.name} - Handcrafted Haven`,
        metaDescription: productData.shortDescription,
        keywords: productData.tags
      }
    });
    
    await product.save();
    createdProducts.push(product as DocumentWithProps);
    console.log(`Created product: ${product.name}`);
  }
  
  return createdProducts;
}

async function seedCoupons(createdUsers: DocumentWithProps[]) {
  console.log('Seeding coupons...');
  const adminUser = createdUsers.find(u => u.role === 'admin');
  if (!adminUser) return [];
  
  const createdCoupons: DocumentWithProps[] = [];
  for (const couponData of coupons) {
    const coupon = new Coupon({
      ...couponData,
      createdBy: adminUser._id
    });
    await coupon.save();
    createdCoupons.push(coupon as DocumentWithProps);
    console.log(`Created coupon: ${coupon.code}`);
  }
  
  return createdCoupons;
}

async function seedDatabase() {
  try {
    await connectToDatabase();
    await clearDatabase();
    
    const createdCategories = await seedCategories();
    const createdUsers = await seedUsers();
    const createdArtisans = await seedArtisans(createdUsers, createdCategories);
    const createdProducts = await seedProducts(createdUsers, createdCategories, createdArtisans);
    const createdCoupons = await seedCoupons(createdUsers);
    
    console.log('\n📊 Database seeding completed successfully!');
    console.log(`✅ Created ${createdCategories.length} categories`);
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log(`✅ Created ${createdArtisans.length} artisans`);
    console.log(`✅ Created ${createdProducts.length} products`);
    console.log(`✅ Created ${createdCoupons.length} coupons`);
    
    // Create indexes
    console.log('\n🔧 Creating database indexes...');
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
    console.log('✅ Database indexes created');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Export for use in other files
export { connectToDatabase, seedDatabase };

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
