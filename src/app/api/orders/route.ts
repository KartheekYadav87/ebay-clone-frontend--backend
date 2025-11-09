import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single order by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json(
          { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(order[0], { status: 200 });
    }

    // List orders with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const buyerId = searchParams.get('buyerId');
    const status = searchParams.get('status');

    let query = db.select().from(orders);

    // Build filter conditions
    const conditions = [];
    if (buyerId && !isNaN(parseInt(buyerId))) {
      conditions.push(eq(orders.buyerId, parseInt(buyerId)));
    }
    if (status) {
      conditions.push(eq(orders.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
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
    const { buyerId, totalAmount, status } = body;

    // Validate required fields
    if (!buyerId) {
      return NextResponse.json(
        { error: 'buyerId is required', code: 'MISSING_BUYER_ID' },
        { status: 400 }
      );
    }

    if (!totalAmount) {
      return NextResponse.json(
        { error: 'totalAmount is required', code: 'MISSING_TOTAL_AMOUNT' },
        { status: 400 }
      );
    }

    // Validate buyerId is a valid integer
    if (isNaN(parseInt(buyerId.toString()))) {
      return NextResponse.json(
        { error: 'buyerId must be a valid integer', code: 'INVALID_BUYER_ID' },
        { status: 400 }
      );
    }

    // Validate totalAmount
    if (isNaN(parseFloat(totalAmount.toString())) || parseFloat(totalAmount.toString()) <= 0) {
      return NextResponse.json(
        { error: 'totalAmount must be greater than 0', code: 'INVALID_TOTAL_AMOUNT' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData = {
      buyerId: parseInt(buyerId.toString()),
      totalAmount: parseFloat(totalAmount.toString()),
      status: status || 'Pending',
      orderDate: new Date().toISOString(),
    };

    const newOrder = await db.insert(orders).values(insertData).returning();

    return NextResponse.json(newOrder[0], { status: 201 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, totalAmount } = body;

    // Prepare update data
    const updates: Record<string, any> = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (totalAmount !== undefined) {
      // Validate totalAmount
      if (isNaN(parseFloat(totalAmount.toString())) || parseFloat(totalAmount.toString()) <= 0) {
        return NextResponse.json(
          { error: 'totalAmount must be greater than 0', code: 'INVALID_TOTAL_AMOUNT' },
          { status: 400 }
        );
      }
      updates.totalAmount = parseFloat(totalAmount.toString());
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(orders)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Order deleted successfully',
        deletedOrder: deleted[0],
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