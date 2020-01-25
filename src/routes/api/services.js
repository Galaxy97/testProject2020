const db = require('../../db');

module.exports.getAllColumn = async () => {
  try {
    const data = await db.query(`SELECT * FROM columns ORDER BY column_id;`);
    return data.rows;
  } catch (error) {
    return error;
  }
};

module.exports.getAllCard = async () => {
  try {
    const data = await db.query(`SELECT * FROM cards ORDER BY column_id;`);
    const objResponse = {};
    data.rows.forEach(row => {
      // eslint-disable-next-line no-prototype-builtins
      if (!objResponse.hasOwnProperty(row.column_id))
        objResponse[row.column_id] = [];
      objResponse[row.column_id].push(row);
    });
    return objResponse;
  } catch (error) {
    return error;
  }
};

module.exports.createNewColumn = async ownName => {
  try {
    const res = await db.query(
      `INSERT INTO columns(own_name) VALUES('${ownName}') RETURNING column_id ;`,
    );
    return res.rows[0].column_id;
  } catch (error) {
    return error;
  }
};

module.exports.createNewCard = async ({colomnID, title, description}) => {
  try {
    const res = await db.query(
      `INSERT INTO cards(column_id,card_title,card_description) VALUES('${colomnID}','${title}','${description}') RETURNING card_id,created_at ;`,
    );
    return res.rows[0];
  } catch (error) {
    return error;
  }
};

module.exports.updateColumn = async ({newTitle, id}) => {
  await db.query(
    `UPDATE columns SET own_name = '${newTitle}' WHERE column_id = '${id}';`,
  );
};

module.exports.updateCard = async ({newTitle, newDesc, newDate, id}) => {
  await db.query(
    `UPDATE cards SET card_title = '${newTitle}', card_description = '${newDesc}', created_at = '${new Date(
      newDate,
    )
      .toISOString()
      .slice(0, 10)}' WHERE card_id = '${id}';`,
  );
};

module.exports.moveCard = async ({cardID, columnID}) => {
  const res = await db.query(
    `UPDATE cards SET column_id = ${columnID} WHERE card_id = ${cardID} RETURNING column_id;`,
  );
  return res.rows[0].column_id;
};

module.exports.deleteColumn = async id => {
  await db.query(`DELETE FROM columns WHERE column_id = ${id};`);
};

module.exports.deleteCard = async id => {
  await db.query(`DELETE FROM cards WHERE card_id = ${id};`);
};
