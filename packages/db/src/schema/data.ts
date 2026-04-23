import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  integer,
  varchar,
  uuid,
  primaryKey,
  pgEnum,
  vector,
} from "drizzle-orm/pg-core";
import { user, volunteer, organisation } from "./users";

export const sourceTypeEnum = pgEnum("source_type", ["upload", "external_url", "api"]);

export const datasetStatusEnum = pgEnum("dataset_status", [
  "pending",
  "approved",
  "rejected",
  "archived",
]);

export const fileTypeEnum = pgEnum("file_type", [
  "pdf",
  "csv",
  "xlsx",
  "xls",
  "json",
  "docx",
  "other",
]);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
  }), // Only for user-uploads
  name: varchar("name", { length: 50 }).notNull(),
  url: text("url"), // Only for external sources
  sourceType: sourceTypeEnum("source_type").notNull().default("upload"),
  isVerified: boolean("is_verified").default(false).notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

// Core pointer record table
export const datasets = pgTable(
  "datasets",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    externalId: text("external_id").unique(), // CKAN/source package ID for dedup

    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"), // for thumbnail card
    thumbnailS3Key: text("thumbnail_s3_key"),
    summary: text("summary"),

    publicationDate: timestamp("publication_date"),
    publisher: varchar("publisher", { length: 255 }),

    language: varchar("language", { length: 10 }).default("en").notNull(),

    s3Keys: text("s3_keys").array(), // Attachments
    fileTypes: fileTypeEnum("file_types").array(),
    sourceUrl: text("source_url"), // On demand fetch

    embedding: vector("embedding", { dimensions: 768 }),

    status: datasetStatusEnum("dataset_status").default("pending").notNull(),

    viewCount: integer("view_count").default(0).notNull(),
    downloadCount: integer("download_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("datasets_source_id_idx").on(table.sourceId),
    index("datasets_embedding_idx").using("hnsw", table.embedding.op("vector_cosine_ops")),
  ],
);

// Junction table for filtering
export const datasetTags = pgTable(
  "dataset_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("dataset_tags_dataset_id_idx").on(table.datasetId),
    index("dataset_tags_tag_id_idx").on(table.tagId),
    uniqueIndex("dataset_tags_dataset_id_tag_id_unique").on(table.datasetId, table.tagId),
  ],
);

// Junction table linking volunteers with tags
export const volunteerTags = pgTable(
  "volunteer_tags",
  {
    volunteerId: text("volunteer_id")
      .notNull()
      .references(() => volunteer.userId, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_volunteer_tags_tag_id").on(table.tagId),
    primaryKey({
      name: "volunteer_tags_pk",
      columns: [table.volunteerId, table.tagId],
    }),
  ],
);

export const syncStatusEnum = pgEnum("sync_status", ["running", "completed", "failed"]);

export const syncLogs = pgTable("sync_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  syncStatus: syncStatusEnum("sync_status").default("running").notNull(),
  totalFound: integer("total_found").default(0).notNull(),
  added: integer("added").default(0).notNull(),
  updated: integer("updated").default(0).notNull(),
  archived: integer("archived").default(0).notNull(),
  errorCount: integer("error_count").default(0).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  error: text("error"),
});

export const sourcesRelations = relations(sources, ({ one, many }) => ({
  user: one(user, {
    fields: [sources.userId],
    references: [user.id],
  }),
  organisation: one(organisation, {
    fields: [sources.userId],
    references: [organisation.userId],
  }),
  datasets: many(datasets),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  datasetTags: many(datasetTags),
  volunteerTags: many(volunteerTags),
}));

export const datasetsRelations = relations(datasets, ({ one, many }) => ({
  source: one(sources, {
    fields: [datasets.sourceId],
    references: [sources.id],
  }),
  datasetTags: many(datasetTags),
}));

export const datasetTagsRelations = relations(datasetTags, ({ one }) => ({
  dataset: one(datasets, {
    fields: [datasetTags.datasetId],
    references: [datasets.id],
  }),
  tag: one(tags, {
    fields: [datasetTags.tagId],
    references: [tags.id],
  }),
}));

export const volunteerTagsRelations = relations(volunteerTags, ({ one }) => ({
  volunteer: one(volunteer, {
    fields: [volunteerTags.volunteerId],
    references: [volunteer.userId],
  }),
  tag: one(tags, {
    fields: [volunteerTags.tagId],
    references: [tags.id],
  }),
}));
