CREATE TABLE columns (
  column_id SERIAL NOT NULL PRIMARY KEY,
  own_name VARCHAR(255)
);

CREATE TABLE cards (
  card_id SERIAL NOT NULL PRIMARY KEY,
  card_text TEXT,
  column_id INT NOT NULL,
  FOREIGN KEY (column_id)
    REFERENCES columns (column_id)
    ON DELETE CASCADE
);
