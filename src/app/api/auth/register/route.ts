import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, profiles } from "@/lib/db-schema";
import { authUtils, validationSchemas, createApiResponse, AppError, sessionUtils, rateLimitKeys } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || "unknown";

    // Rate limiting: 3 attempts per IP per hour
    const isAllowed = await sessionUtils.checkRateLimit(
      rateLimitKeys.register(ip),
      3,
      3600 // 1 hour
    );

    if (!isAllowed) {
      return NextResponse.json(
        createApiResponse(false, null, "Too many registration attempts. Please try again later."),
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, username, password, displayName } = validationSchemas.register.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser[0]) {
      return NextResponse.json(
        createApiResponse(false, null, "Email already exists"),
        { status: 409 }
      );
    }

    const existingUsername = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername[0]) {
      return NextResponse.json(
        createApiResponse(false, null, "Username already exists"),
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await authUtils.hashPassword(password);

    // Create user
    const newUsers = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash,
        displayName: displayName || username,
        emailVerified: false, // In production, you'd send a verification email
        isActive: true,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        displayName: users.displayName,
        role: users.role,
        isPremium: users.isPremium,
        subscriptionTier: users.subscriptionTier,
      });

    const newUser = newUsers[0];

    // Create default profile for the user
    const newProfiles = await db
      .insert(profiles)
      .values({
        userId: newUser.id,
        slug: username,
        title: `${displayName || username}'s Links`,
        description: "Check out my links!",
        isPublic: true,
      })
      .returning({
        id: profiles.id,
        slug: profiles.slug,
      });

    // Generate tokens
    const accessToken = await authUtils.generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      isPremium: newUser.isPremium,
    });

    const refreshToken = await authUtils.generateRefreshToken(newUser.id);

    // Store refresh token in Redis
    await sessionUtils.setRefreshToken(refreshToken, newUser.id);

    // Store session
    await sessionUtils.setSession(`session:${newUser.id}`, {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      isPremium: newUser.isPremium,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // TODO: Send verification email in production

    return NextResponse.json(
      createApiResponse(true, {
        user: newUser,
        profile: newProfiles[0],
        token: accessToken,
        refreshToken,
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);

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