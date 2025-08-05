import mongoose from 'mongoose';

// Interface for usage history item
interface IUsageHistory {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  discountAmount: number;
  usedAt: Date;
}

const CouponSchema = new mongoose.Schema({
  // Basic Information
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  
  // Discount Configuration
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    min: 0
  }, // For percentage coupons
  
  // Buy X Get Y Configuration (for type: 'buy_x_get_y')
  buyXGetY: {
    buyQuantity: { type: Number },
    getQuantity: { type: Number },
    getDiscount: { type: Number }, // Percentage discount on Y items
    sameProduct: { type: Boolean, default: true }
  },
  
  // Usage Limits
  usageLimit: {
    total: { type: Number }, // Total times coupon can be used
    perUser: { type: Number, default: 1 }, // Times per user
    perDay: { type: Number }, // Times per day
  },
  
  // Minimum Requirements
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  minimumQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Date Configuration
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Target Configuration
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // User Targeting
  userRestrictions: {
    newUsersOnly: { type: Boolean, default: false },
    existingUsersOnly: { type: Boolean, default: false },
    minOrderHistory: { type: Number, default: 0 }, // Minimum previous orders
    userTags: [{ type: String }] // Target users with specific tags
  },
  
  // Geographic Restrictions
  allowedCountries: [{ type: String }],
  excludedCountries: [{ type: String }],
  
  // Status and Visibility
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }, // Whether coupon appears in public listings
  isAutoApply: {
    type: Boolean,
    default: false
  }, // Automatically apply if conditions met
  
  // Usage Tracking
  usageCount: {
    type: Number,
    default: 0
  },
  usageHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    discountAmount: { type: Number },
    usedAt: { type: Date, default: Date.now }
  }],
  
  // Marketing
  source: {
    type: String,
    enum: ['email_campaign', 'social_media', 'affiliate', 'influencer', 'abandoned_cart', 'loyalty_program', 'manual'],
    default: 'manual'
  },
  campaignId: { type: String }, // External campaign tracking
  
  // Creator Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // SEO and Display
  displayText: { type: String }, // Custom text to show users
  termsAndConditions: { type: String, maxlength: 2000 }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CouponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
CouponSchema.index({ type: 1, isActive: 1 });
CouponSchema.index({ endDate: 1 }); // For cleanup expired coupons

// Virtual for status
CouponSchema.virtual('status').get(function() {
  const now = new Date();
  if (!this.isActive) return 'inactive';
  if (now < this.startDate) return 'scheduled';
  if (now > this.endDate) return 'expired';
  if (this.usageLimit?.total && this.usageCount >= this.usageLimit.total) return 'exhausted';
  return 'active';
});

// Virtual for usage percentage
CouponSchema.virtual('usagePercentage').get(function() {
  if (!this.usageLimit?.total) return 0;
  return Math.round((this.usageCount / this.usageLimit.total) * 100);
});

// Method to check if coupon is valid for a user
CouponSchema.methods.isValidForUser = function(userId: string) {
  const now = new Date();
  
  // Basic validity checks
  if (!this.isActive || now < this.startDate || now > this.endDate) {
    return { valid: false, reason: 'Coupon is not active or has expired' };
  }
  
  // Usage limit check
  if (this.usageLimit?.total && this.usageCount >= this.usageLimit.total) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  
  // Per-user usage limit
  if (this.usageLimit?.perUser) {
    const userUsage = this.usageHistory.filter((h: IUsageHistory) => h.user.toString() === userId).length;
    if (userUsage >= this.usageLimit.perUser) {
      return { valid: false, reason: 'You have already used this coupon' };
    }
  }
  
  // User restrictions
  if (this.applicableUsers.length > 0 && !this.applicableUsers.includes(userId)) {
    return { valid: false, reason: 'This coupon is not available for your account' };
  }
  
  return { valid: true, reason: null };
};

// Method to calculate discount for order
CouponSchema.methods.calculateDiscount = function(orderData: { 
  subtotal: number; 
  items: { product: string; quantity: number; unitPrice: number }[]; 
  shippingCost: number 
}) {
  let discountAmount = 0;
  
  switch (this.type) {
    case 'percentage':
      discountAmount = (orderData.subtotal * this.value) / 100;
      if (this.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
      }
      break;
      
    case 'fixed_amount':
      discountAmount = Math.min(this.value, orderData.subtotal);
      break;
      
    case 'free_shipping':
      discountAmount = orderData.shippingCost;
      break;
      
    case 'buy_x_get_y':
      // Complex logic for buy X get Y offers
      if (this.buyXGetY) {
        const eligibleItems = orderData.items.filter(item => {
          // Check if item is eligible based on product/category restrictions
          return this.isProductEligible(item.product);
        });
        
        const totalEligibleQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
        const sets = Math.floor(totalEligibleQuantity / this.buyXGetY.buyQuantity);
        const freeItems = sets * this.buyXGetY.getQuantity;
        
        // Calculate discount based on cheapest items that would be free
        const sortedItems = eligibleItems.sort((a, b) => a.unitPrice - b.unitPrice);
        let remainingFreeItems = freeItems;
        
        for (const item of sortedItems) {
          if (remainingFreeItems <= 0) break;
          const freeFromThisItem = Math.min(remainingFreeItems, item.quantity);
          discountAmount += freeFromThisItem * item.unitPrice * (this.buyXGetY.getDiscount / 100);
          remainingFreeItems -= freeFromThisItem;
        }
      }
      break;
  }
  
  return Math.max(0, discountAmount);
};

// Method to check if product is eligible
CouponSchema.methods.isProductEligible = function(productId: string) {
  // If no restrictions, all products are eligible
  if (this.applicableProducts.length === 0 && this.applicableCategories.length === 0) {
    return !this.excludedProducts.includes(productId);
  }
  
  // Check if product is specifically included
  if (this.applicableProducts.includes(productId)) {
    return !this.excludedProducts.includes(productId);
  }
  
  // Check if product's category is included (would need product lookup)
  // This would require populating product data or separate query
  
  return false;
};

// Method to apply coupon to order
CouponSchema.methods.applyCoupon = function(userId: string, orderId: string, discountAmount: number) {
  this.usageCount += 1;
  this.usageHistory.push({
    user: userId,
    order: orderId,
    discountAmount,
    usedAt: new Date()
  });
};

// Static method to find applicable coupons for auto-apply
CouponSchema.statics.findAutoApplyCoupons = function(orderData: { subtotal: number }, userId: string) {
  const now = new Date();
  return this.find({
    isActive: true,
    isAutoApply: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    minimumOrderAmount: { $lte: orderData.subtotal },
    $or: [
      { applicableUsers: { $size: 0 } },
      { applicableUsers: userId }
    ]
  });
};

// Static method to cleanup expired coupons
CouponSchema.statics.cleanupExpired = function() {
  return this.updateMany(
    { endDate: { $lt: new Date() } },
    { $set: { isActive: false } }
  );
};

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
