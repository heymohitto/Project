import { NextRequest, NextResponse } from "next/server";
import { authUtils, AppError } from "./utils";
import { sessionUtils } from "./redis";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
    role: string;
    isPremium: boolean;
  };
}

export async function authenticate(request: NextRequest): Promise<AuthenticatedRequest> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token required", 401);
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    // Verify JWT token
    const payload = await authUtils.verifyToken(token);

    if (!payload || payload.type !== "access") {
      throw new AppError("Invalid token", 401);
    }

    // Check if session exists in Redis
    const session = await sessionUtils.getSession(`session:${payload.userId}`);

    if (!session) {
      throw new AppError("Session expired", 401);
    }

    // Add user info to request
    (request as AuthenticatedRequest).user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      isPremium: payload.isPremium,
    };

    return request as AuthenticatedRequest;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Invalid token", 401);
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const authenticatedRequest = await authenticate(request);
      return await handler(authenticatedRequest, ...args);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

export function requireRole(role: string | string[]) {
  return (handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) => {
    return async (request: AuthenticatedRequest, ...args: any[]) => {
      const userRole = request.user.role;
      const allowedRoles = Array.isArray(role) ? role : [role];

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { success: false, error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      return await handler(request, ...args);
    };
  };
}

export function requirePremium(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (request: AuthenticatedRequest, ...args: any[]) => {
    if (!request.user.isPremium) {
      return NextResponse.json(
        { success: false, error: "Premium subscription required" },
        { status: 403 }
      );
    }

    return await handler(request, ...args);
  };
}