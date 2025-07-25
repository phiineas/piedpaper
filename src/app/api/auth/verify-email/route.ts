import { NextRequest, NextResponse } from "next/server";
import { db } from "@/models/drizzle";
import { users } from "@/lib/schema";
import { eq, and, gt } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { token, code, email } = await request.json();

    if (!token && !code) {
      return NextResponse.json(
        { error: "verification token or code is required" },
        { status: 400 }
      );
    }

    let user;

    if (code) {
      // Verify using code (requires email)
      if (!email) {
        return NextResponse.json(
          { error: "email is required when using verification code" },
          { status: 400 }
        );
      }

      user = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.email, email),
            eq(users.emailVerificationCode, code),
            gt(users.emailVerificationCodeExpires, new Date())
          )
        )
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { error: "invalid or expired verification code" },
          { status: 400 }
        );
      }
    } else {
      // verify using token (legacy method)
      user = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.emailVerificationToken, token),
            gt(users.emailVerificationExpires, new Date())
          )
        )
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { error: "invalid or expired verification token" },
          { status: 400 }
        );
      }
    }

    // update user as verified
    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
        emailVerificationCode: null,
        emailVerificationCodeExpires: null,
      })
      .where(eq(users.id, user[0].id));

    // send welcome email
    try {
      await sendWelcomeEmail(user[0].email, user[0].name);
    } catch (emailError) {
      console.error('failed to send welcome email-', emailError);
      // don't fail the verification if welcome email fails
    }

    return NextResponse.json(
      { message: "email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("email verification error-", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

// handle GET request for email verification via URL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "verification token is required" },
        { status: 400 }
      );
    }

    // find user with valid token
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.emailVerificationToken, token),
          gt(users.emailVerificationExpires, new Date())
        )
      )
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "invalid or expired verification token" },
        { status: 400 }
      );
    }

    // update user as verified
    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
        emailVerificationCode: null,
        emailVerificationCodeExpires: null,
      })
      .where(eq(users.id, user[0].id));

    // send welcome email
    try {
      await sendWelcomeEmail(user[0].email, user[0].name);
    } catch (emailError) {
      console.error('failed to send welcome email-', emailError);
    }

    return NextResponse.json(
      { message: "email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("email verification error-", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
