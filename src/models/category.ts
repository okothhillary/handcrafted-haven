import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  description: { 
    type: String, 
    maxlength: 1000
  },
  
  // Hierarchy
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  level: { 
    type: Number, 
    default: 0 
  }, // 0 = root, 1 = subcategory, etc.
  path: { 
    type: String
  }, // e.g., "home-decor/wall-art"
  
  // Media
  image: { type: String },
  icon: { type: String },
  
  // Display Settings
  slug: { 
    type: String, 
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  displayOrder: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  
  // SEO
  seo: {
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    keywords: [{ type: String }]
  },
  
  // Commission and Business Rules
  commissionRate: { 
    type: Number, 
    default: 0.1,
    min: 0,
    max: 1 
  }, // 10% default commission
  
  // Analytics
  productCount: { 
    type: Number, 
    default: 0 
  },
  popularityScore: { 
    type: Number, 
    default: 0 
  }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CategorySchema.index({ parent: 1, isActive: 1 });
CategorySchema.index({ level: 1, displayOrder: 1 });
CategorySchema.index({ path: 1 });

// Virtual for children categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for full path display
CategorySchema.virtual('fullPath').get(function() {
  return this.path ? this.path.split('/').join(' > ') : this.name;
});

// Pre-save middleware to generate path and slug
CategorySchema.pre('save', async function(next) {
  // Generate slug if not provided
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  }
  
  // Generate path based on parent hierarchy
  if (this.parent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CategoryModel = this.constructor as mongoose.Model<any>;
    const parent = await CategoryModel.findById(this.parent);
    if (parent) {
      this.level = parent.level + 1;
      this.path = parent.path ? `${parent.path}/${this.slug}` : this.slug;
    }
  } else {
    this.level = 0;
    this.path = this.slug;
  }
  
  next();
});

// Static method to get category tree
CategorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true })
    .sort({ level: 1, displayOrder: 1, name: 1 })
    .lean();
  
  const categoryMap = new Map();
  const tree: typeof categories = [];
  
  // First pass: create map and initialize children arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories.forEach((category: any) => {
    categoryMap.set(category._id.toString(), { ...category, children: [] });
  });
  
  // Second pass: build tree structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories.forEach((category: any) => {
    const categoryWithChildren = categoryMap.get(category._id.toString());
    if (category.parent) {
      const parent = categoryMap.get(category.parent.toString());
      if (parent) {
        parent.children.push(categoryWithChildren);
      }
    } else {
      tree.push(categoryWithChildren);
    }
  });
  
  return tree;
};

// Static method to get breadcrumbs
CategorySchema.statics.getBreadcrumbs = async function(categoryId: string) {
  const category = await this.findById(categoryId);
  if (!category) return [];
  
  const breadcrumbs = [];
  let current = category;
  
  while (current) {
    breadcrumbs.unshift({
      _id: current._id,
      name: current.name,
      slug: current.slug,
      path: current.path
    });
    
    if (current.parent) {
      current = await this.findById(current.parent);
    } else {
      current = null;
    }
  }
  
  return breadcrumbs;
};

// Method to get all subcategories
CategorySchema.methods.getAllSubcategories = async function() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CategoryModel = this.constructor as mongoose.Model<any>;
  const subcategories = await CategoryModel.find({
    path: new RegExp(`^${this.path}/`)
  });
  return subcategories;
};

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
