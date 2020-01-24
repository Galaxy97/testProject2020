const Router = require('koa-router');

const db = require('../../db');

const router = new Router();

router.get('/api/columns', async ctx => {
  const data = await db.query(`SELECT * FROM columns;`);
  ctx.type = 'application/json';
  ctx.ok(data.rows);
});
router.get('/api/cards', async ctx => {
  const data = await db.query(`SELECT * FROM cards ORDER BY column_id;`);
  const objResponse = {};
  data.rows.forEach(row => {
    // eslint-disable-next-line no-prototype-builtins
    if (!objResponse.hasOwnProperty(row.column_id))
      objResponse[row.column_id] = [];
    objResponse[row.column_id].push(row);
  });
  ctx.type = 'application/json';
  ctx.ok(objResponse);
});
// create new column
router.post('/api/column', async ctx => {
  try {
    const {ownName} = ctx.request.body;
    // write in table colomns
    const res = await db.query(
      `INSERT INTO columns(own_name) VALUES('${ownName}') RETURNING column_id ;`,
    );
    ctx.ok({
      id: res.rows[0].column_id,
    });
  } catch (err) {
    ctx.internalServerError();
  }
});

// create new card
router.post('/api/card', async ctx => {
  try {
    const {colomnID, text} = ctx.request.body;
    // write in table colomns
    const res = await db.query(
      `INSERT INTO cards(column_id,card_text) VALUES('${colomnID}','${text}') RETURNING card_id ;`,
    );
    ctx.ok({
      id: res.rows[0].card_id,
    });
  } catch (err) {
    ctx.internalServerError(err);
  }
});
// move card
router.put('/api/card', async ctx => {
  try {
    const {cardID, columnID} = ctx.request.body;
    // change columnID for concrete card
    const res = await db.query(
      `UPDATE cards SET column_id = ${columnID} WHERE card_id = ${cardID} RETURNING column_id;`,
    );
    ctx.ok({
      id: res.rows[0].column_id,
    });
  } catch (err) {
    ctx.internalServerError(err);
  }
});

// create new column
router.delete('/api/column', async ctx => {
  try {
    const id = ctx.headers.column_id;
    // delete colomns
    await db.query(`DELETE FROM columns WHERE column_id = ${id};`);
    ctx.ok();
  } catch (err) {
    ctx.internalServerError();
  }
});
// create new column
router.delete('/api/card', async ctx => {
  try {
    const id = ctx.headers.card_id;
    // delete colomns
    await db.query(`DELETE FROM cards WHERE card_id = ${id};`);
    ctx.ok();
  } catch (err) {
    ctx.internalServerError();
  }
});

module.exports = router;
