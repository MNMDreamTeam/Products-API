CREATE DATABASE sdc_products;

CREATE TABLE IF NOT EXISTS product_info 
    (user_id serial PRIMARY KEY,
    name VARCHAR (25) UNIQUE NOT NULL,
    slogan VARCHAR (100) NOT NULL,
    description VARCHAR (250) NOT NULL,
    category VARCHAR (25) NOT NULL,
    default_price integer NOT NULL);

CREATE TABLE IF NOT EXISTS styles
    (user_id integer REFERENCES product_info(user_id),
    style_id serial PRIMARY KEY,
    name VARCHAR (100) UNIQUE NOT NULL,
    original_price integer NOT NULL,
    sale_price integer,
    is_default integer NOT NULL);

CREATE TABLE IF NOT EXISTS photos 
    (style_id integer REFERENCES styles(style_id),
    photos_id integer UNIQUE NOT NULL,
    thumbnail_url VARCHAR (100),
    url VARCHAR (100));

CREATE TABLE IF NOT EXISTS skus 
    (style_id integer REFERENCES styles(style_id),
    skus_id integer UNIQUE NOT NULL,
    size VARCHAR (5),
    quantity integer);

