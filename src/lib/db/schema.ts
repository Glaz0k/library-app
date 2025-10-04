import {
  pgTable,
  check,
  varchar,
  foreignKey,
  integer,
  date,
  unique,
  char,
  pgView,
  bigint,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userRole = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable(
  'users',
  {
    username: varchar({ length: 20 }).primaryKey().notNull(),
    password: varchar({ length: 255 }).notNull(),
    role: userRole().default('user').notNull(),
  },
  () => [
    check('users_username_not_null', sql`NOT NULL username`),
    check('users_password_not_null', sql`NOT NULL password`),
    check('users_role_not_null', sql`NOT NULL role`),
  ]
);

export const journal = pgTable(
  'journal',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: 'journal_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    bookId: integer('book_id').notNull(),
    clientId: integer('client_id').notNull(),
    dateBeg: date('date_beg')
      .default(sql`CURRENT_DATE`)
      .notNull(),
    dateEnd: date('date_end').notNull(),
    dateRet: date('date_ret'),
  },
  (table) => [
    foreignKey({
      columns: [table.bookId],
      foreignColumns: [books.id],
      name: 'fk_journal_books',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [clients.id],
      name: 'fk_journal_clients',
    }).onDelete('cascade'),
    check('journal_id_not_null', sql`NOT NULL id`),
    check('journal_book_id_not_null', sql`NOT NULL book_id`),
    check('journal_client_id_not_null', sql`NOT NULL client_id`),
    check('journal_date_beg_not_null', sql`NOT NULL date_beg`),
    check('journal_date_end_not_null', sql`NOT NULL date_end`),
  ]
);

export const clients = pgTable(
  'clients',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: 'clients_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    firstName: varchar('first_name', { length: 20 }).notNull(),
    lastName: varchar('last_name', { length: 20 }).notNull(),
    middleName: varchar('middle_name', { length: 20 }),
    passportSeries: char('passport_series', { length: 4 }).notNull(),
    passportNumber: char('passport_number', { length: 6 }).notNull(),
  },
  (table) => [
    unique('unique_passport').on(table.passportSeries, table.passportNumber),
    check(
      'clients_passport_series_check',
      sql`passport_series ~ '^[0-9]{4}$'::text`
    ),
    check(
      'clients_passport_number_check',
      sql`passport_number ~ '^[0-9]{6}$'::text`
    ),
    check('clients_id_not_null', sql`NOT NULL id`),
    check('clients_first_name_not_null', sql`NOT NULL first_name`),
    check('clients_last_name_not_null', sql`NOT NULL last_name`),
    check('clients_passport_series_not_null', sql`NOT NULL passport_series`),
    check('clients_passport_number_not_null', sql`NOT NULL passport_number`),
  ]
);

export const bookTypes = pgTable(
  'book_types',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: 'book_types_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    type: varchar({ length: 20 }).notNull(),
    fine: integer().notNull(),
    dayCount: integer('day_count').notNull(),
  },
  () => [
    check('book_types_fine_check', sql`fine >= 0`),
    check('book_types_day_count_check', sql`day_count >= 0`),
    check('book_types_id_not_null', sql`NOT NULL id`),
    check('book_types_type_not_null', sql`NOT NULL type`),
    check('book_types_fine_not_null', sql`NOT NULL fine`),
    check('book_types_day_count_not_null', sql`NOT NULL day_count`),
  ]
);

export const books = pgTable(
  'books',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: 'books_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: varchar({ length: 20 }).notNull(),
    stock: integer().default(0).notNull(),
    typeId: integer('type_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.typeId],
      foreignColumns: [bookTypes.id],
      name: 'fk_books_book_types',
    }).onDelete('cascade'),
    check('books_stock_check', sql`stock >= 0`),
    check('books_id_not_null', sql`NOT NULL id`),
    check('books_name_not_null', sql`NOT NULL name`),
    check('books_stock_not_null', sql`NOT NULL stock`),
    check('books_type_id_not_null', sql`NOT NULL type_id`),
  ]
);

export const clientBooksCountView = pgView('client_books_count_view', {
  id: integer(),
  firstName: varchar('first_name', { length: 20 }),
  lastName: varchar('last_name', { length: 20 }),
  middleName: varchar('middle_name', { length: 20 }),
  passportSeries: char('passport_series', { length: 4 }),
  passportNumber: char('passport_number', { length: 6 }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  booksCount: bigint('books_count', { mode: 'number' }),
}).as(
  sql`SELECT c.id, c.first_name, c.last_name, c.middle_name, c.passport_series, c.passport_number, COALESCE(j.books_count, 0::bigint) AS books_count FROM clients c LEFT JOIN ( SELECT j_1.client_id, count(*) AS books_count FROM journal j_1 WHERE j_1.date_ret IS NULL GROUP BY j_1.client_id) j ON c.id = j.client_id`
);

export const top3PopularBooksView = pgView('top_3_popular_books_view', {
  id: integer(),
  name: varchar({ length: 20 }),
  stock: integer(),
  typeId: integer('type_id'),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  recordsCount: bigint('records_count', { mode: 'number' }),
}).as(
  sql`SELECT b.id, b.name, b.stock, b.type_id, COALESCE(popularity.total_book_count, 0::bigint) AS records_count FROM books b LEFT JOIN ( SELECT j.book_id, count(*) AS total_book_count FROM journal j GROUP BY j.book_id) popularity ON b.id = popularity.book_id ORDER BY popularity.total_book_count DESC LIMIT 3`
);
