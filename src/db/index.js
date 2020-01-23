const {Pool} = require('pg');

module.exports.start = async () => {
  const host = 'localhost';
  const user = 'postgres';
  const port = '5432';
  const password = 'post';
  const database = 'board';
  this.pool = new Pool({user, host, database, password, port});
};

module.exports.query = async (q, data) => {
  console.log('in query');
  const dts = await this.pool.query(q, data);
  console.log(dts);
  return dts;
};
