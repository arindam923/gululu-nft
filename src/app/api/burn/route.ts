import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { BurnRecord } from '@/lib/models/BurnRecord';
import { sendBurnConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    
    await connectToDatabase();

    
    const { walletAddress, nftDetails, pointsReceived, email, termsAgreed } = await request.json();

    
    if (!walletAddress || !nftDetails || !pointsReceived) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    
    const burnRecord = await BurnRecord.create({
      walletAddress,
      nftDetails,
      pointsReceived,
    });
    
    
    if (email && termsAgreed) {
      
      const { User } = await import('@/lib/models/User');
      
      let user = await User.findOne({ walletAddress });
      
      if (!user) {
        user = await User.create({
          walletAddress,
          email,
          termsAgreed: true,
          termsAgreedAt: new Date(),
          points: pointsReceived, 
        });
      } else {
        
        if (!user.email) {
          user.email = email;
        }
        
        if (!user.termsAgreed) {
          user.termsAgreed = true;
          user.termsAgreedAt = new Date();
        }
        
        await user.save();
      }
      
      
      try {
        await sendBurnConfirmationEmail({
          walletAddress,
          email,
          nftDetails,
          pointsReceived,
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        
      }
    }

    
    return NextResponse.json({ success: true, data: burnRecord });
  } catch (error) {
    console.error('Error saving burn record:', error);
    return NextResponse.json(
      { error: 'Failed to save burn record' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    const query = walletAddress ? { walletAddress } : {};
    const burnRecords = await BurnRecord.find(query).sort({ burnedAt: -1 });

    return NextResponse.json({ success: true, data: burnRecords });
  } catch (error) {
    console.error('Error fetching burn records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch burn records' },
      { status: 500 }
    );
  }
}