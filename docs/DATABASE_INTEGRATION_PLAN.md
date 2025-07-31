# 🗄️ Database Integration & Implementation Plan

## 📋 **Project Overview**

This comprehensive plan outlines the database integration strategy for the Handcrafted Haven e-commerce platform, transitioning from the current JSON-based data system to a production-ready MongoDB database with full CRUD operations and advanced features.

**Last Updated**: July 30, 2025  
**Current Status**: Ready for Database Integration  
**Live Site**: [Production Deployment](https://handcrafted-haven-git-individual-olwal-olwalgeorges-projects.vercel.app)

---

## 🎯 **Current State Analysis**

### **✅ Implemented Infrastructure**
- **MongoDB Models**: Complete Mongoose schemas implemented for all core entities
- **TypeScript Interfaces**: Full type definitions for all data models
- **API Routes**: Complete Next.js API routes for all CRUD operations
- **Data Layer**: Centralized data management with TypeScript interfaces
- **Connection Utility**: `connectDB.ts` with demo mode (ready for production)
- **Guest Checkout**: Fully functional e-commerce without authentication requirements

### **📊 Current Data Architecture**

#### **1. Core Data Models (Implemented)**

##### **Artisan Model** (`src/models/artisan.ts`)
```typescript
interface Artisan {
  id: number;                 // Unique identifier
  name: string;              // Full artisan name
  location: string;          // Geographic location
  specialties: string[];     // Craft specialties
  bio: string;              // Biography
  experience: string;        // Years of experience
  image: string;            // Profile image URL
  featured: boolean;         // Featured status
  instagram?: string;        // Social media links
  website?: string;         
  email?: string;           
  phone?: string;           
  joinedDate: string;       // Join date
  status: 'active' | 'inactive' | 'featured';
}
```

**⚠️ Missing**: Mongoose schema implementation needed

##### **Product Model** (`src/models/product.ts`) - ✅ Mongoose Schema Complete
```typescript
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  reviews: [ReviewSchema],  // Embedded reviews
}, { timestamps: true });
```

##### **User Model** (`src/models/user.ts`) - ✅ Mongoose Schema Complete
```typescript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'seller', 'admin'], 
    default: 'user' 
  },
}, { timestamps: true });
```

##### **Order Model** (`src/models/order.ts`) - ✅ Enhanced for Guest Checkout
```typescript
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for guests
  guestEmail: { type: String }, // For guest checkout
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'pending' }
}, { timestamps: true });
```

##### **Cart Model** (`src/models/cart.ts`) - ✅ Mongoose Schema Complete
```typescript
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  }]
}, { timestamps: true });
```

#### **2. Current Data Sources (Production Ready)**

##### **Artisan Data** (`src/data/artisans.ts`)
- **11 Professional Artisans**: Complete profiles with real data
- **Professional Images**: High-quality artisan portraits from reddy.ai
- **Geographic Diversity**: Global artisan representation (Mexico, USA, India, etc.)
- **Complete Profiles**: Bio, experience, specialties, contact info, social media

##### **Product Data** (`src/data/products.ts`)
- **125+ Products**: Comprehensive product catalog
- **Rich Metadata**: Images, descriptions, materials, care instructions
- **Artisan Links**: Connected to artisan profiles via artisanId
- **Category Organization**: Pottery, textiles, jewelry, woodwork, etc.

##### **API Routes** (`src/app/api/`)
```
📁 api/
├── users/          # User management (GET, POST, PUT, DELETE)
│   ├── route.ts    # User CRUD operations
│   ├── login/      # Authentication endpoints
│   └── [id]/       # Individual user operations
├── products/       # Product catalog with reviews
│   ├── route.ts    # Product listing and creation
│   ├── [id]/       # Individual product operations
│   └── [id]/review/# Product review system
├── orders/         # Order management system
│   ├── route.ts    # Order creation and listing
│   ├── [id]/       # Individual order operations
│   └── user/[userID]/ # User-specific orders
├── cart/           # Shopping cart operations
│   ├── route.ts    # Cart management
│   └── [id]/       # Individual cart operations
└── test/           # Database connection testing
```

#### **3. Database Connection Status**
- **File**: `src/utils/connectDB.ts`
- **Status**: Demo mode enabled (production ready)
- **Configuration**: MongoDB connection with caching
- **Security**: Environment variable based configuration

---

## 🚀 **Phase 1: Production Database Setup**

### **1.1 Environment Configuration**
Required environment variables for production:
```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/handcrafted-haven
NODE_ENV=production

# NextAuth.js Configuration
NEXTAUTH_SECRET=<your-secure-nextauth-secret-32-chars-minimum>
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=<your-jwt-secret-key>

# OAuth Providers (Social Authentication)
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>
GITHUB_ID=<your-github-oauth-app-id>
GITHUB_SECRET=<your-github-oauth-secret>

# Password Security
BCRYPT_SALT_ROUNDS=12

# Email Service (for verification and password reset)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=<your-email@gmail.com>
EMAIL_SERVER_PASSWORD=<your-app-password>
EMAIL_FROM=<your-no-reply@domain.com>

# Additional Security
SESSION_SECRET=<your-session-secret>
ENCRYPTION_KEY=<your-encryption-key>
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000  # 15 minutes
```

### **1.2 Database Migration Strategy**

#### **Option A: Direct Data Seeding** (Recommended)
```typescript
// Migration script: scripts/seedDatabase.ts
import { connectDB } from '@/utils/connectDB';
import { ARTISANS } from '@/data/artisans';
import { PRODUCTS } from '@/data/products';

async function seedDatabase() {
  await connectDB();
  
  // 1. Create Artisan collection
  await ArtisanModel.insertMany(ARTISANS);
  
  // 2. Create Product collection with artisan references
  const productsWithRefs = PRODUCTS.map(product => ({
    ...product,
    artisanId: findArtisanByName(product.artisan)?.id
  }));
  await ProductModel.insertMany(productsWithRefs);
  
  console.log('Database seeded successfully');
}
```

#### **Option B: Gradual Migration**
1. **Phase 1**: Enable database connection
2. **Phase 2**: Implement hybrid data loading (DB + JSON fallback)
3. **Phase 3**: Full database migration
4. **Phase 4**: Remove JSON data sources

### **1.3 Missing Database Models**

#### **Artisan Mongoose Schema** (Priority Task)
```typescript
// src/models/artisan.ts - ADD MONGOOSE SCHEMA
import mongoose from 'mongoose';

const ArtisanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  specialties: [{ type: String }],
  bio: { type: String, required: true },
  experience: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false },
  instagram: { type: String },
  website: { type: String },
  email: { type: String },
  phone: { type: String },
  joinedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'featured'], 
    default: 'active' 
  }
}, { timestamps: true });

export const ArtisanModel = mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema);
```

---

## � **User Authentication & Management Plan**

### **📋 Authentication Strategy Overview**

The Handcrafted Haven platform will implement a comprehensive authentication system that supports multiple user types while maintaining the current guest checkout functionality. This plan provides a seamless transition from guest experience to full user management.

### **🎯 Authentication Objectives**
- **Flexible Access**: Support both guest and registered user experiences
- **Security First**: Industry-standard security practices with encryption
- **User Experience**: Seamless authentication flow with social login options
- **Role-Based Access**: Support for buyers, sellers (artisans), and administrators
- **Data Persistence**: User profiles, order history, wishlists, and preferences

---

### **🔧 Phase 1: Core Authentication Infrastructure**

#### **1.1 NextAuth.js Integration** (Recommended Approach)
```bash
# Install authentication dependencies
npm install next-auth
npm install @next-auth/mongodb-adapter
npm install bcryptjs
npm install jsonwebtoken
```

#### **1.2 Authentication Configuration**
```typescript
// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { connectDB } from '@/utils/connectDB'
import { UserModel } from '@/models/user'
import bcrypt from 'bcryptjs'

export default NextAuth({
  adapter: MongoDBAdapter(connectDB()),
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        await connectDB()
        const user = await UserModel.findOne({ email: credentials.email })
        
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar
          }
        }
        return null
      }
    }),
    
    // Social Authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  }
})
```

#### **1.3 Enhanced User Model**
```typescript
// Enhanced src/models/user.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AddressSchema = new mongoose.Schema({
  type: { type: String, enum: ['shipping', 'billing'], required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
})

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Optional for social auth
  
  // User Profile
  avatar: { type: String },
  phone: { type: String },
  dateOfBirth: { type: Date },
  
  // User Preferences
  newsletter: { type: Boolean, default: false },
  smsNotifications: { type: Boolean, default: false },
  language: { type: String, default: 'en' },
  currency: { type: String, default: 'USD' },
  
  // User Role & Status
  role: { 
    type: String, 
    enum: ['user', 'artisan', 'admin'], 
    default: 'user' 
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Addresses
  addresses: [AddressSchema],
  
  // Authentication
  emailVerified: { type: Date },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  
  // Social Authentication
  providers: [{
    provider: { type: String }, // 'google', 'github', 'credentials'
    providerId: { type: String }
  }],
  
  // Account Activity
  lastLoginAt: { type: Date },
  loginCount: { type: Number, default: 0 },
  
  // User Data Migration
  guestOrderEmails: [{ type: String }], // For linking guest orders
  
}, { timestamps: true })

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
  return resetToken
}

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)
```

---

### **🔄 Phase 2: Authentication UI Components**

#### **2.1 Authentication Forms**
```typescript
// src/components/auth/SignInForm.tsx
'use client'
import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/account')
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/account' })
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialSignIn('google')}
            className="w-full border border-gray-300 rounded-md py-2 px-4 flex justify-center items-center hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              {/* Google icon SVG */}
            </svg>
            <span className="ml-2">Google</span>
          </button>
          
          <button
            onClick={() => handleSocialSignIn('github')}
            className="w-full border border-gray-300 rounded-md py-2 px-4 flex justify-center items-center hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              {/* GitHub icon SVG */}
            </svg>
            <span className="ml-2">GitHub</span>
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### **2.2 Authentication Context**
```typescript
// Update src/contexts/AuthContext.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface AuthContextType {
  user: any
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
  register: (userData: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(status === 'loading')
  }, [status])

  const login = async (email: string, password: string) => {
    // Handled by NextAuth
  }

  const logout = async () => {
    // Handled by NextAuth
  }

  const register = async (userData: any) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  }

  return (
    <AuthContext.Provider value={{
      user: session?.user,
      isLoading,
      isAuthenticated: !!session,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

### **🛡️ Phase 3: Role-Based Access Control**

#### **3.1 User Roles & Permissions**

| Role | Permissions | Description |
|------|-------------|-------------|
| **Guest** | View products, add to cart, checkout | Non-registered users (current functionality) |
| **User** | All guest permissions + account management, order history, wishlist | Registered customers |
| **Artisan** | All user permissions + product management, shop analytics | Craft creators and sellers |
| **Admin** | Full system access + user management, system settings | Platform administrators |

#### **3.2 Protected Route Components**
```typescript
// src/components/auth/ProtectedRoute.tsx
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'artisan' | 'admin'
  fallbackUrl?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  fallbackUrl = '/auth/signin' 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(fallbackUrl)
      return
    }

    if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'admin') {
      router.push('/unauthorized')
      return
    }
  }, [session, status, requiredRole, router, fallbackUrl])

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!session) {
    return null
  }

  if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
```

#### **3.3 Role-Based API Protection**
```typescript
// src/utils/auth.ts
import { getServerSession } from 'next-auth/next'
import { NextRequest } from 'next/server'

export async function requireAuth(req: NextRequest, requiredRole?: string) {
  const session = await getServerSession()
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return null
}

// Usage in API routes
// src/app/api/admin/users/route.ts
export async function GET(req: NextRequest) {
  const authError = await requireAuth(req, 'admin')
  if (authError) return authError
  
  // Admin-only logic here
}
```

---

### **🔄 Phase 4: Data Migration & Guest Order Linking**

#### **4.1 Guest Order Migration Strategy**
```typescript
// src/utils/guestOrderMigration.ts
export async function linkGuestOrdersToUser(userId: string, email: string) {
  await connectDB()
  
  // Find all guest orders with this email
  const guestOrders = await OrderModel.find({ 
    guestEmail: email,
    userId: { $exists: false }
  })
  
  // Link orders to the new user account
  await OrderModel.updateMany(
    { guestEmail: email, userId: { $exists: false } },
    { 
      $set: { userId: userId },
      $unset: { guestEmail: "" }
    }
  )
  
  // Update user document with linked emails
  await UserModel.findByIdAndUpdate(userId, {
    $addToSet: { guestOrderEmails: email }
  })
  
  return guestOrders.length
}
```

#### **4.2 Enhanced Account Page**
```typescript
// src/app/account/page.tsx - Enhanced with order history
'use client'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function AccountPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return
      
      try {
        // Fetch user orders
        const ordersRes = await fetch(`/api/orders/user/${session.user.id}`)
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
        
        // Fetch user addresses
        const userRes = await fetch(`/api/users/${session.user.id}`)
        const userData = await userRes.json()
        setAddresses(userData.addresses || [])
        
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session])

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <p className="text-gray-900">{session?.user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="text-gray-900">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Order History Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {isLoading ? (
            <p>Loading orders...</p>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.items.length} item(s)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No orders found.</p>
          )}
        </div>
        
        {/* Addresses Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {address.address}, {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-sm text-gray-600">{address.country}</p>
                    </div>
                    {address.isDefault && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No saved addresses.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
```

---

### **📊 Phase 5: Implementation Timeline**

#### **Week 1: Core Authentication Setup**
- [ ] Install NextAuth.js and dependencies
- [ ] Configure authentication providers (email/password, Google, GitHub)
- [ ] Set up environment variables for OAuth apps
- [ ] Create enhanced User model with profile fields
- [ ] Test basic sign-in/sign-up functionality

#### **Week 2: UI Components & User Experience**
- [ ] Build sign-in and sign-up forms
- [ ] Create user account dashboard
- [ ] Implement protected routes
- [ ] Add authentication to header navigation
- [ ] Test user registration and login flows

#### **Week 3: Role-Based Access & Advanced Features**
- [ ] Implement role-based access control
- [ ] Create artisan dashboard for product management
- [ ] Build admin interface for user management
- [ ] Add password reset functionality
- [ ] Implement email verification

#### **Week 4: Data Migration & Production**
- [ ] Create guest order migration system
- [ ] Test linking guest orders to new accounts
- [ ] Implement user profile management
- [ ] Add account settings and preferences
- [ ] Deploy authentication system to production

---

### **🔒 Security Best Practices**

#### **Password Security**
- **BCrypt Hashing**: Industry-standard password hashing (12+ rounds)
- **Password Requirements**: Minimum 8 characters, complexity requirements
- **Rate Limiting**: Prevent brute force attacks on login endpoints
- **Account Lockout**: Temporary lockout after failed attempts

#### **Session Management**
- **JWT Tokens**: Secure token-based authentication
- **Session Expiration**: 30-day expiration with refresh capability
- **Secure Cookies**: HTTPOnly, Secure, SameSite attributes
- **CSRF Protection**: Built-in NextAuth.js CSRF protection

#### **Data Protection**
- **Input Validation**: Comprehensive validation on all user inputs
- **SQL Injection Prevention**: Mongoose ORM with parameterized queries
- **XSS Protection**: React's built-in XSS prevention
- **Environment Variables**: Secure storage of sensitive configuration

---

## �🔄 **Phase 2: Data Model Enhancement**

### **2.1 Enhanced Product Schema** 
```typescript
// Enhancement to src/models/product.ts
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }], // Multiple product images
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  
  // Artisan relationship
  artisanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artisan',
    required: true 
  },
  artisan: { type: String }, // Keep for backward compatibility
  
  // Enhanced product data (from current data structure)
  materials: [{ type: String }],
  dimensions: { type: String },
  careInstructions: { type: String },
  story: { type: String },
  featured: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  originalPrice: { type: Number },
  
  reviews: [ReviewSchema],
}, { timestamps: true });
```

### **2.2 Enhanced Order Schema for Guest Checkout**
```typescript
// Enhancement to src/models/order.ts (supports current guest checkout)
const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true }, // Snapshot for history
  price: { type: Number, required: true }, // Price at time of order
  quantity: { type: Number, required: true, min: 1 },
  artisan: { type: String }, // Artisan name at time of order
  image: { type: String }, // Product image at time of order
  materials: [{ type: String }] // Materials at time of order
});

const ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for guest orders
  guestEmail: { type: String }, // For guest checkout (current implementation)
  
  items: [OrderItemSchema],
  shippingAddress: { type: ShippingAddressSchema, required: true },
  
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing' 
  },
  
  paymentMethod: { type: String, default: 'credit-card' },
  paymentStatus: { 
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date }
}, { timestamps: true });
```

---

## 📊 **Phase 3: Implementation Roadmap**

### **3.1 Priority 1: Core Database Setup (Week 1)**
- [ ] **Enable Production Database Connection**
  - Update `connectDB.ts` to remove demo mode
  - Configure MongoDB Atlas cluster
  - Set up environment variables
  
- [ ] **Create Artisan Mongoose Model**
  - Add Mongoose schema to `src/models/artisan.ts`
  - Test with existing artisan data
  
- [ ] **Database Seeding Script**
  - Create migration script for artisan data
  - Create migration script for product data with artisan references
  - Test data integrity

### **3.2 Priority 2: Authentication System (Week 2)**
- [ ] **Install Authentication Dependencies**
  - Install NextAuth.js, bcryptjs, and related packages
  - Set up OAuth applications (Google, GitHub)
  - Configure authentication environment variables
  
- [ ] **Implement User Authentication**
  - Create NextAuth.js configuration
  - Enhance User model with authentication fields
  - Build sign-in and sign-up forms
  
- [ ] **Protected Routes & Role Management**
  - Implement ProtectedRoute component
  - Add role-based access control
  - Create user account dashboard

### **3.3 Priority 3: API Integration & User Management (Week 3)**
- [ ] **Update API Routes to Use Database**
  - Products API: Connect to MongoDB instead of JSON
  - Artisans API: Create new endpoints
  - Orders API: Enhanced with guest checkout support and user linking
  
- [ ] **User Profile Management**
  - Implement user profile editing
  - Add address management
  - Create order history display
  
- [ ] **Guest Order Migration**
  - Create guest order linking system
  - Implement seamless account creation from checkout
  - Test guest-to-user data migration

### **3.4 Priority 4: Advanced Features & Security (Week 4)**
- [ ] **Enhanced Shopping Features**
  - Persistent cart storage in database (linked to user accounts)
  - Wishlist database integration with user accounts
  - Review system with user authentication
  
- [ ] **Security Implementation**
  - Add rate limiting to authentication endpoints
  - Implement password reset functionality
  - Add email verification system
  
- [ ] **Role-Based Features**
  - Artisan dashboard for product management
  - Admin interface for user and system management
  - Advanced analytics for different user roles

### **3.5 Priority 5: Production Optimization (Week 5)**
- [ ] **Performance Optimization**
  - Database indexing strategy (including user authentication indexes)
  - Query optimization for user-related data
  - Connection pooling and session management
  
- [ ] **Monitoring & Security**
  - Authentication monitoring and alerting
  - User activity logging
  - Security audit and penetration testing
  
- [ ] **Data Backup & Recovery**
  - User data backup strategy
  - Account recovery procedures
  - GDPR compliance implementation

---

## 🔧 **Implementation Commands**

### **Database Setup**
```bash
# 1. Install database and authentication packages
npm install mongoose bcryptjs jsonwebtoken next-auth @next-auth/mongodb-adapter

# 2. Set up environment variables
echo "MONGODB_URI=your_mongodb_connection_string" >> .env.local
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

# 3. Test database connection
npm run dev
# Visit http://localhost:3000/api/test to verify connection

# 4. Run migration script (when created)
npm run migrate:seed
```

### **Authentication Setup**
```bash
# 1. Create OAuth applications
# Google: https://console.developers.google.com/
# GitHub: https://github.com/settings/applications/new

# 2. Add OAuth credentials to environment
echo "GOOGLE_CLIENT_ID=your_google_client_id" >> .env.local
echo "GOOGLE_CLIENT_SECRET=your_google_client_secret" >> .env.local
echo "GITHUB_ID=your_github_client_id" >> .env.local
echo "GITHUB_SECRET=your_github_client_secret" >> .env.local

# 3. Test authentication
npm run dev
# Visit http://localhost:3000/api/auth/signin
```

### **Production Deployment**
```bash
# 1. Update Vercel environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GITHUB_ID
vercel env add GITHUB_SECRET
vercel env add NODE_ENV production

# 2. Deploy with database and authentication integration
vercel --prod
```

---

## 📈 **Current vs Future State**

### **Current State (JSON-based)** ✅
- **Fully Functional**: Complete e-commerce platform with guest checkout
- **Professional Data**: 11 artisans, 125+ products with rich metadata
- **Production Ready**: Successfully deployed on Vercel
- **Type Safe**: Full TypeScript implementation
- **Advanced Features**: Cart, wishlist, search, filtering, pagination

### **Future State (Database-integrated)** 🎯
- **Scalable**: MongoDB for unlimited data growth
- **Dynamic**: Real-time data updates and user-generated content
- **User Management**: Full authentication and profile system
- **Analytics**: Database-driven insights and reporting
- **Persistent Data**: Cart, wishlist, and user data stored permanently

---

## ⚠️ **Migration Risk Assessment**

### **Low Risk Items**
- Database connection setup
- Model creation and seeding
- API route updates

### **Medium Risk Items**
- Frontend data fetching changes
- User authentication integration
- Cart/wishlist persistence

### **High Risk Items**
- Data migration without downtime
- Rollback strategy if issues occur
- Performance optimization under load

**Recommendation**: Implement gradual migration with thorough testing at each phase.

---

## 🎯 **Summary & Next Steps**

The Handcrafted Haven platform is **95% complete** and **production-ready** with a sophisticated JSON-based data system. The database integration and user authentication system represents the **final 5%** needed for a fully scalable e-commerce platform with comprehensive user management.

### **Current State Advantages**
✅ **Guest Checkout Fully Functional**: Complete e-commerce experience without registration  
✅ **Professional Data**: 11 artisans, 125+ products with rich metadata  
✅ **Production Deployed**: Successfully running on Vercel  
✅ **Type-Safe Architecture**: Full TypeScript implementation  
✅ **Advanced Features**: Cart, wishlist, search, filtering, pagination  

### **Authentication Integration Benefits**
🎯 **User Accounts**: Persistent data, order history, saved addresses  
🎯 **Role-Based Access**: Support for customers, artisans, and administrators  
🎯 **Social Login**: Google and GitHub authentication for easy registration  
🎯 **Security**: Industry-standard password hashing and session management  
🎯 **Data Migration**: Seamless linking of guest orders to new accounts  

### **Immediate Actions (This Week)**
1. **Set up MongoDB Atlas cluster** and configure connection
2. **Install NextAuth.js** and authentication dependencies  
3. **Configure OAuth applications** (Google, GitHub)
4. **Remove demo mode** from connectDB.ts
5. **Create Artisan Mongoose schema**

### **Short-term Goals (Next 2 Weeks)**
1. **Complete authentication UI** (sign-in, sign-up, account dashboard)
2. **Implement protected routes** and role-based access control
3. **Create user profile management** with address and preference storage
4. **Build guest order migration** system for seamless account creation
5. **Add persistent cart and wishlist** tied to user accounts

### **Medium-term Vision (Next Month)**
1. **Artisan dashboard** for product and shop management
2. **Admin interface** for user and platform management  
3. **Advanced analytics** and reporting for different user roles
4. **Email verification** and password reset functionality
5. **Enhanced security** with rate limiting and monitoring

### **Long-term Goals (Next Quarter)**
1. **User-generated content** (reviews, ratings, Q&A)
2. **AI-powered recommendations** based on user behavior
3. **Mobile app development** with shared authentication
4. **Advanced e-commerce features** (subscriptions, multi-vendor support)
5. **International expansion** with multi-currency and localization

### **Migration Strategy**
The authentication system is designed to **preserve all existing functionality** while adding powerful user management capabilities:

- **Maintain Guest Checkout**: Users can still purchase without accounts
- **Progressive Enhancement**: Encourage account creation with benefits
- **Seamless Transition**: Convert guest orders to user accounts retroactively  
- **Zero Downtime**: Implement authentication alongside existing features

The current implementation provides an excellent foundation for comprehensive user authentication while maintaining the smooth guest experience that makes the platform accessible to all users.
