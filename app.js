const Koa = require('koa');
const serve = require('koa-static');
// const bodyParser = require('koa-body');
const routes = require('./src/routes.js');
// create server
const app = new Koa();
// include app routes
app.use(routes);
// include static files
app.use(serve('./src/static'));
// listen port
app.listen(3000);
