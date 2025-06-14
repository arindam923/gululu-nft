import { Resend } from 'resend';
import * as React from 'react';
import { BurnConfirmationEmail } from './emails/burn-confirmation';
import { renderAsync } from '@react-email/render';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Interface for burn confirmation email data
interface BurnConfirmationEmailData {
  walletAddress: string;
  email: string;
  nftDetails: {
    contractAddress: string;
    tokenId: string;
    name?: string;
    media?: string;
  };
  pointsReceived: number;
}

/**
 * Send a burn confirmation email
 */
export async function sendBurnConfirmationEmail(data: BurnConfirmationEmailData) {
  try {
    // Render the React component to HTML
    const html = await renderAsync(
      React.createElement(BurnConfirmationEmail, {
        walletAddress: data.walletAddress,
        nftDetails: data.nftDetails,
        pointsReceived: data.pointsReceived,
      })
    );

    // Send the email
    const { data: emailData, error } = await resend.emails.send({
      from: 'noreply@gululu.io',
      to: data.email,
      subject: 'NFT Swap Confirmation - Gululand',
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}