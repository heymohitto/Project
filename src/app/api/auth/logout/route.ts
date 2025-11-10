import { NextRequest, NextResponse } from "next/server";
import { createApiResponse } from "@/lib/utils";
import { sessionUtils } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Revoke refresh token if provided
    if (refreshToken) {
      await sessionUtils.revokeRefreshToken(refreshToken);
    }

    // TODO: Get user ID from JWT token and revoke session
    // For now, we'll just return success

    return NextResponse.json(
      createApiResponse(true, null, null),
      { status: 204 }
    );

  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      createApiResponse(false, null, "Internal server error"),
      { status: 500 }
    );
  }
}