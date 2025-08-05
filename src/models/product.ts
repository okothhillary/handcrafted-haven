import mongoose from 'mongoose';

// Review Schema for product reviews
const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  verified: { 
    type: Boolean, 
    default: false 
  }, // Verified purchase
  helpful: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], // Users who found this helpful
  reported: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }] // Users who reported this review
}, { 
  timestamps: true 
});

// Product Variant Schema (for different sizes, colors, etc.)
const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Small", "Red", "Cotton"
  type: { 
    type: String, 
    required: true,
    enum: ['size', 'color', 'material', 'style', 'other']
  },
  value: { type: String, required: true },
  priceAdjustment: { type: Number, default: 0 }, // Price difference from base price
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  images: [{ type: String }], // Additional images for this variant
  isActive: { type: Boolean, default: true }
});

// SEO Schema
const SEOSchema = new mongoose.Schema({
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  keywords: [{ type: String }],
  slug: { type: String, unique: true, sparse: true }
});

// Shipping Schema
const ShippingSchema = new mongoose.Schema({
  weight: { type: Number, default: 0 }, // in pounds
  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
  shippingClass: { 
    type: String, 
    enum: ['standard', 'fragile', 'oversized', 'digital'],
    default: 'standard'
  },
  processingTime: { type: Number, default: 3 }, // days
  freeShippingThreshold: { type: Number, default: 0 }
});

const ProductSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 5000
  },
  shortDescription: { 
    type: String, 
    maxlength: 500
  },
  
  // Pricing
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  compareAtPrice: { 
    type: Number, 
    min: 0 
  }, // Original price for showing discounts
  cost: { type: Number, min: 0 }, // Cost to seller
  
  // Media
  images: [{ 
    type: String, 
    required: true 
  }],
  videos: [{ type: String }],
  primaryImage: { type: String },
  
  // Inventory
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  sku: { 
    type: String, 
    unique: true,
    sparse: true,
    uppercase: true
  },
  trackInventory: { 
    type: Boolean, 
    default: true 
  },
  allowBackorder: { 
    type: Boolean, 
    default: false 
  },
  lowStockThreshold: { 
    type: Number, 
    default: 5 
  },
  
  // Categorization
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  subcategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category'
  },
  tags: [{ 
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Seller Information
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  artisan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artisan'
  },
  
  // Product Status
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft'
  },
  isDigital: { 
    type: Boolean, 
    default: false 
  },
  isFeatured: { 
    type: Boolean, 
    default: false
  },
  
  // Variants and Options
  variants: [VariantSchema],
  hasVariants: { 
    type: Boolean, 
    default: false 
  },
  
  // Materials and Craftsmanship
  materials: [{ 
    type: String,
    required: true
  }],
  techniques: [{ type: String }],
  origin: { 
    type: String, 
    required: true 
  }, // Country/region of origin
  handmadeDetails: {
    timeToMake: { type: String }, // e.g., "2-3 weeks"
    skillLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced', 'master']
    },
    tools: [{ type: String }],
    story: { type: String, maxlength: 1000 }
  },
  
  // Shipping Information
  shipping: ShippingSchema,
  
  // SEO
  seo: SEOSchema,
  
  // Reviews and Ratings
  reviews: [ReviewSchema],
  averageRating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  },
  
  // Analytics
  views: { 
    type: Number, 
    default: 0 
  },
  purchases: { 
    type: Number, 
    default: 0 
  },
  wishlistCount: { 
    type: Number, 
    default: 0 
  },
  
  // Dates
  publishedAt: { type: Date },
  lastStockUpdate: { type: Date, default: Date.now }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ seller: 1, status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isFeatured: 1, status: 1 });

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for profit margin
ProductSchema.virtual('profitMargin').get(function() {
  if (this.cost && this.cost > 0) {
    return ((this.price - this.cost) / this.price) * 100;
  }
  return 0;
});

// Virtual for stock status
ProductSchema.virtual('stockStatus').get(function() {
  if (this.stock <= 0) return 'out-of-stock';
  if (this.stock <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Method to calculate average rating
ProductSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const total = this.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
  this.averageRating = total / this.reviews.length;
  this.totalReviews = this.reviews.length;
  
  // Update rating distribution
  this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  this.reviews.forEach((review: { rating: 1 | 2 | 3 | 4 | 5 }) => {
    this.ratingDistribution[review.rating]++;
  });
};

// Method to add review
ProductSchema.methods.addReview = function(userId: string, rating: number, comment: string, verified = false) {
  this.reviews.push({
    user: userId,
    rating,
    comment,
    verified
  });
  this.calculateAverageRating();
};

// Pre-save middleware
ProductSchema.pre('save', function(next) {
  // Generate SKU if not provided
  if (!this.sku) {
    this.sku = `HH-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  
  // Set published date when status changes to active
  if (this.isModified('status') && this.status === 'active' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Generate SEO slug if not provided
  if (!this.seo?.slug) {
    const slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
    if (!this.seo) {
      this.seo = {
        keywords: []
      };
    }
    this.seo.slug = `${slug}-${Date.now()}`;
  }
  
  next();
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
