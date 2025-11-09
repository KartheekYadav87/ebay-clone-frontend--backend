import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single order item by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const orderItem = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.id, parseInt(id)))
        .limit(1);

      if (orderItem.length === 0) {
        return NextResponse.json(
          { error: 'Order item not found', code: 'ORDER_ITEM_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(orderItem[0], { status: 200 });
    }

    // List all order items with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const orderId = searchParams.get('orderId');

    let query = db.select().from(orderItems);

    // Apply order filter if provided
    if (orderId) {
      const orderIdNum = parseInt(orderId);
      if (isNaN(orderIdNum)) {
        return NextResponse.json(
          { error: 'Valid orderId is required', code: 'INVALID_ORDER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(orderItems.orderId, orderIdNum));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, quantity, priceAtPurchase } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required', code: 'MISSING_ORDER_ID' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required', code: 'MISSING_PRODUCT_ID' },
        { status: 400 }
      );
    }

    if (!quantity) {
      return NextResponse.json(
        { error: 'quantity is required', code: 'MISSING_QUANTITY' },
        { status: 400 }
      );
    }

    if (priceAtPurchase === undefined || priceAtPurchase === null) {
      return NextResponse.json(
        { error: 'priceAtPurchase is required', code: 'MISSING_PRICE_AT_PURCHASE' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { error: 'quantity must be greater than 0', code: 'INVALID_QUANTITY' },
        { status: 400 }
      );
    }

    // Validate priceAtPurchase
    if (typeof priceAtPurchase !== 'number' || priceAtPurchase <= 0) {
      return NextResponse.json(
        { error: 'priceAtPurchase must be greater than 0', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    // Create new order item
    const newOrderItem = await db
      .insert(orderItems)
      .values({
        orderId: parseInt(orderId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        priceAtPurchase: parseFloat(priceAtPurchase.toString()),
      })
      .returning();

    return NextResponse.json(newOrderItem[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if order item exists
    const existingOrderItem = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, parseInt(id)))
      .limit(1);

    if (existingOrderItem.length === 0) {
      return NextResponse.json(
        { error: 'Order item not found', code: 'ORDER_ITEM_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { quantity, priceAtPurchase } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return NextResponse.json(
          { error: 'quantity must be greater than 0', code: 'INVALID_QUANTITY' },
          { status: 400 }
        );
      }
      updates.quantity = parseInt(quantity);
    }

    if (priceAtPurchase !== undefined) {
      if (typeof priceAtPurchase !== 'number' || priceAtPurchase <= 0) {
        return NextResponse.json(
          { error: 'priceAtPurchase must be greater than 0', code: 'INVALID_PRICE' },
          { status: 400 }
        );
      }
      updates.priceAtPurchase = parseFloat(priceAtPurchase.toString());
    }

    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    // Update order item
    const updatedOrderItem = await db
      .update(orderItems)
      .set(updates)
      .where(eq(orderItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedOrderItem[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if order item exists
    const existingOrderItem = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, parseInt(id)))
      .limit(1);

    if (existingOrderItem.length === 0) {
      return NextResponse.json(
        { error: 'Order item not found', code: 'ORDER_ITEM_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete order item
    const deletedOrderItem = await db
      .delete(orderItems)
      .where(eq(orderItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Order item deleted successfully',
        deletedOrderItem: deletedOrderItem[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}