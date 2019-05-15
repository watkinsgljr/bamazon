DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
id INTEGER(10) NOT NULL AUTO_INCREMENT,
product VARCHAR(20) NOT NULL,
department VARCHAR(20) NOT NULL,
price INTEGER(5) NOT NULL,
stock INTEGER(5) DEFAULT 0,
sale BOOLEAN DEFAULT FALSE,
sale_price INTEGER(5) DEFAULT NULL,
PRIMARY KEY (id)
);