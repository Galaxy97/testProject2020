const Koa = require('koa');
const serve = require('koa-static');
const db = require('./src/db');
// const bodyParser = require('koa-body');
const routes = require('./src/routes.js');

// db connection
db.start()
  .then(() => {
    console.log('connect');
    // create server
    const app = new Koa();
    // include app routes
    app.use(routes);
    // include static files
    app.use(serve('./src/static'));
    // listen port
    app.listen(3000);
  })
  .catch(e => console.log(e));
