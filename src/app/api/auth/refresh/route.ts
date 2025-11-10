import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db-schema";
import { authUtils, createApiResponse, AppError, sessionUtils } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        createApiResponse(false, null, "Refresh token is required"),
        { status: 400 }
      );
    }

    // Validate refresh token
    const userId = await sessionUtils.validateRefreshToken(refreshToken);

    if (!userId) {
      return NextResponse.json(
        createApiResponse(false, null, "Invalid or expired refresh token"),
        { status: 401 }
      );
    }

    // Get user data
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0] || !user[0].isActive) {
      // Revoke the refresh token if user doesn't exist or is inactive
      await sessionUtils.revokeRefreshToken(refreshToken);
      return NextResponse.json(
        createApiResponse(false, null, "User not found or inactive"),
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = await authUtils.generateAccessToken({
      userId: user[0].id,
      email: user[0].email,
      role: user[0].role,
      isPremium: user[0].isPremium,
    });

    // Generate new refresh token (rotation)
    const newRefreshToken = await authUtils.generateRefreshToken(user[0].id);

    // Revoke old refresh token and store new one
    await sessionUtils.revokeRefreshToken(refreshToken);
    await sessionUtils.setRefreshToken(newRefreshToken, user[0].id);

    // Update session
    await sessionUtils.setSession(`session:${user[0].id}`, {
      userId: user[0].id,
      email: user[0].email,
      role: user[0].role,
      isPremium: user[0].isPremium,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return NextResponse.json(
      createApiResponse(true, {
        token: accessToken,
        refreshToken: newRefreshToken,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Token refresh error:", error);

    return NextResponse.json(
      createApiResponse(false, null, "Internal server error"),
      { status: 500 }
    );
  }
}