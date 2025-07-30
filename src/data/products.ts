// Centralized product data source
// This should be the single source of truth for all product data across the application

export interface Product {
  id: number;
  name: string;
  artisan: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  image: string; // For compatibility with existing code
  category: string;
  onSale?: boolean;
  featured?: boolean;
  description: string;
  materials: string[];
  dimensions?: string;
  careInstructions?: string;
  story?: string;
  inStock?: boolean;
}

// Complete product database - single source of truth
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Handwoven Ceramic Bowl",
    artisan: "Maria Rodriguez",
    price: 45,
    originalPrice: 60,
    rating: 4.8,
    reviews: 23,
    images: ["/images/products/ceramic-bowl.jpg", "/images/products/ceramic-bowl.jpg", "/images/products/ceramic-bowl.jpg"],
    image: "/images/products/ceramic-bowl.jpg",
    category: "pottery",
    onSale: true,
    featured: true,
    description: "A beautiful handwoven ceramic bowl perfect for serving or as a decorative piece. Each piece is individually crafted using traditional techniques passed down through generations.",
    materials: ["Ceramic", "Natural Glaze"],
    dimensions: "8\" diameter x 3\" height",
    careInstructions: "Hand wash only. Not microwave safe.",
    story: "Maria Rodriguez has been crafting pottery for over 20 years in her studio in Oaxaca, Mexico. Each piece reflects her deep connection to traditional Mexican ceramics while incorporating modern design elements.",
    inStock: true
  },
  {
    id: 2,
    name: "Macrame Wall Hanging",
    artisan: "Sarah Chen",
    price: 78,
    rating: 4.9,
    reviews: 31,
    images: ["/images/products/macrame-wall.jpg", "/images/products/macrame-wall.jpg", "/images/products/macrame-wall.jpg"],
    image: "/images/products/macrame-wall.jpg",
    category: "textiles",
    featured: true,
    description: "Intricate macrame wall hanging that adds bohemian charm to any space. Handcrafted with natural cotton cord.",
    materials: ["Cotton Cord", "Wooden Ring"],
    dimensions: "24\" width x 36\" height",
    careInstructions: "Dust gently. Avoid moisture.",
    story: "Sarah Chen combines traditional knotting techniques with modern design aesthetics to create unique wall hangings and home decor pieces.",
    inStock: true
  },
  {
    id: 3,
    name: "Wooden Cutting Board",
    artisan: "James Wilson",
    price: 35,
    rating: 4.7,
    reviews: 18,
    images: ["/images/products/wooden-board.jpg", "/images/products/wooden-board.jpg", "/images/products/wooden-board.jpg"],
    image: "/images/products/wooden-board.jpg",
    category: "woodwork",
    description: "Durable hardwood cutting board with natural grain patterns. Perfect for kitchen use.",
    materials: ["Maple Wood", "Food-Safe Finish"],
    dimensions: "12\" x 8\" x 1\"",
    careInstructions: "Hand wash and oil monthly.",
    story: "James Wilson creates functional art pieces from sustainably sourced hardwoods, showcasing natural beauty while serving practical purposes.",
    inStock: true
  },
  {
    id: 4,
    name: "Silver Wire Wrapped Pendant",
    artisan: "Elena Popov",
    price: 52,
    originalPrice: 68,
    rating: 5.0,
    reviews: 12,
    images: ["/images/products/silver-pendant.jpg", "/images/products/silver-pendant.jpg", "/images/products/silver-pendant.jpg"],
    image: "/images/products/silver-pendant.jpg",
    category: "jewelry",
    onSale: true,
    description: "Elegant silver wire wrapped pendant with natural stone centerpiece. Each piece tells its own unique story.",
    materials: ["Sterling Silver", "Natural Stone"],
    dimensions: "2\" x 1.5\"",
    careInstructions: "Clean with silver cloth.",
    story: "Elena Popov creates intricate wire-wrapped jewelry using traditional European techniques, often featuring natural stones and crystals.",
    inStock: true
  },
  {
    id: 5,
    name: "Glass Art Vase",
    artisan: "Emma Davis",
    price: 120,
    originalPrice: 150,
    rating: 4.7,
    reviews: 12,
    images: ["/images/products/pottery-vase.jpg", "/images/products/pottery-vase.jpg", "/images/products/pottery-vase.jpg"],
    image: "/images/products/pottery-vase.jpg",
    category: "glasswork",
    onSale: true,
    description: "Elegant blown glass vase with unique color patterns. Each piece is individually hand-blown by skilled artisans using traditional techniques.",
    materials: ["Blown Glass", "Color Pigments"],
    dimensions: "8\" height x 4\" diameter",
    careInstructions: "Handle with care. Clean with soft cloth and mild soap.",
    story: "Emma Davis has been creating beautiful glass art for over 15 years. Her studio specializes in contemporary blown glass pieces that blend traditional techniques with modern aesthetic sensibilities.",
    inStock: true
  },
  {
    id: 6,
    name: "Knitted Wool Scarf",
    artisan: "Lisa Johnson",
    price: 55,
    rating: 4.5,
    reviews: 27,
    images: ["/images/products/wool-scarf.jpg", "/images/products/wool-scarf.jpg", "/images/products/wool-scarf.jpg"],
    image: "/images/products/wool-scarf.jpg",
    category: "textiles",
    description: "Soft merino wool scarf with traditional patterns. Handknitted using time-honored techniques passed down through generations.",
    materials: ["Merino Wool", "Cotton Blend"],
    dimensions: "72\" length x 8\" width",
    careInstructions: "Hand wash in cold water. Lay flat to dry.",
    story: "Lisa Johnson learned knitting from her grandmother and has been creating beautiful scarves and accessories for over a decade. Each piece features traditional Nordic patterns with a contemporary twist.",
    inStock: true
  },
  {
    id: 7,
    name: "Woven Cotton Throw Blanket",
    artisan: "Lisa Martinez",
    price: 125,
    rating: 4.8,
    reviews: 44,
    images: ["/images/products/cotton-blanket.jpg", "/images/products/cotton-blanket.jpg", "/images/products/cotton-blanket.jpg"],
    image: "/images/products/cotton-blanket.jpg",
    category: "textiles",
    description: "Beautiful hand-woven cotton throw blanket with geometric patterns in natural colors.",
    materials: ["Cotton", "Natural Dyes"],
    dimensions: "60\" x 80\"",
    careInstructions: "Machine wash cold, tumble dry low.",
    story: "Lisa Martinez learned traditional weaving techniques from her grandmother and specializes in creating comfortable home textiles with modern geometric patterns.",
    inStock: true
  },
  {
    id: 8,
    name: "Carved Wooden Sculpture",
    artisan: "Robert Brown",
    price: 145,
    rating: 4.9,
    reviews: 19,
    images: ["/images/products/wood-sculpture.jpg", "/images/products/wood-sculpture.jpg", "/images/products/wood-sculpture.jpg"],
    image: "/images/products/wood-sculpture.jpg",
    category: "woodwork",
    featured: true,
    description: "Intricate hand-carved wooden sculpture showcasing traditional woodworking skills.",
    materials: ["Hardwood", "Natural Oil Finish"],
    dimensions: "12\" x 8\" x 6\"",
    careInstructions: "Dust regularly, oil annually.",
    story: "Robert Brown has been carving wood for over 30 years, creating sculptures that celebrate the natural beauty and grain of different wood species.",
    inStock: true
  },
  {
    id: 9,
    name: "Handmade Gold Ring",
    artisan: "Anna Kowalski",
    price: 95,
    originalPrice: 120,
    rating: 4.7,
    reviews: 33,
    images: ["/images/products/gold-ring.jpg", "/images/products/gold-ring.jpg", "/images/products/gold-ring.jpg"],
    image: "/images/products/gold-ring.jpg",
    category: "jewelry",
    onSale: true,
    description: "Beautiful handcrafted gold ring with organic texture and smooth finish.",
    materials: ["14K Gold", "Hand Finished"],
    dimensions: "Various sizes available",
    careInstructions: "Clean with jewelry cloth.",
    story: "Anna Kowalski creates unique jewelry pieces in her studio, focusing on organic forms and traditional metalsmithing techniques.",
    inStock: true
  },
  {
    id: 10,
    name: "Ceramic Tea Set",
    artisan: "Hiroshi Tanaka",
    price: 180,
    rating: 4.9,
    reviews: 56,
    images: ["/images/products/ceramic-tea-set.jpg", "/images/products/ceramic-tea-set.jpg", "/images/products/ceramic-tea-set.jpg"],
    image: "/images/products/ceramic-tea-set.jpg",
    category: "pottery",
    featured: true,
    description: "Elegant handmade ceramic tea set featuring traditional Japanese design elements.",
    materials: ["Ceramic", "Traditional Glaze"],
    dimensions: "Teapot: 6\" x 4\", Cups: 3\" x 2\"",
    careInstructions: "Hand wash only, avoid thermal shock.",
    story: "Hiroshi Tanaka trained in traditional Japanese pottery techniques and creates tea sets that honor centuries-old craftsmanship traditions.",
    inStock: true
  },
  {
    id: 11,
    name: "Embroidered Silk Scarf",
    artisan: "Fatima Al-Zahra",
    price: 67,
    rating: 4.8,
    reviews: 29,
    images: ["/images/products/silk-scarf.jpg", "/images/products/silk-scarf.jpg", "/images/products/silk-scarf.jpg"],
    image: "/images/products/silk-scarf.jpg",
    category: "textiles",
    description: "Luxurious hand-embroidered silk scarf with intricate floral patterns in vibrant colors.",
    materials: ["Pure Silk", "Hand Embroidery"],
    dimensions: "60\" x 20\"",
    careInstructions: "Dry clean only.",
    story: "Fatima Al-Zahra specializes in traditional Middle Eastern embroidery techniques, creating luxurious silk accessories with intricate patterns.",
    inStock: true
  },
  {
    id: 12,
    name: "Hand-forged Iron Candle Holder",
    artisan: "Thomas Mueller",
    price: 58,
    rating: 4.6,
    reviews: 21,
    images: ["/images/products/iron-candle-holder.jpg", "/images/products/iron-candle-holder.jpg", "/images/products/iron-candle-holder.jpg"],
    image: "/images/products/iron-candle-holder.jpg",
    category: "metalwork",
    description: "Rustic hand-forged iron candle holder with traditional blacksmith craftsmanship.",
    materials: ["Forged Iron", "Dark Finish"],
    dimensions: "8\" height x 4\" base",
    careInstructions: "Wipe clean, oil occasionally to prevent rust.",
    story: "Thomas Mueller is a traditional blacksmith who creates functional art pieces using time-honored forging techniques passed down through generations.",
    inStock: true
  }
];

// Utility functions for working with products
export const getProductById = (id: number): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return PRODUCTS.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return PRODUCTS.filter(product => product.featured);
};

export const getProductsOnSale = (): Product[] => {
  return PRODUCTS.filter(product => product.onSale);
};

export const getProductsByArtisan = (artisan: string): Product[] => {
  return PRODUCTS.filter(product => product.artisan === artisan);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.artisan.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.materials.some(material => material.toLowerCase().includes(lowercaseQuery))
  );
};

// Get paginated products (for dynamic loading)
export const getProducts = (page: number = 1, limit: number = 6): {
  products: Product[];
  hasMore: boolean;
  total: number;
} => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const products = PRODUCTS.slice(startIndex, endIndex);
  
  return {
    products,
    hasMore: endIndex < PRODUCTS.length,
    total: PRODUCTS.length
  };
};
