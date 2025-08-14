import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import { getServerSession } from 'next-auth';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Check if the user is requesting their own stats or is an admin
    if (session.user.email !== email && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await connectDB();
    
    // Get MongoDB client
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db('handcrafted-haven');

    // Count reviews by this user's email (userId field in reviews contains email)
    const reviewCount = await db.collection('product_reviews').countDocuments({
      userId: email
    });

    // For now, we'll use placeholder data for orders and wishlist
    // TODO: Replace with actual data when Order and Wishlist collections are implemented
    const totalOrders = 0; // Placeholder
    const wishlistItems = 0; // Placeholder

    await client.close();

    const stats = {
      totalOrders,
      wishlistItems,
      reviewCount
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('User stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
