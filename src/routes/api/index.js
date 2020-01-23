const Router = require('koa-router');

const db = require('../../db');

const router = new Router();

router.get('/api/columns', ctx => {
  ctx.type = 'application/json';
  ctx.body = JSON.stringify({
    // desc: {ownName: 'Alex'},
  });
});

router.get('/test', async ctx => {
  try {
    // console.log(await db.query('SELECT 1 + 1 AS result'));
    const result = await db.query('SELECT * FROM colomn');
    console.log(result);
    ctx.body = 'OK';
  } catch (error) {
    console.error(error);
    ctx.body = 'error';
  }
});

module.exports = router;
