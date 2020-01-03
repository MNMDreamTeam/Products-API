CREATE DATABASE sdc_products;

\c sdc_products;

CREATE TABLE IF NOT EXISTS product_info 
    (product_id serial PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    slogan TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR (25) NOT NULL,
    default_price integer NOT NULL);

CREATE TABLE IF NOT EXISTS styles
    (product_id integer REFERENCES product_info(product_id),
    style_id serial PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    original_price integer NOT NULL,
    sale_price VARCHAR (10),
    is_default integer NOT NULL);

CREATE TABLE IF NOT EXISTS photos 
    (style_id integer REFERENCES styles(style_id),
    photos_id integer UNIQUE NOT NULL,
    thumbnail_url TEXT,
    url TEXT);

CREATE TABLE IF NOT EXISTS skus 
    (style_id integer REFERENCES styles(style_id),
    skus_id integer UNIQUE NOT NULL,
    size VARCHAR (10),
    quantity integer);

CREATE TABLE IF NOT EXISTS features
    (product_id integer REFERENCES product_info(product_id),
    feature_id integer PRIMARY KEY,
    feature VARCHAR (50),
    value VARCHAR (50));

COPY product_info FROM '/Users/neilcrothers/ghrbld06/Data/product.csv' DELIMITER ',' CSV HEADER;

COPY styles(style_id, product_id, name, sale_price, original_price, is_default) FROM '/Users/neilcrothers/ghrbld06/Data/styles.csv' DELIMITER ',' CSV HEADER;

COPY photos(photos_id, style_id, url, thumbnail_url) FROM '/Users/neilcrothers/ghrbld06/Data/photos.csv' DELIMITER ',' CSV HEADER;

COPY skus(skus_id, style_id, size, quantity) FROM '/Users/neilcrothers/ghrbld06/Data/skus.csv' DELIMITER ',' CSV HEADER;

COPY features(feature_id, product_id, feature, value) FROM '/Users/neilcrothers/ghrbld06/Data/features.csv' DELIMITER ',' CSV HEADER;