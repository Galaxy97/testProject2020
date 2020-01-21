const Router = require('koa-router');

const router = new Router();

router.get('/api/columns', ctx => {
  ctx.type = 'application/json';
  ctx.body = JSON.stringify({
    // desc: {ownName: 'Alex'},
  });
});

module.exports = router;
