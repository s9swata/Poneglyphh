import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  varchar,
  index,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { volunteer, organisation } from "./users";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "shortlisted",
  "rejected",
  "withdrawn",
]);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

/**
 * events – created by organisations, represent volunteer opportunities
 * (field surveys, research tasks, data-collection campaigns, etc.)
 */
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** The organisation that owns this event. */
    orgId: text("org_id")
      .notNull()
      .references(() => organisation.userId, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),

    /** Compensation amount per hour. */
    pay: numeric("pay", { precision: 10, scale: 2, mode: "number" }).notNull(),

    /** Free-text location (city, region, remote, etc.) */
    location: varchar("location", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_events_org_id").on(table.orgId),
    index("idx_events_created_at").on(table.createdAt),
  ],
);

/**
 * applications – tracks volunteer interest / applications per event.
 * Uniqueness is enforced at (event_id, volunteer_id) so a volunteer can only
 * apply once per event.
 */
export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),

    volunteerId: text("volunteer_id")
      .notNull()
      .references(() => volunteer.userId, { onDelete: "cascade" }),

    status: applicationStatusEnum("status").default("applied").notNull(),

    appliedAt: timestamp("applied_at").defaultNow().notNull(),
  },
  (table) => [
    // Support "my applications" queries efficiently
    index("idx_applications_volunteer_id").on(table.volunteerId),
    // Support "applicants for this event" queries efficiently
    index("idx_applications_event_id").on(table.eventId),
    // Prevent duplicate applications
    uniqueIndex("uq_applications_event_volunteer").on(table.eventId, table.volunteerId),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const eventsRelations = relations(events, ({ one, many }) => ({
  organisation: one(organisation, {
    fields: [events.orgId],
    references: [organisation.userId],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  event: one(events, {
    fields: [applications.eventId],
    references: [events.id],
  }),
  volunteer: one(volunteer, {
    fields: [applications.volunteerId],
    references: [volunteer.userId],
  }),
}));
