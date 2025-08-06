import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/connectDB';
import { User } from '@/models/user';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    // Check authentication and admin role
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied - Admin only' }, { status: 403 });
    }

    // Fetch dashboard statistics
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    
    // Get recent users (last 10)
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt')
      .lean();

    // For now, we'll use placeholder data for products and orders
    // TODO: Replace with actual Product and Order models when available
    const totalProducts = 125; // Placeholder
    const totalOrders = 347; // Placeholder

    const dashboardData = {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentUsers: recentUsers.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }))
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
