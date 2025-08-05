import mongoose from 'mongoose';

// Interface for wishlist item
interface IWishlistItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variant?: {
    _id?: mongoose.Types.ObjectId;
    name?: string;
    value?: string;
    priceAdjustment?: number;
  };
  priceSnapshot?: {
    price: number;
    compareAtPrice?: number;
    snapshotDate: Date;
  };
  priority: 'low' | 'medium' | 'high';
}

// Interface for collaborator
interface ICollaborator {
  user: mongoose.Types.ObjectId;
  permissions: string[];
  addedAt: Date;
}

// Wishlist Item Schema
const WishlistItemSchema = new mongoose.Schema({
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
  // Snapshot of product details when added (for price tracking)
  priceSnapshot: {
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    snapshotDate: { type: Date, default: Date.now }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  // Notifications
  priceDropAlert: {
    type: Boolean,
    default: false
  },
  backInStockAlert: {
    type: Boolean,
    default: false
  },
  // Gift-related
  isGiftIdea: {
    type: Boolean,
    default: false
  },
  giftRecipient: {
    type: String,
    maxlength: 100
  },
  occasion: {
    type: String,
    maxlength: 100
  }
}, {
  timestamps: true
});

const WishlistSchema = new mongoose.Schema({
  // User association
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Wishlist Details
  name: {
    type: String,
    required: true,
    default: 'My Wishlist',
    maxlength: 100,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  
  // Items
  items: [WishlistItemSchema],
  
  // Privacy and Sharing
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Organization
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  category: {
    type: String,
    enum: ['personal', 'gift_ideas', 'wedding', 'baby', 'holiday', 'birthday', 'other'],
    default: 'personal'
  },
  
  // Special Occasions
  targetDate: {
    type: Date
  }, // For event-based wishlists
  budgetLimit: {
    type: Number,
    min: 0
  },
  
  // Collaboration (for shared wishlists)
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Notifications
  notifications: {
    priceDrops: { type: Boolean, default: true },
    backInStock: { type: Boolean, default: true },
    newCollaboratorItems: { type: Boolean, default: true }
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
WishlistSchema.index({ user: 1, isActive: 1 });
WishlistSchema.index({ isPublic: 1, isActive: 1 });
WishlistSchema.index({ category: 1, isPublic: 1 });

// Virtual for total items
WishlistSchema.virtual('totalItems').get(function() {
  return this.items.length;
});

// Virtual for total value
WishlistSchema.virtual('totalValue').get(function() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return this.items.reduce((sum: number, item: any) => {
    const price = (item.priceSnapshot?.price || 0) + (item.variant?.priceAdjustment || 0);
    return sum + price;
  }, 0);
});

// Virtual for items by priority
WishlistSchema.virtual('itemsByPriority').get(function() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const priorities: { high: any[], medium: any[], low: any[] } = { high: [], medium: [], low: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this.items.forEach((item: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (priorities as any)[item.priority].push(item);
  });
  return priorities;
});

// Pre-save middleware to generate share token
WishlistSchema.pre('save', function(next) {
  if (this.isPublic && !this.shareToken) {
    this.shareToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
  }
  
  if (!this.isPublic) {
    this.shareToken = undefined;
  }
  
  next();
});

// Method to add item to wishlist
WishlistSchema.methods.addItem = function(productId: string, variant?: object, notes?: string, priority = 'medium') {
  // Check if item already exists
  const existingItemIndex = this.items.findIndex((item: IWishlistItem) =>
    item.product.toString() === productId &&
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );
  
  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].notes = notes || this.items[existingItemIndex].notes;
    this.items[existingItemIndex].priority = priority;
    return false; // Item already existed
  } else {
    // Add new item (price would be set by calling code)
    this.items.push({
      product: productId,
      variant: variant || undefined,
      notes: notes || '',
      priority,
      priceSnapshot: {
        price: 0, // This should be set by calling code
        snapshotDate: new Date()
      }
    });
    return true; // New item added
  }
};

// Method to remove item from wishlist
WishlistSchema.methods.removeItem = function(itemId: string) {
  const initialLength = this.items.length;
  this.items = this.items.filter((item: IWishlistItem) => item._id?.toString() !== itemId);
  return this.items.length < initialLength; // Returns true if item was removed
};

// Method to update item priority
WishlistSchema.methods.updateItemPriority = function(itemId: string, priority: string) {
  const item = this.items.find((item: IWishlistItem) => item._id?.toString() === itemId);
  if (item) {
    item.priority = priority as 'low' | 'medium' | 'high';
    return true;
  }
  return false;
};

// Method to move item to cart
WishlistSchema.methods.moveToCart = function(itemId: string) {
  const itemIndex = this.items.findIndex((item: IWishlistItem) => item._id?.toString() === itemId);
  if (itemIndex > -1) {
    const item = this.items[itemIndex];
    this.items.splice(itemIndex, 1);
    return {
      product: item.product,
      variant: item.variant,
      notes: item.notes
    };
  }
  return null;
};

// Method to check for price drops
WishlistSchema.methods.checkPriceDrops = async function() {
  const priceDrops = [];
  
  for (const item of this.items) {
    if (item.priceDropAlert) {
      // This would require populating the product to get current price
      // For now, we'll just return the structure
      const currentPrice = 0; // Would be fetched from product
      if (currentPrice < item.priceSnapshot.price) {
        priceDrops.push({
          item: item._id,
          product: item.product,
          oldPrice: item.priceSnapshot.price,
          newPrice: currentPrice,
          savings: item.priceSnapshot.price - currentPrice
        });
      }
    }
  }
  
  return priceDrops;
};

// Method to add collaborator
WishlistSchema.methods.addCollaborator = function(userId: string, permission = 'view') {
  const existingCollaborator = this.collaborators.find(
    (collab: ICollaborator) => collab.user.toString() === userId
  );
  
  if (existingCollaborator) {
    existingCollaborator.permission = permission;
    return false; // Updated existing
  } else {
    this.collaborators.push({
      user: userId,
      permission
    });
    return true; // Added new
  }
};

// Method to remove collaborator
WishlistSchema.methods.removeCollaborator = function(userId: string) {
  const initialLength = this.collaborators.length;
  this.collaborators = this.collaborators.filter(
    (collab: ICollaborator) => collab.user.toString() !== userId
  );
  return this.collaborators.length < initialLength;
};

// Method to check if user can edit wishlist
WishlistSchema.methods.canUserEdit = function(userId: string) {
  // Owner can always edit
  if (this.user.toString() === userId) return true;
  
  // Check collaborator permissions
  const collaborator = this.collaborators.find(
    (collab: ICollaborator) => collab.user.toString() === userId
  );
  
  return collaborator && ['edit', 'admin'].includes(collaborator.permissions[0]); // Access first permission
};

// Method to increment view count
WishlistSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static method to find public wishlists
WishlistSchema.statics.findPublicWishlists = function(filters = {}, limit = 20) {
  return this.find({
    isPublic: true,
    isActive: true,
    ...filters
  })
  .populate('user', 'name')
  .populate('items.product', 'name images price')
  .sort({ updatedAt: -1 })
  .limit(limit);
};

// Static method to find wishlist by share token
WishlistSchema.statics.findByShareToken = function(token: string) {
  return this.findOne({
    shareToken: token,
    isPublic: true,
    isActive: true
  })
  .populate('user', 'name')
  .populate('items.product', 'name images price description');
};

// Static method to find user's wishlists
WishlistSchema.statics.findUserWishlists = function(userId: string) {
  return this.find({
    $or: [
      { user: userId },
      { 'collaborators.user': userId }
    ],
    isActive: true
  })
  .populate('collaborators.user', 'name')
  .sort({ updatedAt: -1 });
};

export const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
