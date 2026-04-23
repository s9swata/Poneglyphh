import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, varchar } from "drizzle-orm/pg-core";

import { sources, volunteerTags } from "./data";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const volunteer = pgTable(
  "volunteer",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    description: text("description"),
    city: varchar("city", { length: 100 }),
    pastWorks: text("past_works").array().notNull().default([]),
    bio: text("bio"),
    isOpenToWork: boolean("is_open_to_work").default(false).notNull(),
    wantsToStartOrg: boolean("wants_to_start_org").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_volunteer_city").on(table.city)],
);

export const organisation = pgTable("organisation", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  // Core identity
  tagline: varchar("tagline", { length: 160 }),
  description: text("description"),
  // Location & contact
  country: varchar("country", { length: 100 }),
  website: text("website"),

  socialLinks: text("social_links").array(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const volunteerRelations = relations(volunteer, ({ one, many }) => ({
  user: one(user, {
    fields: [volunteer.userId],
    references: [user.id],
  }),
  volunteerTags: many(volunteerTags),
}));

export const organisationRelations = relations(organisation, ({ one, many }) => ({
  user: one(user, {
    fields: [organisation.userId],
    references: [user.id],
  }),
  sources: many(sources),
}));
