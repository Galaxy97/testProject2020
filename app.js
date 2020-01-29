const Koa = require('koa');
const serve = require('koa-static');
const koaBody = require('koa-body');
const respond = require('koa-respond');

const db = require('./src/db');
const routes = require('./src/routes');

// db connection
db.start()
  .then(async () => {
    console.log('connect');
    // create server
    const app = new Koa();
    // for response
    app.use(respond());
    // body parser
    app.use(koaBody());
    // include app routes
    app.use(routes);
    // include static files
    app.use(serve('./src/static'));
    // listen port
    app.listen(3000);
    // console.log('server successful start on localhost port 3000');
  })
  .catch(e => console.log(e));
// const arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// const oldPlace = arr.indexOf('3');
// const newPlace = 8;

// const t = arr.splice(oldPlace, 1);
// arr.splice(newPlace, 0, t[0]);

// // const arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
// // let index = arr.indexOf('3');

// // arr.splice(index, 1);
