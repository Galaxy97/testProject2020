const Router = require('koa-router');

const services = require('./services');

const router = new Router();

// get all columns
router.get('/api/columns', async ctx => {
  try {
    const data = await services.getAllColumn();
    ctx.ok(data);
  } catch (error) {
    ctx.internalServerError();
  }
});

// get all cards
router.get('/api/cards', async ctx => {
  try {
    const data = await services.getAllCard();
    ctx.ok(data);
  } catch (err) {
    ctx.internalServerError();
  }
});

// create new column
router.post('/api/column', async ctx => {
  try {
    const {ownName} = ctx.request.body;
    const id = await services.createNewColumn(ownName);
    ctx.ok({id});
  } catch (err) {
    ctx.internalServerError();
  }
});

// create new card
router.post('/api/card', async ctx => {
  try {
    const {colomnID, title, description} = ctx.request.body;
    const data = await services.createNewCard({colomnID, title, description});
    ctx.ok(data);
  } catch (err) {
    ctx.internalServerError();
  }
});
// edit column
router.patch('/api/column', async ctx => {
  try {
    const {newTitle, id} = ctx.request.body;
    await services.updateColumn({newTitle, id});
    ctx.ok();
  } catch (err) {
    ctx.internalServerError();
  }
});
// edit card
router.patch('/api/card', async ctx => {
  try {
    const {newTitle, newDesc, newDate, id} = ctx.request.body;
    await services.updateCard({newTitle, newDesc, newDate, id});
    ctx.ok();
  } catch (err) {
    ctx.internalServerError();
  }
});

// move column
router.put('/api/column', async ctx => {
  try {
    const {columnID, newPlace} = ctx.request.body;
    // moving column
    await services.moveColumn({columnID: Number(columnID), newPlace});
    ctx.ok();
  } catch (err) {
    ctx.internalServerError(err);
  }
});

// move card
router.put('/api/card', async ctx => {
  try {
    const {cardID, columnID} = ctx.request.body;
    // change columnID for concrete card
    const id = await services.moveCard({cardID, columnID});
    ctx.ok({id});
  } catch (err) {
    ctx.internalServerError(err);
  }
});

// delete column
router.delete('/api/column', async ctx => {
  try {
    const id = ctx.headers.column_id;
    // delete colomns
    await services.deleteColumn(Number(id));
    ctx.ok();
  } catch (err) {
    ctx.internalServerError();
  }
});

// delete card
router.delete('/api/card', async ctx => {
  try {
    const id = ctx.headers.card_id;
    // delete colomns
    await services.deleteCard(id);
    ctx.ok();
  } catch (err) {
    ctx.internalServerError();
  }
});

module.exports = router;
