const Router = require('koa-router');
const {createReadStream} = require('fs');

const router = new Router();

router.get('/', ctx => {
  ctx.type = 'html';
  ctx.body = createReadStream('src/static/homepage/index.html');
});

module.exports = router;
