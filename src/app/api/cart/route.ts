import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cart } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single cart item by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const cartItem = await db.select()
        .from(cart)
        .where(eq(cart.id, parseInt(id)))
        .limit(1);

      if (cartItem.length === 0) {
        return NextResponse.json({ 
          error: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json(cartItem[0], { status: 200 });
    }

    // List all cart items with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const buyerId = searchParams.get('buyerId');

    let query = db.select().from(cart);

    // Apply buyerId filter if provided
    if (buyerId) {
      if (isNaN(parseInt(buyerId))) {
        return NextResponse.json({ 
          error: "Valid buyerId is required",
          code: "INVALID_BUYER_ID" 
        }, { status: 400 });
      }
      query = query.where(eq(cart.buyerId, parseInt(buyerId)));
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
    const { buyerId, productId, quantity } = body;

    // Validate required fields
    if (!buyerId) {
      return NextResponse.json({ 
        error: "buyerId is required",
        code: "MISSING_BUYER_ID" 
      }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json({ 
        error: "productId is required",
        code: "MISSING_PRODUCT_ID" 
      }, { status: 400 });
    }

    // Validate buyerId is a valid integer
    if (isNaN(parseInt(buyerId))) {
      return NextResponse.json({ 
        error: "buyerId must be a valid integer",
        code: "INVALID_BUYER_ID" 
      }, { status: 400 });
    }

    // Validate productId is a valid integer
    if (isNaN(parseInt(productId))) {
      return NextResponse.json({ 
        error: "productId must be a valid integer",
        code: "INVALID_PRODUCT_ID" 
      }, { status: 400 });
    }

    // Validate quantity if provided
    const parsedQuantity = quantity !== undefined ? parseInt(quantity) : 1;
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json({ 
        error: "quantity must be a positive integer",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    // Create cart item
    const newCartItem = await db.insert(cart)
      .values({
        buyerId: parseInt(buyerId),
        productId: parseInt(productId),
        quantity: parsedQuantity,
        addedDate: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newCartItem[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { quantity } = body;

    // Validate quantity
    if (quantity === undefined) {
      return NextResponse.json({ 
        error: "quantity is required for update",
        code: "MISSING_QUANTITY" 
      }, { status: 400 });
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json({ 
        error: "quantity must be a positive integer",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    // Check if cart item exists
    const existingCartItem = await db.select()
      .from(cart)
      .where(eq(cart.id, parseInt(id)))
      .limit(1);

    if (existingCartItem.length === 0) {
      return NextResponse.json({ 
        error: 'Cart item not found',
        code: 'CART_ITEM_NOT_FOUND'
      }, { status: 404 });
    }

    // Update cart item
    const updated = await db.update(cart)
      .set({
        quantity: parsedQuantity
      })
      .where(eq(cart.id, parseInt(id)))
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if cart item exists
    const existingCartItem = await db.select()
      .from(cart)
      .where(eq(cart.id, parseInt(id)))
      .limit(1);

    if (existingCartItem.length === 0) {
      return NextResponse.json({ 
        error: 'Cart item not found',
        code: 'CART_ITEM_NOT_FOUND'
      }, { status: 404 });
    }

    // Delete cart item
    const deleted = await db.delete(cart)
      .where(eq(cart.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Cart item deleted successfully',
      cartItem: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}