CREATE TABLE users (
	id UNSIGNED INT(8),
	name VARCHAR(128),
	email VARCHAR(128),
	password VARBINARY(20),
	salt VARBINARY(20),
	age UNSIGNED TINYINT(3),
	country UNSIGNED TINYINT(3) COMMENT 'https://en.wikipedia.org/wiki/ISO_3166-1_numeric'
);