import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Password hashing and verification
export const authUtils = {
  hashPassword: async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  },

  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  },

  generateAccessToken: async (payload: {
    userId: string;
    email: string;
    role: string;
    isPremium: boolean;
  }): Promise<string> => {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

    return await new SignJWT({
      ...payload,
      type: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(secret);
  },

  generateRefreshToken: async (userId: string): Promise<string> => {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const tokenId = uuidv4();

    await new SignJWT({
      userId,
      tokenId,
      type: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return tokenId;
  },

  verifyToken: async (token: string): Promise<any> => {
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  },
};

// Validation schemas
export const validationSchemas = {
  register: z.object({
    email: z.string().email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    displayName: z.string().min(1, "Display name is required").max(100, "Display name must be less than 100 characters").optional(),
  }),

  login: z.object({
    emailOrUsername: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
  }),

  profile: z.object({
    slug: z
      .string()
      .min(3, "Slug must be at least 3 characters")
      .max(50, "Slug must be less than 50 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores"),
    title: z.string().max(100, "Title must be less than 100 characters").optional(),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    backgroundType: z.enum(["color", "gradient", "image"]).optional(),
    backgroundValue: z.string().optional(),
    theme: z.string().max(50, "Theme must be less than 50 characters").optional(),
    customCss: z.string().max(10000, "Custom CSS is too long").optional(),
  }),

  profileLink: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    url: z.string().url("Invalid URL"),
    icon: z.string().max(50, "Icon must be less than 50 characters").optional(),
    customIconUrl: z.string().url("Invalid custom icon URL").optional(),
    displayOrder: z.number().int().min(0, "Display order must be a non-negative integer"),
  }),

  socialAccount: z.object({
    platform: z.enum(["discord", "youtube", "twitch", "twitter", "instagram", "tiktok", "spotify", "soundcloud", "paypal", "custom"]),
    username: z.string().min(1, "Username is required").max(100, "Username must be less than 100 characters"),
    displayName: z.string().max(100, "Display name must be less than 100 characters").optional(),
    avatarUrl: z.string().url("Invalid avatar URL").optional(),
    displayOrder: z.number().int().min(0, "Display order must be a non-negative integer"),
  }),

  template: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    description: z.string().max(500, "Description must be less than 500 characters"),
    category: z.string().min(1, "Category is required").max(50, "Category must be less than 50 characters"),
    theme: z.object({
      colors: z.object({
        primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
        secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
        background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
        text: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
      }),
      fonts: z.object({
        heading: z.string(),
        body: z.string(),
      }),
      layout: z.enum(["grid", "list", "card"]),
      animations: z.boolean(),
    }),
    cssTemplate: z.string().max(50000, "CSS template is too long"),
    htmlStructure: z.string().max(10000, "HTML structure is too long"),
    tags: z.array(z.string().max(30, "Tag must be less than 30 characters")).max(10, "Maximum 10 tags allowed"),
  }),
};

// File validation
export const fileValidation = {
  isImage: (mimeType: string): boolean => {
    return mimeType.startsWith('image/');
  },

  isVideo: (mimeType: string): boolean => {
    return mimeType.startsWith('video/');
  },

  isAllowedMimeType: (mimeType: string): boolean => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg',
      'application/pdf',
      'text/plain', 'text/csv',
    ];
    return allowedTypes.includes(mimeType);
  },

  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

// Slug generation
export const generateSlug = (username: string, suffix?: string): string => {
  const base = username.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return suffix ? `${base}-${suffix}` : base;
};

// URL validation for social platforms
export const validateSocialUrl = (platform: string, url: string): boolean => {
  const patterns = {
    discord: /^https:\/\/discord\.gg\/[a-zA-Z0-9]+$/,
    youtube: /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
    twitch: /^https:\/\/(www\.)?twitch\.tv\/.+/,
    twitter: /^https:\/\/(www\.)?twitter\.com\/.+/,
    instagram: /^https:\/\/(www\.)?instagram\.com\/.+/,
    tiktok: /^https:\/\/(www\.)?tiktok\.com\/@.+$/,
    spotify: /^https:\/\/open\.spotify\.com\/.+/,
    soundcloud: /^https:\/\/(www\.)?soundcloud\.com\/.+/,
    paypal: /^https:\/\/(www\.)?paypal\.me\/.+/,
    custom: /^https?:\/\/.+$/,
  };

  const pattern = patterns[platform as keyof typeof patterns];
  return pattern ? pattern.test(url) : false;
};

// Error handling utilities
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createApiResponse = (success: boolean, data?: any, error?: string, statusCode: number = 200) => {
  return {
    success,
    data,
    error,
    statusCode,
  };
};

// Rate limiting utilities
export const rateLimitKeys = {
  auth: (ip: string) => `auth:${ip}`,
  login: (ip: string) => `login:${ip}`,
  register: (ip: string) => `register:${ip}`,
  profile: (userId: string) => `profile:${userId}`,
  upload: (userId: string) => `upload:${userId}`,
};