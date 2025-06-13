import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { BurnRecord } from '@/lib/models/BurnRecord';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const { walletAddress, nftDetails, pointsReceived } = await request.json();

    // Validate the required fields
    if (!walletAddress || !nftDetails || !pointsReceived) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new burn record
    const burnRecord = await BurnRecord.create({
      walletAddress,
      nftDetails,
      pointsReceived,
    });

    // Return the created record
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
    // Connect to the database
    await connectToDatabase();

    // Get the wallet address from the query parameters
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    // If wallet address is provided, get records for that address
    // Otherwise, get all records
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