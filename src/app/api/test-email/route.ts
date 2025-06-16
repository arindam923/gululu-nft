import { NextRequest, NextResponse } from 'next/server';
import { sendBurnConfirmationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Get email from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }
    
    // Send a test email
    const result = await sendBurnConfirmationEmail({
      walletAddress: '0xTestWalletAddress',
      email,
      nftDetails: {
        contractAddress: '0xTestContractAddress',
        tokenId: '1234',
        name: 'Test NFT',
        media: 'https://example.com/test-nft.png'
      },
      pointsReceived: 100
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}