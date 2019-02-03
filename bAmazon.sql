DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INTEGER NOT NULL
    AUTO_INCREMENT,
  product_name VARCHAR
    (50) NULL,
  department VARCHAR
    (30) NULL,
  price DECIMAL
    (10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY
    (item_id)
);

    SELECT *
    FROM products;