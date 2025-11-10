import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db-schema";
import { authUtils, validationSchemas, createApiResponse, AppError, sessionUtils, rateLimitKeys } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || "unknown";

    // Rate limiting: 5 attempts per IP per 15 minutes
    const isAllowed = await sessionUtils.checkRateLimit(
      rateLimitKeys.login(ip),
      5,
      900 // 15 minutes
    );

    if (!isAllowed) {
      return NextResponse.json(
        createApiResponse(false, null, "Too many login attempts. Please try again later."),
        { status: 429 }
      );
    }

    const body = await request.json();
    const { emailOrUsername, password } = validationSchemas.login.parse(body);

    // Find user by email or username
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, emailOrUsername))
      .limit(1);

    if (!user[0]) {
      // Try finding by username if email didn't match
      user = await db
        .select()
        .from(users)
        .where(eq(users.username, emailOrUsername))
        .limit(1);

      if (!user[0]) {
        return NextResponse.json(
          createApiResponse(false, null, "Invalid email/username or password"),
          { status: 401 }
        );
      }
    }

    const userData = user[0];

    // Check if user is active
    if (!userData.isActive) {
      return NextResponse.json(
        createApiResponse(false, null, "Account is deactivated"),
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await authUtils.verifyPassword(password, userData.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        createApiResponse(false, null, "Invalid email/username or password"),
        { status: 401 }
      );
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userData.id));

    // Generate tokens
    const accessToken = await authUtils.generateAccessToken({
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      isPremium: userData.isPremium,
    });

    const refreshToken = await authUtils.generateRefreshToken(userData.id);

    // Store refresh token in Redis
    await sessionUtils.setRefreshToken(refreshToken, userData.id);

    // Store session
    await sessionUtils.setSession(`session:${userData.id}`, {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      isPremium: userData.isPremium,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return NextResponse.json(
      createApiResponse(true, {
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          displayName: userData.displayName,
          avatarUrl: userData.avatarUrl,
          role: userData.role,
          isPremium: userData.isPremium,
          subscriptionTier: userData.subscriptionTier,
        },
        token: accessToken,
        refreshToken,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createApiResponse(false, null, error.errors[0].message),
        { status: 400 }
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        createApiResponse(false, null, error.message),
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      createApiResponse(false, null, "Internal server error"),
      { status: 500 }
    );
  }
}