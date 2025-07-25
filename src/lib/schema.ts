import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'), // make nullable for OAuth users
  emailVerified: timestamp('email_verified'),
  emailVerificationToken: text('email_verification_token'),
  emailVerificationExpires: timestamp('email_verification_expires'),
  emailVerificationCode: text('email_verification_code'), 
  emailVerificationCodeExpires: timestamp('email_verification_code_expires'), 
  image: text('image'), 
  provider: text('provider').default('credentials'),
  providerId: text('provider_id'), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').default(''),
  content: text('content').default(''),
  starred: boolean('starred').default(false),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
