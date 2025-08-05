import mongoose from 'mongoose';

// Interface for cart item
interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variant?: {
    _id?: mongoose.Types.ObjectId;
    name?: string;
    value?: string;
    priceAdjustment?: number;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Interface for applied coupon
interface IAppliedCoupon {
  code: string;
  discountAmount: number;
}

// Cart Item Schema
const CartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  variant: {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    value: { type: String },
    priceAdjustment: { type: Number, default: 0 }
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1,
    max: 999
  },
  unitPrice: { 
    type: Number, 
    required: true,
    min: 0 
  },
  totalPrice: { 
    type: Number, 
    required: true,
    min: 0 
  },
  // Snapshot to track price changes
  priceSnapshot: {
    originalPrice: { type: Number },
    discountedPrice: { type: Number },
    snapshotDate: { type: Date, default: Date.now }
  },
  // Special notes for this item
  notes: { 
    type: String, 
    maxlength: 500 
  },
  // Gift wrapping option
  giftWrap: {
    enabled: { type: Boolean, default: false },
    message: { type: String, maxlength: 200 },
    cost: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

const CartSchema = new mongoose.Schema({
  // User association (null for guest carts)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    sparse: true // Allows null for guest carts
  },
  
  // Guest cart identification
  sessionId: { 
    type: String,
    sparse: true // For guest users
  },
  guestEmail: { type: String }, // For guest checkout
  
  // Cart Items
  items: [CartItemSchema],
  
  // Cart totals
  subtotal: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  taxAmount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  shippingCost: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  discountAmount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  totalAmount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  
  // Applied discounts and coupons
  appliedCoupons: [{
    code: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['percentage', 'fixed_amount', 'free_shipping'],
      required: true 
    },
    value: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    appliedAt: { type: Date, default: Date.now }
  }],
  
  // Cart status
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'expired'],
    default: 'active'
  },
  
  // Shipping preferences
  preferredShippingMethod: {
    name: { type: String },
    cost: { type: Number },
    estimatedDays: { type: Number }
  },
  
  // Cart metadata
  currency: { 
    type: String, 
    default: 'USD' 
  },
  locale: { 
    type: String, 
    default: 'en-US' 
  },
  
  // Special flags
  isGift: { type: Boolean, default: false },
  giftMessage: { type: String, maxlength: 500 },
  
  // Analytics and tracking
  source: { 
    type: String,
    enum: ['web', 'mobile_app', 'api'],
    default: 'web'
  },
  referrer: { type: String },
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String },
  
  // Cart persistence
  lastActivity: { 
    type: Date, 
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: { expireAfterSeconds: 0 }
  },
  
  // Saved for later items
  savedItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variant: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String },
      value: { type: String }
    },
    savedAt: { type: Date, default: Date.now },
    notes: { type: String, maxlength: 200 }
  }]
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
CartSchema.index({ user: 1, status: 1 });
CartSchema.index({ sessionId: 1, status: 1 });
CartSchema.index({ lastActivity: 1 });
CartSchema.index({ status: 1, updatedAt: -1 });

// Virtual for total item count
CartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Virtual for unique product count
CartSchema.virtual('uniqueProductCount').get(function() {
  return this.items.length;
});

// Method to add item to cart
CartSchema.methods.addItem = function(productId: string, quantity: number, variant?: object, unitPrice?: number) {
  // Check if item already exists
  const existingItemIndex = this.items.findIndex((item: ICartItem) => 
    item.product.toString() === productId && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );
  
  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].totalPrice = this.items[existingItemIndex].quantity * this.items[existingItemIndex].unitPrice;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      variant: variant || undefined,
      quantity,
      unitPrice: unitPrice || 0,
      totalPrice: quantity * (unitPrice || 0)
    });
  }
  
  this.calculateTotals();
  this.lastActivity = new Date();
};

// Method to remove item from cart
CartSchema.methods.removeItem = function(itemId: string) {
  this.items = this.items.filter((item: ICartItem) => item._id?.toString() !== itemId);
  this.calculateTotals();
  this.lastActivity = new Date();
};

// Method to update item quantity
CartSchema.methods.updateQuantity = function(itemId: string, quantity: number) {
  const item = this.items.find((item: ICartItem) => item._id?.toString() === itemId);
  if (item) {
    if (quantity <= 0) {
      this.removeItem(itemId);
    } else {
      item.quantity = quantity;
      item.totalPrice = quantity * item.unitPrice;
      this.calculateTotals();
      this.lastActivity = new Date();
    }
  }
};

// Method to clear cart
CartSchema.methods.clearCart = function() {
  this.items = [];
  this.appliedCoupons = [];
  this.calculateTotals();
  this.lastActivity = new Date();
};

// Method to calculate totals
CartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum: number, item: ICartItem) => sum + item.totalPrice, 0);
  
  // Calculate discount amount from coupons
  this.discountAmount = this.appliedCoupons.reduce((sum: number, coupon: IAppliedCoupon) => sum + coupon.discountAmount, 0);
  
  // Calculate total (tax and shipping would be calculated during checkout)
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
  
  // Ensure totals are not negative
  this.totalAmount = Math.max(0, this.totalAmount);
};

// Method to apply coupon
CartSchema.methods.applyCoupon = function(code: string, type: string, value: number) {
  // Check if coupon already applied
  const existingCoupon = this.appliedCoupons.find((c: IAppliedCoupon) => c.code === code);
  if (existingCoupon) return false;
  
  let discountAmount = 0;
  
  switch (type) {
    case 'percentage':
      discountAmount = (this.subtotal * value) / 100;
      break;
    case 'fixed_amount':
      discountAmount = Math.min(value, this.subtotal);
      break;
    case 'free_shipping':
      discountAmount = this.shippingCost;
      break;
  }
  
  this.appliedCoupons.push({
    code,
    type,
    value,
    discountAmount
  });
  
  this.calculateTotals();
  return true;
};

// Method to remove coupon
CartSchema.methods.removeCoupon = function(code: string) {
  this.appliedCoupons = this.appliedCoupons.filter((coupon: IAppliedCoupon) => coupon.code !== code);
  this.calculateTotals();
};

// Method to move item to saved for later
CartSchema.methods.saveForLater = function(itemId: string, notes?: string) {
  const itemIndex = this.items.findIndex((item: ICartItem) => item._id?.toString() === itemId);
  if (itemIndex > -1) {
    const item = this.items[itemIndex];
    this.savedItems.push({
      product: item.product,
      variant: item.variant,
      notes: notes || ''
    });
    this.items.splice(itemIndex, 1);
    this.calculateTotals();
    this.lastActivity = new Date();
  }
};

// Pre-save middleware
CartSchema.pre('save', function(next) {
  // Calculate totals manually since TypeScript has issues with method references
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this.subtotal = this.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this.discountAmount = this.appliedCoupons.reduce((sum: number, coupon: any) => sum + coupon.discountAmount, 0);
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
  this.totalAmount = Math.max(0, this.totalAmount);
  this.lastActivity = new Date();
  next();
});

// Static method to find or create cart
CartSchema.statics.findOrCreate = async function(userId?: string, sessionId?: string) {
  let cart;
  
  if (userId) {
    cart = await this.findOne({ user: userId, status: 'active' });
  } else if (sessionId) {
    cart = await this.findOne({ sessionId, status: 'active' });
  }
  
  if (!cart) {
    cart = new this({
      user: userId || undefined,
      sessionId: sessionId || undefined,
      status: 'active'
    });
  }
  
  return cart;
};

// Static method to cleanup expired carts
CartSchema.statics.cleanupExpiredCarts = function() {
  return this.deleteMany({
    status: 'active',
    lastActivity: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });
};

export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
