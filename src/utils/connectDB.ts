import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || '';

// For demo deployment, we'll skip database connection if URI is not provided
if (!MONGODB_URI) {
  console.warn("MONGODB_URI not provided - running in demo mode without database");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // Extend NodeJS.Global to include mongoose cache

  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {

  // Skip database connection for demo deployment
  if (!MONGODB_URI) {
    console.log("Running in demo mode - no database connection");
    return null;
  }
  
  if (cached.conn) return cached.conn;


  


  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
