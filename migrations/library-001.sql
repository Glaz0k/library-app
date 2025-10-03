CREATE TABLE IF NOT EXISTS public.book_types
(
    id          integer     NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    type        varchar(20) NOT NULL,
    fine        integer     NOT NULL CHECK (fine >= 0),
    day_count   integer     NOT NULL CHECK (day_count >= 0),
    CONSTRAINT book_types_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.books
(
    id      integer     NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name    varchar(20) NOT NULL,
    stock   integer     NOT NULL CHECK (stock >= 0) DEFAULT 0,
    type_id integer     NOT NULL,
    CONSTRAINT books_pkey PRIMARY KEY (id),
    CONSTRAINT fk_books_book_types FOREIGN KEY (type_id)
        REFERENCES public.book_types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.clients
(
    id              integer     NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    first_name      varchar(20) NOT NULL,
    last_name       varchar(20) NOT NULL,
    middle_name     varchar(20),
    passport_series char(4)     NOT NULL CHECK (passport_series ~ '^[0-9]{4}$'),
    passport_number char(6)     NOT NULL CHECK (passport_number ~ '^[0-9]{6}$'),
    CONSTRAINT clients_pkey PRIMARY KEY (id),
    CONSTRAINT unique_passport UNIQUE (passport_series, passport_number)
);

CREATE TABLE IF NOT EXISTS public.journal
(
    id          integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    book_id     integer NOT NULL,
    client_id   integer NOT NULL,
    date_beg    date    NOT NULL DEFAULT current_date,
    date_end    date    NOT NULL,
    date_ret    date,
    CONSTRAINT journal_pkey PRIMARY KEY (id),
    CONSTRAINT fk_journal_books FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_journal_clients FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);