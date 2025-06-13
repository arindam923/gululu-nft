import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const { walletAddress, email, termsAgreed } = await request.json();

    // Validate the required fields
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Find the user by wallet address or create a new one
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      user = await User.create({
        walletAddress,
        points: 0,
        email: email || null,
        termsAgreed: termsAgreed || false,
        termsAgreedAt: termsAgreed ? new Date() : null,
      });
    } else {
      // Update user fields if provided
      if (email !== undefined) {
        user.email = email;
      }
      
      if (termsAgreed !== undefined) {
        user.termsAgreed = termsAgreed;
        if (termsAgreed) {
          user.termsAgreedAt = new Date();
        }
      }

      user.updatedAt = new Date();
      await user.save();
    }

    // Return the updated user (excluding sensitive fields)
    return NextResponse.json({ 
      success: true, 
      data: { 
        walletAddress: user.walletAddress,
        email: user.email,
        termsAgreed: user.termsAgreed,
        termsAgreedAt: user.termsAgreedAt,
        points: user.points 
      } 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user information' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the wallet address from the query parameters
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Find the user by wallet address
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return NextResponse.json(
        { success: false, data: null, termsAgreed: false },
        { status: 404 }
      );
    }

    // Return user data (excluding sensitive fields)
    return NextResponse.json({ 
      success: true, 
      data: { 
        walletAddress: user.walletAddress,
        email: user.email,
        termsAgreed: user.termsAgreed,
        termsAgreedAt: user.termsAgreedAt,
        points: user.points 
      } 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user information' },
      { status: 500 }
    );
  }
}