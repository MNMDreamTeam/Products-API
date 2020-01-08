CREATE DATABASE sdc_products;

\c sdc_products;

CREATE TABLE IF NOT EXISTS product_info 
    (product_id serial PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    slogan TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR (25) NOT NULL,
    default_price integer NOT NULL);

CREATE INDEX product_id_index ON product_info (product_id);

CREATE TABLE IF NOT EXISTS styles
    (product_id integer REFERENCES product_info(product_id),
    style_id serial PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    original_price integer NOT NULL,
    sale_price VARCHAR (10),
    is_default integer NOT NULL);

CREATE INDEX style_id_index ON styles (style_id);
CREATE INDEX product_id_stylesIndex ON styles (product_id);

CREATE TABLE IF NOT EXISTS photos 
    (style_id integer REFERENCES styles(style_id),
    photos_id integer UNIQUE NOT NULL,
    thumbnail_url TEXT,
    url TEXT);

CREATE INDEX style_id_photosIndex ON photos (style_id);
CREATE INDEX photos_id_photosIndex ON photos (photos_id);

CREATE TABLE IF NOT EXISTS skus 
    (style_id integer REFERENCES styles(style_id),
    skus_id integer UNIQUE NOT NULL,
    size VARCHAR (10),
    quantity integer);

CREATE INDEX style_id_skusIndex ON skus (style_id);
CREATE INDEX skus_id_skusIndex ON skus (skus_id);

CREATE TABLE IF NOT EXISTS features
    (product_id integer REFERENCES product_info(product_id),
    feature_id integer PRIMARY KEY,
    feature VARCHAR (50),
    value VARCHAR (50));

CREATE INDEX product_id_featuresIndex ON features (product_id);
CREATE INDEX feature_id_featuresIndex ON features (feature_id);

CREATE TABLE IF NOT EXISTS related
    (product_id integer REFERENCES product_info(product_id),
    related_id integer PRIMARY KEY,
    related_product_id integer);

CREATE INDEX product_id_relatedIndex ON related (product_id);
CREATE INDEX related_id_relatedIndex ON related (related_id);

CREATE INDEX related_product_id_featuresIndex ON related (related_product_id);

COPY product_info FROM '/Users/neilcrothers/ghrbld06/Data/product.csv' DELIMITER ',' CSV HEADER;

COPY styles(style_id, product_id, name, sale_price, original_price, is_default) FROM '/Users/neilcrothers/ghrbld06/Data/styles.csv' DELIMITER ',' CSV HEADER;

COPY photos(photos_id, style_id, url, thumbnail_url) FROM '/Users/neilcrothers/ghrbld06/Data/photos.csv' DELIMITER ',' CSV HEADER;

COPY skus(skus_id, style_id, size, quantity) FROM '/Users/neilcrothers/ghrbld06/Data/skus.csv' DELIMITER ',' CSV HEADER;

COPY features(feature_id, product_id, feature, value) FROM '/Users/neilcrothers/ghrbld06/Data/features.csv' DELIMITER ',' CSV HEADER;

COPY related(related_id, product_id, related_product_id) FROM '/Users/neilcrothers/ghrbld06/Data/related.csv' DELIMITER ',' CSV HEADER;