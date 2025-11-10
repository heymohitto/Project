-- Create user role enum
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');

-- Create subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');

-- Create background type enum
CREATE TYPE background_type AS ENUM ('color', 'gradient', 'image');

-- Create users table
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"display_name" varchar(100),
	"avatar_url" text,
	"bio" text,
	"role" user_role DEFAULT 'user',
	"is_premium" boolean DEFAULT false,
	"subscription_tier" subscription_tier DEFAULT 'free',
	"subscription_expires_at" timestamp,
	"discord_id" varchar(20),
	"email_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_login_at" timestamp,
	"is_active" boolean DEFAULT true
);

-- Create profiles table
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"slug" varchar(50) NOT NULL,
	"title" varchar(100),
	"description" text,
	"background_url" text,
	"background_type" background_type DEFAULT 'color',
	"background_value" text,
	"theme" varchar(50) DEFAULT 'default',
	"custom_css" text,
	"is_public" boolean DEFAULT true,
	"view_count" integer DEFAULT 0,
	"click_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create profile_links table
CREATE TABLE "profile_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"profile_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"url" text NOT NULL,
	"icon" varchar(50) DEFAULT 'link',
	"custom_icon_url" text,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"click_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);

-- Create social_accounts table
CREATE TABLE "social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"profile_id" uuid NOT NULL,
	"platform" varchar(30) NOT NULL,
	"username" varchar(100) NOT NULL,
	"display_name" varchar(100),
	"avatar_url" text,
	"is_verified" boolean DEFAULT false,
	"follower_count" integer,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Create files table
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"url" text NOT NULL,
	"folder" varchar(255),
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);

-- Create indexes
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");
CREATE UNIQUE INDEX "users_username_unique" ON "users" ("username");
CREATE UNIQUE INDEX "users_discord_id_unique" ON "users" ("discord_id");
CREATE INDEX "users_email_idx" ON "users" ("email");
CREATE INDEX "users_username_idx" ON "users" ("username");
CREATE INDEX "users_discord_id_idx" ON "users" ("discord_id");

CREATE UNIQUE INDEX "profiles_slug_unique" ON "profiles" ("slug");
CREATE INDEX "profiles_user_id_idx" ON "profiles" ("user_id");
CREATE INDEX "profiles_slug_idx" ON "profiles" ("slug");

CREATE INDEX "profile_links_profile_id_idx" ON "profile_links" ("profile_id");
CREATE INDEX "profile_links_display_order_idx" ON "profile_links" ("profile_id", "display_order");

CREATE UNIQUE INDEX "social_accounts_profile_platform_unique" ON "social_accounts" ("profile_id", "platform");
CREATE INDEX "social_accounts_profile_id_idx" ON "social_accounts" ("profile_id");
CREATE INDEX "social_accounts_platform_idx" ON "social_accounts" ("platform");

CREATE INDEX "files_user_id_idx" ON "files" ("user_id");
CREATE INDEX "files_folder_idx" ON "files" ("user_id", "folder");

-- Add foreign key constraints
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;