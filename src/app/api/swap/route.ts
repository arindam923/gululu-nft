import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { BurnRecord } from '@/lib/models/BurnRecord';
import { User } from '@/lib/models/User';
import { sendBurnConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const { walletAddress, nftDetails, pointsReceived, email, termsAgreed } = await request.json();

    // Validate required fields
    if (!walletAddress || !nftDetails || !pointsReceived) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create burn record
    const burnRecord = await BurnRecord.create({
      walletAddress,
      nftDetails,
      pointsReceived,
    });
    
    // Handle user creation/update and points
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // Create new user
      user = await User.create({
        walletAddress,
        email: email || undefined,
        termsAgreed: termsAgreed || false,
        termsAgreedAt: termsAgreed ? new Date() : undefined,
        points: pointsReceived,
      });
    } else {
      // Update existing user
      if (email && !user.email) {
        user.email = email;
      }
      
      if (termsAgreed && !user.termsAgreed) {
        user.termsAgreed = true;
        user.termsAgreedAt = new Date();
      }
      
      // Add points to existing total
      user.points = (user.points || 0) + pointsReceived;
      user.updatedAt = new Date();
      
      await user.save();
    }
    
    // Send confirmation email if email is provided
    if (email && termsAgreed) {
      try {
        await sendBurnConfirmationEmail({
          walletAddress,
          email,
          nftDetails,
          pointsReceived,
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the entire operation if email fails
      }
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      data: {
        burnRecord,
        user: {
          walletAddress: user.walletAddress,
          points: user.points
        }
      }
    });
  } catch (error) {
    console.error('Error processing NFT swap:', error);
    return NextResponse.json(
      { error: 'Failed to process NFT swap' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    const query = walletAddress ? { walletAddress } : {};
    const swapRecords = await BurnRecord.find(query).sort({ burnedAt: -1 });

    return NextResponse.json({ success: true, data: swapRecords });
  } catch (error) {
    console.error('Error fetching swap records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swap records' },
      { status: 500 }
    );
  }
}