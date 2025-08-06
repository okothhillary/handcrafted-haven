import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import { User } from '@/models/user';
import { getServerSession } from 'next-auth';

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

    const profileData = {
      businessName: user.sellerProfile?.businessName || '',
      description: user.sellerProfile?.description || '',
      totalProducts: user.sellerProfile?.totalProducts || 0,
      totalSales: user.sellerProfile?.totalSales || 0,
      rating: user.sellerProfile?.rating || 0,
      isVerified: user.sellerProfile?.isVerified || false
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Artisan profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const { businessName, description, website, socialMedia } = await request.json();

    // Update seller profile
    user.sellerProfile = {
      ...user.sellerProfile,
      businessName,
      description,
      website,
      socialMedia
    };

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update artisan profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
