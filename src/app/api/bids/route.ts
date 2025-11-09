import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bids } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single bid fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const bid = await db.select()
        .from(bids)
        .where(eq(bids.id, parseInt(id)))
        .limit(1);

      if (bid.length === 0) {
        return NextResponse.json({ 
          error: 'Bid not found',
          code: "BID_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(bid[0], { status: 200 });
    }

    // List bids with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const productId = searchParams.get('productId');
    const buyerId = searchParams.get('buyerId');

    let query = db.select().from(bids);

    // Build filter conditions
    const conditions = [];
    if (productId && !isNaN(parseInt(productId))) {
      conditions.push(eq(bids.productId, parseInt(productId)));
    }
    if (buyerId && !isNaN(parseInt(buyerId))) {
      conditions.push(eq(bids.buyerId, parseInt(buyerId)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, buyerId, bidAmount } = body;

    // Validate required fields
    if (!productId) {
      return NextResponse.json({ 
        error: "Product ID is required",
        code: "MISSING_PRODUCT_ID" 
      }, { status: 400 });
    }

    if (!buyerId) {
      return NextResponse.json({ 
        error: "Buyer ID is required",
        code: "MISSING_BUYER_ID" 
      }, { status: 400 });
    }

    if (bidAmount === undefined || bidAmount === null) {
      return NextResponse.json({ 
        error: "Bid amount is required",
        code: "MISSING_BID_AMOUNT" 
      }, { status: 400 });
    }

    // Validate productId is a valid integer
    if (isNaN(parseInt(productId))) {
      return NextResponse.json({ 
        error: "Product ID must be a valid integer",
        code: "INVALID_PRODUCT_ID" 
      }, { status: 400 });
    }

    // Validate buyerId is a valid integer
    if (isNaN(parseInt(buyerId))) {
      return NextResponse.json({ 
        error: "Buyer ID must be a valid integer",
        code: "INVALID_BUYER_ID" 
      }, { status: 400 });
    }

    // Validate bidAmount is a number and > 0
    const parsedBidAmount = parseFloat(bidAmount);
    if (isNaN(parsedBidAmount) || parsedBidAmount <= 0) {
      return NextResponse.json({ 
        error: "Bid amount must be greater than 0",
        code: "INVALID_BID_AMOUNT" 
      }, { status: 400 });
    }

    // Create new bid
    const newBid = await db.insert(bids)
      .values({
        productId: parseInt(productId),
        buyerId: parseInt(buyerId),
        bidAmount: parsedBidAmount,
        bidDate: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newBid[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { bidAmount } = body;

    // Validate bidAmount if provided
    if (bidAmount !== undefined && bidAmount !== null) {
      const parsedBidAmount = parseFloat(bidAmount);
      if (isNaN(parsedBidAmount) || parsedBidAmount <= 0) {
        return NextResponse.json({ 
          error: "Bid amount must be greater than 0",
          code: "INVALID_BID_AMOUNT" 
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({ 
        error: "Bid amount is required for update",
        code: "MISSING_BID_AMOUNT" 
      }, { status: 400 });
    }

    // Check if bid exists
    const existingBid = await db.select()
      .from(bids)
      .where(eq(bids.id, parseInt(id)))
      .limit(1);

    if (existingBid.length === 0) {
      return NextResponse.json({ 
        error: 'Bid not found',
        code: "BID_NOT_FOUND" 
      }, { status: 404 });
    }

    // Update bid
    const updated = await db.update(bids)
      .set({
        bidAmount: parseFloat(bidAmount),
      })
      .where(eq(bids.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if bid exists
    const existingBid = await db.select()
      .from(bids)
      .where(eq(bids.id, parseInt(id)))
      .limit(1);

    if (existingBid.length === 0) {
      return NextResponse.json({ 
        error: 'Bid not found',
        code: "BID_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete bid
    const deleted = await db.delete(bids)
      .where(eq(bids.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Bid deleted successfully',
      bid: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}