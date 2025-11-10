import { ObjectId } from "mongodb";

// Template Schema
export interface Template {
  _id: ObjectId;
  name: string;
  description: string;
  creatorId: string; // UUID from PostgreSQL users table
  category: string; // 'gaming', 'streaming', 'content-creator', etc.
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: string; // 'grid', 'list', 'card'
    animations: boolean;
  };
  previewImage: string;
  cssTemplate: string;
  htmlStructure: string;
  isPublic: boolean;
  isApproved: boolean;
  downloads: number;
  rating: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Event Schema
export interface AnalyticsEvent {
  _id: ObjectId;
  profileId: string; // UUID from PostgreSQL profiles table
  eventType: "view" | "click" | "template_download";
  data: {
    linkId?: string; // UUID from PostgreSQL profile_links table
    userAgent?: string;
    ipHash?: string;
    referrer?: string;
    country?: string;
    timestamp: Date;
    userId?: string; // Optional user UUID if logged in
  };
  createdAt: Date;
}

// Template Types
export type CreateTemplateData = Omit<Template, "_id" | "downloads" | "rating" | "createdAt" | "updatedAt">;
export type UpdateTemplateData = Partial<Omit<Template, "_id" | "creatorId" | "createdAt">>;

// Analytics Types
export type CreateAnalyticsEventData = Omit<AnalyticsEvent, "_id" | "createdAt">;