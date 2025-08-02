import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/models/drizzle";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email, and password are required" },
        { status: 400 }
      );
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "invalid email format" },
        { status: 400 }
      );
    }

    // validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "user already exists" },
        { status: 409 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user - no email verification required
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        provider: "credentials",
        emailVerified: new Date(), // mark as verified immediately
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    // send welcome email without verification
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // don't fail the signup if email fails
    }

    return NextResponse.json(
      { 
        message: "user created successfully",
        user: newUser[0],
        requiresVerification: false
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("sign-up error-", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

// force Node.js runtime for bcrypt
export const runtime = "nodejs";
