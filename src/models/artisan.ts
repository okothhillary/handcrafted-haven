import mongoose from 'mongoose';

// Social Media Schema
const SocialMediaSchema = new mongoose.Schema({
  platform: { 
    type: String,
    enum: ['instagram', 'facebook', 'twitter', 'pinterest', 'youtube', 'tiktok', 'etsy', 'website'],
    required: true
  },
  url: { 
    type: String, 
    required: true 
  },
  verified: { 
    type: Boolean, 
    default: false 
  }
});

// Portfolio Item Schema
const PortfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, maxlength: 1000 },
  images: [{ type: String, required: true }],
  category: { type: String },
  techniques: [{ type: String }],
  materials: [{ type: String }],
  year: { type: Number },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

// Award/Recognition Schema
const AwardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  year: { type: Number, required: true },
  description: { type: String, maxlength: 500 },
  category: { type: String },
  url: { type: String } // Link to award details
});

const ArtisanSchema = new mongoose.Schema({
  // Basic Information
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: { 
    type: String, 
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  
  // Professional Details
  bio: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  shortBio: { 
    type: String, 
    maxlength: 300
  },
  
  // Craft Information
  primaryCraft: { 
    type: String, 
    required: true
  },
  craftCategories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category'
  }],
  specialties: [{ type: String }], // Specific skills within their craft
  techniques: [{ type: String }], // Traditional or unique techniques
  materials: [{ type: String }], // Primary materials used
  
  // Experience and Background
  yearsOfExperience: { 
    type: Number, 
    min: 0,
    index: true
  },
  
  // Location and Origin
  location: {
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true, default: 'US' },
    region: { type: String }, // Cultural region
  },
  culturalBackground: { type: String },
  
  // Media and Portfolio
  profileImage: { type: String },
  coverImage: { type: String },
  portfolioImages: [{ type: String }],
  portfolio: [PortfolioItemSchema],
  
  // Social Media and Online Presence
  socialMedia: [SocialMediaSchema],
  website: { type: String },
  
  // Recognition and Awards
  awards: [AwardSchema],
  certifications: [{
    name: { type: String, required: true },
    organization: { type: String, required: true },
    year: { type: Number },
    expiryDate: { type: Date }
  }],
  
  // Verification and Trust
  verified: { 
    type: Boolean, 
    default: false
  },
  verificationLevel: {
    type: String,
    enum: ['unverified', 'basic', 'enhanced', 'premium'],
    default: 'unverified'
  },
  
  // Performance Metrics
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  sales: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  
  // Social Proof
  followers: { type: Number, default: 0 },
  featuredArtisan: { 
    type: Boolean, 
    default: false
  },
  popularityScore: { 
    type: Number, 
    default: 0,
    index: true
  },
  
  // Status and Preferences
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_approval'],
    default: 'pending_approval'
  },
  
  // SEO and Marketing
  seo: {
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    keywords: [{ type: String }]
  }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance and search
ArtisanSchema.index({ displayName: 'text', bio: 'text', specialties: 'text' });
ArtisanSchema.index({ primaryCraft: 1, status: 1 });
ArtisanSchema.index({ 'location.city': 1, 'location.country': 1 });
ArtisanSchema.index({ verified: 1, status: 1 });
ArtisanSchema.index({ featuredArtisan: 1, popularityScore: -1 });

// Virtual for full location
ArtisanSchema.virtual('fullLocation').get(function(this: mongoose.Document & { location?: { city?: string; state?: string; country?: string } }) {
  if (!this.location) return '';
  const parts = [this.location.city, this.location.state, this.location.country].filter(Boolean);
  return parts.join(', ');
});

// Virtual for total products
ArtisanSchema.virtual('totalProducts', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'artisan',
  count: true
});

// Pre-save middleware to generate slug
ArtisanSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('displayName')) {
    this.slug = this.displayName.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
  }
  
  // Update short bio if not provided
  if (!this.shortBio && this.bio) {
    this.shortBio = this.bio.substring(0, 250) + (this.bio.length > 250 ? '...' : '');
  }
  
  next();
});

// Static method to find featured artisans
ArtisanSchema.statics.getFeaturedArtisans = function(limit = 10) {
  return this.find({ 
    status: 'active', 
    verified: true,
    featuredArtisan: true 
  })
  .sort({ popularityScore: -1 })
  .limit(limit)
  .populate('user', 'name email')
  .populate('craftCategories', 'name slug');
};

export const Artisan = mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema);
