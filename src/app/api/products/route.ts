import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single product by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const product = await db.select()
        .from(products)
        .where(eq(products.id, parseInt(id)))
        .limit(1);

      if (product.length === 0) {
        return NextResponse.json({ 
          error: 'Product not found',
          code: 'PRODUCT_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(product[0], { status: 200 });
    }

    // List products with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isAuction = searchParams.get('isAuction');
    const sellerId = searchParams.get('sellerId');

    let query = db.select().from(products);
    const conditions = [];

    // Search across name, description, and category
    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`),
          like(products.category, `%${search}%`)
        )
      );
    }

    // Filter by category
    if (category) {
      conditions.push(eq(products.category, category));
    }

    // Filter by isAuction
    if (isAuction) {
      conditions.push(eq(products.isAuction, isAuction));
    }

    // Filter by sellerId
    if (sellerId) {
      if (!isNaN(parseInt(sellerId))) {
        conditions.push(eq(products.sellerId, parseInt(sellerId)));
      }
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sellerId, 
      name, 
      description, 
      category, 
      price, 
      quantity, 
      isAuction,
      expirationDate,
      rating
    } = body;

    // Validate required fields
    if (!sellerId) {
      return NextResponse.json({ 
        error: "sellerId is required",
        code: "MISSING_SELLER_ID" 
      }, { status: 400 });
    }

    if (!name || name.trim() === '') {
      return NextResponse.json({ 
        error: "name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!category || category.trim() === '') {
      return NextResponse.json({ 
        error: "category is required",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    if (price === undefined || price === null) {
      return NextResponse.json({ 
        error: "price is required",
        code: "MISSING_PRICE" 
      }, { status: 400 });
    }

    if (quantity === undefined || quantity === null) {
      return NextResponse.json({ 
        error: "quantity is required",
        code: "MISSING_QUANTITY" 
      }, { status: 400 });
    }

    if (!isAuction) {
      return NextResponse.json({ 
        error: "isAuction is required",
        code: "MISSING_IS_AUCTION" 
      }, { status: 400 });
    }

    // Validate field values
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ 
        error: "price must be greater than 0",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ 
        error: "quantity must be 0 or greater",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    if (isAuction !== 'Y' && isAuction !== 'N') {
      return NextResponse.json({ 
        error: "isAuction must be 'Y' or 'N'",
        code: "INVALID_IS_AUCTION" 
      }, { status: 400 });
    }

    if (rating !== undefined && rating !== null) {
      if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        return NextResponse.json({ 
          error: "rating must be between 0 and 5",
          code: "INVALID_RATING" 
        }, { status: 400 });
      }
    }

    // Prepare insert data
    const insertData: any = {
      sellerId: parseInt(sellerId),
      name: name.trim(),
      category: category.trim(),
      price,
      quantity,
      isAuction,
      createdAt: new Date().toISOString()
    };

    if (description) {
      insertData.description = description.trim();
    }

    if (expirationDate) {
      insertData.expirationDate = expirationDate;
    }

    if (rating !== undefined && rating !== null) {
      insertData.rating = rating;
    }

    const newProduct = await db.insert(products)
      .values(insertData)
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      category, 
      price, 
      quantity, 
      isAuction,
      expirationDate,
      rating
    } = body;

    const updates: any = {};

    // Validate and add fields to update
    if (name !== undefined) {
      if (name.trim() === '') {
        return NextResponse.json({ 
          error: "name cannot be empty",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : description;
    }

    if (category !== undefined) {
      if (category.trim() === '') {
        return NextResponse.json({ 
          error: "category cannot be empty",
          code: "INVALID_CATEGORY" 
        }, { status: 400 });
      }
      updates.category = category.trim();
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json({ 
          error: "price must be greater than 0",
          code: "INVALID_PRICE" 
        }, { status: 400 });
      }
      updates.price = price;
    }

    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity < 0) {
        return NextResponse.json({ 
          error: "quantity must be 0 or greater",
          code: "INVALID_QUANTITY" 
        }, { status: 400 });
      }
      updates.quantity = quantity;
    }

    if (isAuction !== undefined) {
      if (isAuction !== 'Y' && isAuction !== 'N') {
        return NextResponse.json({ 
          error: "isAuction must be 'Y' or 'N'",
          code: "INVALID_IS_AUCTION" 
        }, { status: 400 });
      }
      updates.isAuction = isAuction;
    }

    if (expirationDate !== undefined) {
      updates.expirationDate = expirationDate;
    }

    if (rating !== undefined) {
      if (rating !== null) {
        if (typeof rating !== 'number' || rating < 0 || rating > 5) {
          return NextResponse.json({ 
            error: "rating must be between 0 and 5",
            code: "INVALID_RATING" 
          }, { status: 400 });
        }
      }
      updates.rating = rating;
    }

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingProduct[0], { status: 200 });
    }

    const updated = await db.update(products)
      .set(updates)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      product: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}