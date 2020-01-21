const compose = require('koa-compose');

const homepage = require('./routes/homepage/index');
const api = require('./routes/api/index');

module.exports = compose([homepage.routes(), api.routes()]);
