import { relations, sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./users";

// One row per unique pair of participants.
// The CHECK constraint enforces participant_one_id < participant_two_id at the
// DB level, so reversed pairs (userB, userA) are rejected when (userA, userB)
// already exists. App code must sort the two IDs before inserting:
//   const [one, two] = [senderId, receiverId].sort();
//
// Both participant columns are nullable with SET NULL on delete.
// When a user deletes their account the conversation row survives - messages
// are preserved and the deleted participant slot becomes null.
// Cascading the conversation delete would wipe all messages before
// sender_id SET NULL could ever fire, defeating history preservation.
export const conversation = pgTable(
  "conversation",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Nullable — becomes null if the user deletes their account
    participantOneId: text("participant_one_id")
      .references(() => user.id, { onDelete: "set null" }),

    // Nullable — becomes null if the user deletes their account
    participantTwoId: text("participant_two_id")
      .references(() => user.id, { onDelete: "set null" }),

    // Denormalized — updated on every new message insert.
    // Used to sort inbox by recency without a subquery.
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("conversation_participant_one_id_idx").on(table.participantOneId),
    index("conversation_participant_two_id_idx").on(table.participantTwoId),
    // Unique on the ordered pair — prevents (userA, userB) being inserted twice
    uniqueIndex("conversation_participants_unique").on(
      table.participantOneId,
      table.participantTwoId,
    ),
    // DB-level enforcement that one < two — prevents reversed pair (userB, userA)
    // from being inserted when (userA, userB) already exists
    check(
      "conversation_participants_ordered",
      sql`${table.participantOneId} < ${table.participantTwoId}`,
    ),
  ],
);

// Individual messages within a conversation.
export const message = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),

    // SET NULL on delete — preserves message content if sender deletes account.
    // This now correctly fires because the conversation row is kept alive
    // (participant columns use SET NULL, not CASCADE).
    senderId: text("sender_id").references(() => user.id, { onDelete: "set null" }),

    content: text("content").notNull(),

    // Null = unread. Set when the receiver opens the conversation.
    readAt: timestamp("read_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Primary access pattern: all messages in a conversation, newest first
    index("message_conversation_id_created_at_idx").on(table.conversationId, table.createdAt),
  ],
);

export const conversationRelations = relations(conversation, ({ one, many }) => ({
  participantOne: one(user, {
    fields: [conversation.participantOneId],
    references: [user.id],
    relationName: "participantOne",
  }),
  participantTwo: one(user, {
    fields: [conversation.participantTwoId],
    references: [user.id],
    relationName: "participantTwo",
  }),
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
  }),
}));
