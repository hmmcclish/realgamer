CREATE TABLE games (
	id UNSIGNED INT(8),
	upc VARCHAR(20) COMMENT 'https://en.wikipedia.org/wiki/Universal_Product_Code';
	title VARCHAR(128),
	platform_id UNSIGNED INT(4),
	release_date DATE,
	score UNSIGNED TINYINT(1),
);