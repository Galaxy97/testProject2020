const compose = require('koa-compose');

const homepage = require('./homepage');
const api = require('./api');

module.exports = compose([homepage.routes(), api.routes()]);
