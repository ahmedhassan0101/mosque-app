import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

/** Global cache to prevent multiple connections in development (hot reload) */
declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

/**
 * Returns a cached Mongoose connection, creating one if it doesn't exist.
 * Uses a singleton pattern safe for Next.js hot reloading in development.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}