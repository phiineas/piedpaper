import { NextRequest, NextResponse } from "next/server";
import { db } from "@/models/drizzle";
import { users } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    // find user that needs verification
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          isNull(users.emailVerified)
        )
      )
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "user not found or already verified" },
        { status: 404 }
      );
    }

    // generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date();
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 15); // 15 minutes

    // generate new token (for backward compatibility)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hours

    // update user with new verification code and token
    await db
      .update(users)
      .set({
        emailVerificationCode: verificationCode,
        emailVerificationCodeExpires: verificationExpires,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: tokenExpires,
      })
      .where(eq(users.id, user[0].id));

    // send new verification email
    try {
      await sendVerificationEmail(email, verificationToken, verificationCode);
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      return NextResponse.json(
        { error: "failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "verification code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("resend verification code error:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
