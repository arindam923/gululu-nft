import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { BurnRecord } from "@/lib/models/BurnRecord";
import { User } from "@/lib/models/User";
import { sendBurnConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { walletAddress, nftDetails, pointsReceived, email, termsAgreed } =
      await request.json();

    if (!walletAddress || !nftDetails || !pointsReceived) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const burnRecord = await BurnRecord.create({
      walletAddress,
      nftDetails,
      pointsReceived,
    });

    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = await User.create({
        walletAddress,
        email: email || undefined,
        termsAgreed: termsAgreed || false,
        termsAgreedAt: termsAgreed ? new Date() : undefined,
        points: pointsReceived,
      });
    } else {
      if (email && !user.email) {
        user.email = email;
      }

      if (termsAgreed && !user.termsAgreed) {
        user.termsAgreed = true;
        user.termsAgreedAt = new Date();
      }

      user.points = (user.points || 0) + pointsReceived;
      user.updatedAt = new Date();

      await user.save();
    }

    if (email && termsAgreed) {
      try {
        console.log('Attempting to send email to:', email);
        const emailResult = await sendBurnConfirmationEmail({
          walletAddress,
          email,
          nftDetails,
          pointsReceived,
        });
        console.log('Email send result:', emailResult);
        if (!emailResult.success) {
          console.error('Email sending failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    } else {
      console.log('Email not sent - email:', email, 'termsAgreed:', termsAgreed);
    }

    return NextResponse.json({
      success: true,
      data: {
        burnRecord,
        user: {
          walletAddress: user.walletAddress,
          points: user.points,
        },
      },
    });
  } catch (error) {
    console.error("Error processing NFT swap:", error);
    return NextResponse.json(
      { error: "Failed to process NFT swap" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    const query = walletAddress ? { walletAddress } : {};
    const swapRecords = await BurnRecord.find(query).sort({ burnedAt: -1 });

    return NextResponse.json({ success: true, data: swapRecords });
  } catch (error) {
    console.error("Error fetching swap records:", error);
    return NextResponse.json(
      { error: "Failed to fetch swap records" },
      { status: 500 }
    );
  }
}
