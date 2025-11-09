import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single user by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        userType: users.userType,
        createdAt: users.createdAt
      })
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json({ 
          error: 'User not found',
          code: "USER_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(user[0], { status: 200 });
    }

    // List all users with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      address: users.address,
      userType: users.userType,
      createdAt: users.createdAt
    }).from(users);

    if (search) {
      query = query.where(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address, userType } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    if (!password || !password.trim()) {
      return NextResponse.json({ 
        error: "Password is required",
        code: "MISSING_PASSWORD" 
      }, { status: 400 });
    }

    if (!userType || !userType.trim()) {
      return NextResponse.json({ 
        error: "User type is required",
        code: "MISSING_USER_TYPE" 
      }, { status: 400 });
    }

    // Validate userType
    const validUserTypes = ['buyer', 'seller', 'admin'];
    if (!validUserTypes.includes(userType.toLowerCase())) {
      return NextResponse.json({ 
        error: "User type must be 'buyer', 'seller', or 'admin'",
        code: "INVALID_USER_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone ? phone.trim() : null;
    const sanitizedAddress = address ? address.trim() : null;
    const sanitizedUserType = userType.toLowerCase();

    // Check email uniqueness
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, sanitizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ 
        error: "Email already exists",
        code: "EMAIL_EXISTS" 
      }, { status: 400 });
    }

    // Create new user
    const newUser = await db.insert(users)
      .values({
        name: sanitizedName,
        email: sanitizedEmail,
        password: password,
        phone: sanitizedPhone,
        address: sanitizedAddress,
        userType: sanitizedUserType,
        createdAt: new Date().toISOString()
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        userType: users.userType,
        createdAt: users.createdAt
      });

    return NextResponse.json(newUser[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, phone, address, userType } = body;

    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate userType if provided
    if (userType) {
      const validUserTypes = ['buyer', 'seller', 'admin'];
      if (!validUserTypes.includes(userType.toLowerCase())) {
        return NextResponse.json({ 
          error: "User type must be 'buyer', 'seller', or 'admin'",
          code: "INVALID_USER_TYPE" 
        }, { status: 400 });
      }
    }

    // Check email uniqueness if email is being updated
    if (email && email.trim().toLowerCase() !== existingUser[0].email) {
      const duplicateEmail = await db.select()
        .from(users)
        .where(
          and(
            eq(users.email, email.trim().toLowerCase()),
            eq(users.id, parseInt(id))
          )
        )
        .limit(1);

      const emailExists = await db.select()
        .from(users)
        .where(eq(users.email, email.trim().toLowerCase()))
        .limit(1);

      if (emailExists.length > 0 && emailExists[0].id !== parseInt(id)) {
        return NextResponse.json({ 
          error: "Email already exists",
          code: "EMAIL_EXISTS" 
        }, { status: 400 });
      }
    }

    // Build update object with only provided fields
    const updates: any = {};

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (email !== undefined) {
      updates.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      updates.phone = phone ? phone.trim() : null;
    }

    if (address !== undefined) {
      updates.address = address ? address.trim() : null;
    }

    if (userType !== undefined) {
      updates.userType = userType.toLowerCase();
    }

    // Update user
    const updated = await db.update(users)
      .set(updates)
      .where(eq(users.id, parseInt(id)))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        userType: users.userType,
        createdAt: users.createdAt
      });

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete user
    const deleted = await db.delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        userType: users.userType,
        createdAt: users.createdAt
      });

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'User deleted successfully',
      user: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}