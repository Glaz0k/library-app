import { relations } from 'drizzle-orm/relations';
import { books, journal, clients, bookTypes } from './schema';

export const journalRelations = relations(journal, ({ one }) => ({
  book: one(books, {
    fields: [journal.bookId],
    references: [books.id],
  }),
  client: one(clients, {
    fields: [journal.clientId],
    references: [clients.id],
  }),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  journals: many(journal),
  bookType: one(bookTypes, {
    fields: [books.typeId],
    references: [bookTypes.id],
  }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  journals: many(journal),
}));

export const bookTypesRelations = relations(bookTypes, ({ many }) => ({
  books: many(books),
}));
