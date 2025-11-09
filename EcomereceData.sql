CREATE TABLE `account` (
  `account_id` integer PRIMARY KEY,
  `account_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
);

CREATE TABLE `users` (
  `user_id` integer PRIMARY KEY,
  `account_id` integer NOT NULL,
  `profile_user_image` varchar(255) NOT NULL,
  `user_full_name` varchar(255) NOT NULL,
  `DOB` timestamp,
  `gender` varchar(255),
  `phone_number` varchar(255),
  `home_address` varchar(255),
  `office_address` varchar(255)
);

CREATE TABLE `products` (
  `product_id` integer PRIMARY KEY,
  `product_name` varchar(255),
  `product_price` double,
  `product_description` varchar(255),
  `category_id` integer
);

CREATE TABLE `product_image` (
  `product_image_id` integer PRIMARY KEY,
  `product_id` integer,
  `product_image_link` varchar(255)
);

CREATE TABLE `category` (
  `category_id` integer PRIMARY KEY,
  `category_name` varchar(255)
);

CREATE TABLE `products_cart` (
  `products_cart_id` integer PRIMARY KEY,
  `product_id` integer,
  `cart_id` integer,
  `product_quantity` integer
);

CREATE TABLE `cart` (
  `cart_id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `total_product_type` integer
);

CREATE TABLE `payment` (
  `card_id` integer PRIMARY KEY,
  `user_id` integer,
  `card_name` varchar(255),
  `card_number` varchar(255),
  `card_password` varchar(255),
  `card_code` varchar(255)
);

CREATE TABLE `order_details` (
  `order_details_id` integer PRIMARY KEY,
  `order_id` integer,
  `product_id` integer,
  `product_quantity` integer,
  `product_price` double,
  `product_category` varchar(255)
);

CREATE TABLE `orders` (
  `order_id` integer PRIMARY KEY,
  `user_id` integer,
  `total_product_type` integer,
  `total_product_quantity` integer,
  `status` varchar(255)
);

CREATE TABLE `transaction` (
  `transaction_id` integer PRIMARY KEY,
  `user_id` integer,
  `transaction_amount` integer,
  `transaction_date` date
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL PRIMARY KEY,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin
);

ALTER TABLE `users` ADD FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`);

ALTER TABLE `payment` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `order_details` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

ALTER TABLE `order_details` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `cart` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `products_cart` ADD FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`);

ALTER TABLE `products_cart` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);

ALTER TABLE `product_image` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `transaction` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE users MODIFY DOB DATE;

-- Insert Categories first
INSERT INTO category (category_id, category_name) VALUES
(1, 'Naruto Figure'),
(2, 'One Piece Figure'),
(3, 'Record Of Ragnarok Figure'),
(4, 'DragonBall Figure'),
(5, 'Other Figure');


-- Insert Products data (using CAST to ensure proper numeric type)
INSERT INTO products (product_id, product_name, product_price, product_description, category_id) VALUES
(111, 'Naruto Figure', 2990000, 'High-quality Naruto figure with detailed craftsmanship. Perfect for collectors and fans of the beloved ninja series.', 1),
(112, 'Sasuke Figure', 3590000, 'Premium Sasuke Uchiha figure featuring authentic details and dynamic pose. A must-have for Naruto enthusiasts.', 1),
(113, 'Kaido Figure', 6990000, 'Impressive Kaido figure from One Piece. This large-scale figure captures the power and presence of the Beast King.', 2),
(114, 'Lucci Figure', 1990000, 'Rob Lucci figure from One Piece with exceptional attention to detail. Perfect for completing your CP9 collection.', 2),
(115, 'Buddha Figure', 18990000, 'Rare and exclusive Buddha figure with intricate design and premium materials. A centerpiece for any serious collector.', 3),
(116, 'Songoku Figure', 5990000, 'Dynamic Son Goku figure from Dragon Ball series. Features multiple poses and authentic character design.', 4),
(117, 'Pain Figure', 2000000, 'Detailed Pain figure from Naruto Shippuden. Features the iconic Akatsuki leader with precise sculpting and authentic design.', 1),
(118, 'Naruto Modern Figure', 5000000, 'Premium Naruto Uzumaki figure with exceptional detail and vibrant colors. A standout piece for any anime collection.', 1),
(119, 'Black Goku Figure', 8000000, 'Rare Goku Black figure from Dragon Ball Super. Features dark aura effects and menacing pose, perfect for serious collectors.', 4),
(120, 'Lv Bu FengXian Figure', 12000000, 'Lu Bu Fengxian from Record of Ragnarok, captured in a fierce battle stance with intricate armor details and dynamic sculpting. A premium collector centerpiece showcasing the unmatched warlord of the series.', 3),
(121, 'Jack the Ripper Resin Statue Figure', 2000000 , 'Jack the Ripper from Record of Ragnarok, sculpted with sinister precision, detailed Victorian-era attire, and a chilling presence. A must-have for fans seeking a dark and captivating display piece.', 3),
(122, 'Todoroki Figure', 15000000 , 'Shoto Todoroki from My Hero Academia, featuring his iconic dual ice-and-fire powers in a striking pose. Crafted with vivid colors and fine detail, perfect for any anime figure enthusiast.', 5),
(123, 'Izuku Midoriya Figure', 20000000, 'Izuku Midoriya (Deku) from My Hero Academia, dynamically posed as he unleashes One For All. Meticulously detailed, this figure embodies his determination and heroic spirit.', 5);

-- Insert Product Images
INSERT INTO product_image (product_image_id, product_id, product_image_link) VALUES
(1, 111, 'https://images-na.ssl-images-amazon.com/images/I/71lKAaO0kjL.jpg'),
(2, 112, 'https://product.hstatic.net/200000740923/product/375230918_4333024960256194_5745521659294105170_n_4df8cd6b8c3b423391d4a723724142a7_master.jpg'),
(3, 113, 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/kaido_One_Piece_01_e6cd59f53d.jpg'),
(4, 114, 'https://i.ebayimg.com/00/s/MTA2Nlg4MDA=/z/Cr0AAOSw7Jlc2n2s/$_57.JPG?set_id=8800005007'),
(5, 115, 'https://i.redd.it/spdbeuq7l4lb1.jpeg'),
(6, 116, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/418/981/products/z4035734204274-12f428ac0e3e309cf429f00d467a5adb.jpg?v=1673586590863'),
(7, 117, 'https://www.bbcw.com/var/images/product/500.500/AA137597.jpg'),
(8, 118, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTebIl5QoOVAJvQZ6DY2UfvbVPQmiqA1EBnhA&s'),
(9, 119, 'https://daweebstop.com/cdn/shop/products/IMG_3927.jpg?v=1635865116&width=1445'),
(10, 120, 'https://nekotwo.com/cdn/shop/files/5_2f07e248-50e2-4471-85e8-e62f07ce1fec_2048x.jpg?v=1733727197'),
(11, 121, 'https://i.ebayimg.com/images/g/6TUAAOSwWvdnTqUp/s-l1200.jpg'),
(12, 122, 'https://animota.net/cdn/shop/files/00066820179_02.jpg?v=1705302250'),
(13, 123, 'https://first4figures.com/cdn/shop/files/launchphoto_deku_resinstn-06.jpg?v=1725877020&width=640');

