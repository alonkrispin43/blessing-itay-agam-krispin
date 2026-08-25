import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const blessings = pgTable('blessings', {
  id: serial().primaryKey(),
  child: text().notNull(),
  guestName: text('guest_name').notNull(),
  message: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
