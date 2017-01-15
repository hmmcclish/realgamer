CREATE TABLE game_titles (
	game_id UNSIGNED INT(8),
	title VARCHAR(128),
	order UNSIGNED TINYINT(3),
	country TINYINT(3),
	region TINYINT(1),
	comment VARCHAR(64)
);