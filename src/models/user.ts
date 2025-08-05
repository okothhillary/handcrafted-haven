import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Address Schema for user addresses
const AddressSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['billing', 'shipping', 'both'], 
    default: 'both' 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String, default: '' },
  address1: { type: String, required: true },
  address2: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
  phone: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const UserSchema = new mongoose.Schema({
  // Basic Info
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: function(this: { oauthProviders?: Array<{ provider: string }> }): boolean {
      // Password is not required for OAuth users
      return !this.oauthProviders || this.oauthProviders.length === 0;
    },
    minlength: 6
  },
  
  // User Role & Status
  role: { 
    type: String, 
    enum: ['user', 'seller', 'admin'], 
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'active'
  },
  
  // Profile Information
  avatar: { type: String, default: '' },
  bio: { type: String, maxlength: 500, default: '' },
  phone: { type: String, default: '' },
  dateOfBirth: { type: Date },
  
  // Authentication & Security
  emailVerified: { type: Date, default: null },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  
  // OAuth providers info
  oauthProviders: [{
    provider: { type: String }, // 'google', 'github', etc.
    providerId: { type: String },
    providerAccountId: { type: String }
  }],
  
  // User Preferences
  preferences: {
    newsletter: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'auto'], 
      default: 'light' 
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' }
  },
  
  // Addresses
  addresses: [AddressSchema],
  
  // Account Activity
  lastLoginAt: { type: Date },
  loginCount: { type: Number, default: 0 },
  
  // Seller-specific fields (when role is seller)
  sellerProfile: {
    businessName: { type: String },
    businessType: { 
      type: String, 
      enum: ['individual', 'business', 'corporation'] 
    },
    taxId: { type: String },
    description: { type: String, maxlength: 1000 },
    website: { type: String },
    socialMedia: {
      instagram: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      pinterest: { type: String }
    },
    bankAccount: {
      accountHolder: { type: String },
      routingNumber: { type: String },
      accountNumber: { type: String },
      bankName: { type: String }
    },
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{ type: String }], // Document URLs
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 }
  },
  
  // Guest order migration
  guestOrderEmails: [{ type: String }] // For linking guest orders when user registers
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'sellerProfile.isVerified': 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return this.name;
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
UserSchema.methods.generateEmailVerificationToken = function() {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  this.emailVerificationToken = token;
  return token;
};

// Method to check if user is seller
UserSchema.methods.isSeller = function() {
  return this.role === 'seller' || this.role === 'admin';
};

// Method to check if user is admin
UserSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
