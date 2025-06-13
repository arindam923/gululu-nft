import { NextRequest, NextResponse } from 'next/server';
import * as React from 'react';
import { renderAsync } from '@react-email/render';
import { BurnConfirmationEmail } from '@/lib/emails/burn-confirmation';
import { sendBurnConfirmationEmail } from '@/lib/email';

/**
 * Test API route to preview the burn confirmation email
 * This is for development purposes only
 */
export async function GET(request: NextRequest) {
  try {
    // Get parameters from the query string
    const { searchParams } = new URL(request.url);
    
    // Extract parameters with defaults
    const walletAddress = searchParams.get('walletAddress') || '0x1234567890abcdef1234567890abcdef12345678';
    const contractAddress = searchParams.get('contractAddress') || '0xabcdef1234567890abcdef1234567890abcdef12';
    const tokenId = searchParams.get('tokenId') || '12345';
    const name = searchParams.get('name') || 'Test NFT';
    const media = searchParams.get('media') || 'https://placehold.co/400x400/png';
    const pointsReceived = parseInt(searchParams.get('points') || '100');
    
    // Create test data
    const testData = {
      walletAddress,
      nftDetails: {
        contractAddress,
        tokenId,
        name,
        media,
      },
      pointsReceived,
    };
    
    // Render the email template
    const html = await renderAsync(
      React.createElement(BurnConfirmationEmail, testData)
    );

      
    try {
      await sendBurnConfirmationEmail({
        walletAddress,
        email:"ar867027@gmail.com",
        nftDetails:testData.nftDetails,
        pointsReceived,
      });
      return NextResponse.json("it's done bitch ");
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    
   
  } catch (error) {
    console.error('Error rendering test email:', error);
    return NextResponse.json(
      { error: 'Failed to render test email' },
      { status: 500 }
    );
  }
}