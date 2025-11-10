import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  index,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "moderator", "admin"]);
export const subscriptionTierEnum = pgEnum("subscription_tier", ["free", "pro", "enterprise"]);
export const backgroundTypeEnum = pgEnum("background_type", ["color", "gradient", "image"]);

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 100 }),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    role: userRoleEnum("role").default("user"),
    isPremium: boolean("is_premium").default(false),
    subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
    subscriptionExpiresAt: timestamp("subscription_expires_at"),
    discordId: varchar("discord_id", { length: 20 }).unique(),
    emailVerified: boolean("email_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    lastLoginAt: timestamp("last_login_at"),
    isActive: boolean("is_active").default(true),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    usernameIdx: index("users_username_idx").on(table.username),
    discordIdIdx: index("users_discord_id_idx").on(table.discordId),
  })
);

// Profiles table
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    title: varchar("title", { length: 100 }),
    description: text("description"),
    backgroundUrl: text("background_url"),
    backgroundType: backgroundTypeEnum("background_type").default("color"),
    backgroundValue: text("background_value"),
    theme: varchar("theme", { length: 50 }).default("default"),
    customCss: text("custom_css"),
    isPublic: boolean("is_public").default(true),
    viewCount: integer("view_count").default(0),
    clickCount: integer("click_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("profiles_user_id_idx").on(table.userId),
    slugIdx: index("profiles_slug_idx").on(table.slug),
  })
);

// Profile links table
export const profileLinks = pgTable(
  "profile_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    url: text("url").notNull(),
    icon: varchar("icon", { length: 50 }).default("link"),
    customIconUrl: text("custom_icon_url"),
    displayOrder: integer("display_order").notNull(),
    isActive: boolean("is_active").default(true),
    clickCount: integer("click_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    profileIdIdx: index("profile_links_profile_id_idx").on(table.profileId),
    displayOrderIdx: index("profile_links_display_order_idx").on(table.profileId, table.displayOrder),
  })
);

// Social accounts table
export const socialAccounts = pgTable(
  "social_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
    platform: varchar("platform", { length: 30 }).notNull(),
    username: varchar("username", { length: 100 }).notNull(),
    displayName: varchar("display_name", { length: 100 }),
    avatarUrl: text("avatar_url"),
    isVerified: boolean("is_verified").default(false),
    followerCount: integer("follower_count"),
    displayOrder: integer("display_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    profileIdIdx: index("social_accounts_profile_id_idx").on(table.profileId),
    platformIdx: index("social_accounts_platform_idx").on(table.platform),
    uniqueProfilePlatform: index("social_accounts_unique_profile_platform").on(table.profileId, table.platform),
  })
);

// Files table
export const files = pgTable(
  "files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    folder: varchar("folder", { length: 255 }),
    isPublic: boolean("is_public").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("files_user_id_idx").on(table.userId),
    folderIdx: index("files_folder_idx").on(table.userId, table.folder),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  files: many(files),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  links: many(profileLinks),
  socialAccounts: many(socialAccounts),
}));

export const profileLinksRelations = relations(profileLinks, ({ one }) => ({
  profile: one(profiles, {
    fields: [profileLinks.profileId],
    references: [profiles.id],
  }),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one }) => ({
  profile: one(profiles, {
    fields: [socialAccounts.profileId],
    references: [profiles.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type ProfileLink = typeof profileLinks.$inferSelect;
export type NewProfileLink = typeof profileLinks.$inferInsert;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;