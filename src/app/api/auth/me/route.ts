import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db-schema";
import { authUtils, createApiResponse, AppError, sessionUtils } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/middleware";

export const GET = requireAuth(async (request) => {
  try {
    const userId = request.user.userId;

    // Get fresh user data from database
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        role: users.role,
        isPremium: users.isPremium,
        subscriptionTier: users.subscriptionTier,
        bio: users.bio,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0]) {
      return NextResponse.json(
        createApiResponse(false, null, "User not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createApiResponse(true, { user: user[0] }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Get user error:", error);

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
});