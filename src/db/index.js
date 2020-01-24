const {Pool} = require('pg');
const migrate = require('./migrations');

module.exports.start = async () => {
  const host = 'localhost';
  const user = 'postgres';
  const port = 5432;
  const password = 'post';
  const database = 'board';
  await migrate.run({user, password, host, port, database});
  this.pool = new Pool({user, host, database, password, port});
};

module.exports.query = async (q, data) => {
  return this.pool.query(q, data);
};

/*
CREATE TABLE colomns (
  colomn_id SERIAL NOT NULL PRIMARY KEY,
  own_name VARCHAR(255)
);

CREATE TABLE cards (
  card_id SERIAL NOT NULL PRIMARY KEY,
  card_name VARCHAR(255),
  colomn_id INT NOT NULL,
  FOREIGN KEY (colomn_id)
    REFERENCES colomns (colomn_id)
    ON DELETE CASCADE
);
 */
