import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auctions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single auction by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid ID is required',
            code: 'INVALID_ID' 
          },
          { status: 400 }
        );
      }

      const auction = await db.select()
        .from(auctions)
        .where(eq(auctions.id, parseInt(id)))
        .limit(1);

      if (auction.length === 0) {
        return NextResponse.json(
          { error: 'Auction not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(auction[0], { status: 200 });
    }

    // List all auctions with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const productId = searchParams.get('productId');

    let query = db.select().from(auctions);

    // Filter by productId if provided
    if (productId) {
      if (isNaN(parseInt(productId))) {
        return NextResponse.json(
          { 
            error: 'Valid productId is required',
            code: 'INVALID_PRODUCT_ID' 
          },
          { status: 400 }
        );
      }
      query = query.where(eq(auctions.productId, parseInt(productId)));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, minPrice, winningBidId } = body;

    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { 
          error: 'productId is required',
          code: 'MISSING_PRODUCT_ID' 
        },
        { status: 400 }
      );
    }

    if (!minPrice && minPrice !== 0) {
      return NextResponse.json(
        { 
          error: 'minPrice is required',
          code: 'MISSING_MIN_PRICE' 
        },
        { status: 400 }
      );
    }

    // Validate productId is a valid integer
    if (isNaN(parseInt(productId))) {
      return NextResponse.json(
        { 
          error: 'productId must be a valid integer',
          code: 'INVALID_PRODUCT_ID' 
        },
        { status: 400 }
      );
    }

    // Validate minPrice is greater than 0
    if (typeof minPrice !== 'number' || minPrice <= 0) {
      return NextResponse.json(
        { 
          error: 'minPrice must be a number greater than 0',
          code: 'INVALID_MIN_PRICE' 
        },
        { status: 400 }
      );
    }

    // Validate winningBidId if provided
    if (winningBidId !== undefined && winningBidId !== null && isNaN(parseInt(winningBidId))) {
      return NextResponse.json(
        { 
          error: 'winningBidId must be a valid integer',
          code: 'INVALID_WINNING_BID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if productId already exists (unique constraint)
    const existingAuction = await db.select()
      .from(auctions)
      .where(eq(auctions.productId, parseInt(productId)))
      .limit(1);

    if (existingAuction.length > 0) {
      return NextResponse.json(
        { 
          error: 'An auction already exists for this product',
          code: 'DUPLICATE_PRODUCT_ID' 
        },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      productId: parseInt(productId),
      minPrice: minPrice,
    };

    if (winningBidId !== undefined && winningBidId !== null) {
      insertData.winningBidId = parseInt(winningBidId);
    }

    // Insert auction
    const newAuction = await db.insert(auctions)
      .values(insertData)
      .returning();

    return NextResponse.json(newAuction[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    
    // Handle unique constraint violation
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { 
          error: 'An auction already exists for this product',
          code: 'DUPLICATE_PRODUCT_ID' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if auction exists
    const existingAuction = await db.select()
      .from(auctions)
      .where(eq(auctions.id, parseInt(id)))
      .limit(1);

    if (existingAuction.length === 0) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { minPrice, winningBidId } = body;

    // Validate minPrice if provided
    if (minPrice !== undefined) {
      if (typeof minPrice !== 'number' || minPrice <= 0) {
        return NextResponse.json(
          { 
            error: 'minPrice must be a number greater than 0',
            code: 'INVALID_MIN_PRICE' 
          },
          { status: 400 }
        );
      }
    }

    // Validate winningBidId if provided
    if (winningBidId !== undefined && winningBidId !== null && isNaN(parseInt(winningBidId))) {
      return NextResponse.json(
        { 
          error: 'winningBidId must be a valid integer',
          code: 'INVALID_WINNING_BID_ID' 
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (minPrice !== undefined) {
      updateData.minPrice = minPrice;
    }

    if (winningBidId !== undefined) {
      updateData.winningBidId = winningBidId === null ? null : parseInt(winningBidId);
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid fields to update',
          code: 'NO_UPDATE_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Update auction
    const updated = await db.update(auctions)
      .set(updateData)
      .where(eq(auctions.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if auction exists
    const existingAuction = await db.select()
      .from(auctions)
      .where(eq(auctions.id, parseInt(id)))
      .limit(1);

    if (existingAuction.length === 0) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      );
    }

    // Delete auction
    const deleted = await db.delete(auctions)
      .where(eq(auctions.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Auction deleted successfully',
        auction: deleted[0]
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}