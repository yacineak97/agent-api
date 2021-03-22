-- DO $$
-- begin
-- IF EXISTS (SELECT FROM pg_database WHERE datname = 'beacon') THEN
--     RAISE NOTICE 'Database already exists';  -- optional
-- ELSE
--  PERFORM dblink_exec('dbname=' || current_database()   -- current db
--                      , 'CREATE DATABASE ' || quote_ident('beacon'));
-- END IF;
-- end $$;

-- \c beacon;

DROP TABLE IF EXISTS prodcuts_comments CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS products_videos CASCADE;
DROP TABLE IF EXISTS products_images CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS category CASCADE;

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    companyName VARCHAR(1024) NOT NULL,
    avatar VARCHAR(2048) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(2048) NOT NULL,
    permission INT[] NOT NULL
);

CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    username VARCHAR(128) NOT NULL,
    first_name VARCHAR(512) NOT NULL,
    last_name VARCHAR(512) NOT NULL,
    email VARCHAR(2048) NOT NULL,
    avatar VARCHAR(2048) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    brief TEXT NOT NULL DEFAULT 'N/A',
    password TEXT NOT NULL,
    role SERIAL REFERENCES roles(id) ON DELETE CASCADE,
    account_id SERIAL REFERENCES accounts(id) ON DELETE CASCADE
);


CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(2048) NOT NULL,
    description TEXT NOT NULL DEFAULT 'N/A'
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(2048) NOT NULL,
    description TEXT NOT NULL DEFAULT 'N/A',
    price FLOAT NOT NULL,
    old_price FLOAT DEFAULT 0,
    created_at BIGINT,
    agent_id SERIAL REFERENCES agents(id) ON DELETE CASCADE,
    account_id SERIAL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id SERIAL REFERENCES categories(id) ON DELETE SET NULL
);

ALTER TABLE products ALTER COLUMN category_id drop not null;

CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    username VARCHAR(128) NOT NULL,
    firstName VARCHAR(512) NOT NULL,
    lastName VARCHAR(512) NOT NULL,
    email VARCHAR(2048) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar VARCHAR(2048) NOT NULL,
    brief TEXT NOT NULL DEFAULT 'N/A',
    address VARCHAR(2048) NOT NULL
);

CREATE TABLE prodcuts_comments (
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    rate INT NOT NULL,
    liked BOOLEAN NOT NULL,
    disliked BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    author_id SERIAL REFERENCES visitors(id) ON DELETE CASCADE,
    comment_id SERIAL REFERENCES prodcuts_comments(id) ON DELETE CASCADE,
    product_id SERIAL REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title VARCHAR(2048) NOT NULL,
    description TEXT NOT NULL DEFAULT 'N/A',
    agent_id SERIAL REFERENCES agents(id)  ON DELETE CASCADE
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title VARCHAR(2048) NOT NULL,
    description TEXT NOT NULL DEFAULT 'N/A',
    agent_id SERIAL REFERENCES agents(id) ON DELETE CASCADE
);

CREATE TABLE products_images (
    id SERIAL PRIMARY KEY,
    product_id SERIAL REFERENCES products(id) ON DELETE CASCADE,
    image_id SERIAL REFERENCES images(id) ON DELETE CASCADE
);

CREATE TABLE products_videos (
    id SERIAL PRIMARY KEY,
    product_id SERIAL REFERENCES products(id) ON DELETE CASCADE,
    video_id SERIAL REFERENCES videos(id) ON DELETE CASCADE
);
