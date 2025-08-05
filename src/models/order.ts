import mongoose from 'mongoose';

// Order Item Schema
const OrderItemSchema = new mongoose.Schema({
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
    min: 1 
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
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  // Snapshot of product details at time of order
  productSnapshot: {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    sku: { type: String }
  },
  // Item status (for partial fulfillment)
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  shippingInfo: {
    trackingNumber: { type: String },
    carrier: { type: String },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date }
  }
});

// Address Schema (reusable for shipping and billing)
const AddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
  phone: { type: String }
});

// Payment Schema
const PaymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'apple_pay', 'google_pay', 'bank_transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: { type: String },
  gatewayTransactionId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  gateway: { type: String }, // stripe, paypal, etc.
  failureReason: { type: String },
  refundAmount: { type: Number, default: 0 },
  refundReason: { type: String },
  processedAt: { type: Date },
  refundedAt: { type: Date }
});

const OrderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: { 
    type: String, 
    unique: true,
    required: true
  },
  
  // Customer Information
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  customerEmail: { type: String, required: true },
  isGuestOrder: { type: Boolean, default: false },
  
  // Order Items
  items: [OrderItemSchema],
  
  // Addresses
  shippingAddress: { 
    type: AddressSchema, 
    required: true 
  },
  billingAddress: { 
    type: AddressSchema, 
    required: true 
  },
  sameAsBilling: { type: Boolean, default: false },
  
  // Financial Details
  subtotal: { 
    type: Number, 
    required: true,
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
    required: true,
    min: 0 
  },
  currency: { 
    type: String, 
    default: 'USD' 
  },
  
  // Discounts and Coupons
  appliedCoupons: [{
    code: { type: String },
    type: { 
      type: String, 
      enum: ['percentage', 'fixed_amount', 'free_shipping'] 
    },
    value: { type: Number },
    discountAmount: { type: Number }
  }],
  
  // Order Status
  status: {
    type: String,
    enum: [
      'pending',        // Just created, awaiting payment
      'confirmed',      // Payment confirmed
      'processing',     // Being prepared for shipment
      'partially_shipped', // Some items shipped
      'shipped',        // All items shipped
      'delivered',      // All items delivered
      'completed',      // Order fulfilled and closed
      'cancelled',      // Order cancelled
      'refunded',       // Order refunded
      'disputed'        // Customer dispute
    ],
    default: 'pending'
  },
  
  // Payment Information
  payment: PaymentSchema,
  
  // Shipping Information
  shippingMethod: {
    name: { type: String },
    cost: { type: Number },
    estimatedDays: { type: Number }
  },
  fulfillmentStatus: {
    type: String,
    enum: ['unfulfilled', 'partially_fulfilled', 'fulfilled'],
    default: 'unfulfilled'
  },
  
  // Special Instructions
  customerNotes: { type: String, maxlength: 1000 },
  internalNotes: { type: String, maxlength: 1000 },
  giftMessage: { type: String, maxlength: 500 },
  isGift: { type: Boolean, default: false },
  
  // Tracking and Logistics
  trackingNumbers: [{ 
    carrier: { type: String },
    number: { type: String },
    url: { type: String }
  }],
  
  // Important Dates
  estimatedDeliveryDate: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  refundedAt: { type: Date },
  
  // Customer Service
  hasCustomerServiceIssue: { type: Boolean, default: false },
  customerServiceNotes: [{ 
    note: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Analytics and Marketing
  source: { 
    type: String,
    enum: ['web', 'mobile_app', 'api', 'admin'],
    default: 'web'
  },
  referrer: { type: String },
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ estimatedDeliveryDate: 1 });

// Virtual for order summary
OrderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Virtual for seller count
OrderSchema.virtual('sellerCount').get(function() {
  const sellers = new Set(this.items.map(item => item.seller.toString()));
  return sellers.size;
});

// Pre-save middleware to generate order number
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    // Generate order number: HH-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    this.orderNumber = `HH-${dateStr}-${random}`;
  }
  
  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
  
  next();
});

// Method to check if order can be cancelled
OrderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Method to check if order can be refunded
OrderSchema.methods.canBeRefunded = function() {
  return ['delivered', 'completed'].includes(this.status) && this.payment.status === 'completed';
};

// Static method to get orders by status
OrderSchema.statics.getOrdersByStatus = function(status: string, limit = 50) {
  return this.find({ status })
    .populate('customer', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
