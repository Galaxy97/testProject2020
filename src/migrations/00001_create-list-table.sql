CREATE TABLE config
(
  id SERIAL NOT NULL PRIMARY KEY,
  type_of VARCHAR(10) NOT NULL,
  column_id INT,
  show_id INT NOT NULL
);
INSERT INTO config
  (type_of,column_id,show_id)
VALUES('column', 0, 1);

CREATE TABLE columns
(
  column_id SERIAL NOT NULL PRIMARY KEY,
  own_name VARCHAR(255),
  show_num INT NOT NULL
);

CREATE TABLE cards
(
  card_id SERIAL NOT NULL PRIMARY KEY,
  card_title TEXT,
  card_description TEXT,
  created_at DATE DEFAULT NOW(),
  show_num INT NOT NULL,
  column_id INT NOT NULL,
  FOREIGN KEY (column_id)
    REFERENCES columns (column_id)
    ON DELETE CASCADE
);
