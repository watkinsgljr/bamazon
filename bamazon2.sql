USE bamazon_db;

INSERT INTO products
(product, department, price, stock)
VALUES
('Ray Bans shades', 'Accessories', 200, 23),
('Tank Top', 'Apparel', 15, 50),
('Beach Watch', 'Accessories', 50, 18),
('Nike Slides', 'Apparel', 75, 20),
('Thong Slippers', 'Apparel', 15, 26),
('Swimming Trunks', 'Apparel', 25, 11),
('Voleyball Net', 'Fun in the Sun', 20, 11),
('Ice Chest', 'Fun in the Sun', 30, 28),
('Sun Visor', 'Apparel', 15, 23),
('Volleyball', 'Fun in the Sun', 15, 50);

USE bamazon_db;
SELECT * 
FROM products