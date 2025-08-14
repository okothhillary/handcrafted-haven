
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import { MongoClient } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Handle static product IDs by using a separate reviews collection
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    const db = client.db();
    const reviewsCollection = db.collection('product_reviews');
    
    // Get reviews for this product ID (static or ObjectId)
    const reviews = await reviewsCollection.find({ 
      productId: isNaN(parseInt(id)) ? id : parseInt(id) 
    }).toArray();
    
    // Calculate stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      }
    });
    
    await client.close();
    
    return NextResponse.json({
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        productId: r.productId,
        userId: r.userId,
        userName: r.userName,
        rating: r.rating,
        title: r.title,
        content: r.content,
        photos: r.photos || [],
        date: r.createdAt,
        verified: r.verified,
        helpful: r.helpful || 0
      })),
      averageRating,
      totalReviews,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { userId, rating, comment, verified = false } = body;
    
    // Handle static product IDs by using a separate reviews collection
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    const db = client.db();
    const reviewsCollection = db.collection('product_reviews');
    
    // Create new review
    const review = {
      productId: isNaN(parseInt(id)) ? id : parseInt(id),
      userId,
      userName: 'Anonymous User', // You can get this from session
      rating,
      title: 'Great Product', // You can add this to the form
      content: comment,
      photos: [],
      verified,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await reviewsCollection.insertOne(review);
    
    // Get updated reviews and stats
    const reviews = await reviewsCollection.find({ 
      productId: isNaN(parseInt(id)) ? id : parseInt(id) 
    }).toArray();
    
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      }
    });
    
    await client.close();
    
    return NextResponse.json({
      message: 'Review added successfully',
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        productId: r.productId,
        userId: r.userId,
        userName: r.userName,
        rating: r.rating,
        title: r.title,
        content: r.content,
        photos: r.photos || [],
        date: r.createdAt,
        verified: r.verified,
        helpful: r.helpful || 0
      })),
      averageRating,
      totalReviews,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}