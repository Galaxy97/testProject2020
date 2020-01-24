const {migrate} = require('postgres-migrations');

exports.run = async ({user, password, host, port, database}) => {
  const dir = `${process.cwd()}/src/migrations`;
  return migrate({user, password, host, port, database}, dir);
};
