import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import { User } from '@/models/user';
import { getServerSession } from 'next-auth';

// For now, we'll return mock data since we don't have a Product model yet
const mockArtworks = [
  {
    id: '1',
    name: 'Beautiful Handcrafted Vase',
    description: 'A stunning ceramic vase with intricate patterns',
    price: 89.99,
    image: '/images/products/vase.jpg',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Wooden Bowl Set',
    description: 'Set of 3 handcarved wooden bowls',
    price: 45.99,
    image: '/images/products/wooden-bowl.jpg',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Access denied - Seller only' }, { status: 403 });
    }

    // TODO: Replace with actual Product model query
    // const artworks = await Product.find({ sellerId: user._id });
    
    // For now, return mock data
    return NextResponse.json(mockArtworks);
  } catch (error) {
    console.error('Artisan artworks API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Access denied - Seller only' }, { status: 403 });
    }

    const { name, description, price, image } = await request.json();

    // TODO: Create new product using Product model
    // const newProduct = await Product.create({
    //   name,
    //   description,
    //   price,
    //   image,
    //   sellerId: user._id,
    //   status: 'active'
    // });

    // For now, return success message
    return NextResponse.json({ 
      message: 'Artwork creation will be implemented when Product model is ready',
      data: { name, description, price, image }
    });
  } catch (error) {
    console.error('Create artwork API error:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
}
