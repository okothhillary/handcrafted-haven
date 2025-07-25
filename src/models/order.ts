import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1
    },
  }],
  total: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
