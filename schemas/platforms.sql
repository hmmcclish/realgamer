CREATE TABLE platforms (
	id UNSIGNED INT(8),
	name VARCHAR(32),
	manufacturer_id UNSIGNED INT(8) COMMENT 'company id',
	generation UNSIGNED TINYINT(3),
	release_date DATE,
);