CREATE TYPE user_role AS ENUM (
    'user',
    'admin'
);

CREATE TABLE IF NOT EXISTS public.users
(
    username    varchar(20)     NOT NULL,
    password    varchar(255)    NOT NULL,
    role        user_role       NOT NULL DEFAULT 'user',
    CONSTRAINT users_pkey PRIMARY KEY (username)
);