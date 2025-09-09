import { json, text } from "drizzle-orm/gel-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),

    email: varchar({ length: 255 }).notNull().unique(),
});

export const storyTable = pgTable("stories", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    storyId: varchar().notNull().unique(),
    storySubject: varchar(),
    storyType: varchar(),
    ageGroup: varchar(),

    imageURL: varchar().default(""),

    content: json(),

    email: varchar("email").references(() => usersTable.email),
});
