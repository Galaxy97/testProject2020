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
