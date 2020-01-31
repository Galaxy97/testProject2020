const db = require('../../db');

module.exports.getAllColumn = async () => {
  try {
    const data = await db.query(`SELECT * FROM columns ORDER BY show_num;`);
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
    // get last number of columns
    let getColNum = await db.query(
      `SELECT config.show_id FROM config WHERE type_of = 'column';`,
    );
    getColNum = getColNum.rows[0].show_id;
    // new record
    const res = await db.query(
      `INSERT INTO columns(own_name,show_num) VALUES('${ownName}', '${getColNum}') RETURNING column_id ;`,
    );
    // increment last number of columns
    await db.query(
      `UPDATE config SET show_id = '${getColNum +
        1}' WHERE type_of = 'column';`,
    );
    // create num position for card
    await db.query(`INSERT INTO config (type_of,column_id,show_id)
    VALUES('card', ${res.rows[0].column_id}, 1);`);
    return res.rows[0].column_id;
  } catch (error) {
    return error;
  }
};

module.exports.createNewCard = async ({
  colomnID,
  title = 'some',
  description = 'somems',
}) => {
  try {
    let getCardNum = await db.query(
      `SELECT config.show_id FROM config WHERE column_id = '${colomnID}';`,
    );
    getCardNum = getCardNum.rows[0].show_id;
    const res = await db.query(
      `INSERT INTO
       cards(column_id,card_title,card_description,show_num)
       VALUES('${colomnID}','${title}','${description}','${getCardNum}')
       RETURNING card_id,created_at ;`,
    );
    await db.query(
      `UPDATE config SET show_id= '${getCardNum + 1}'
       WHERE column_id = '${colomnID}';`,
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

module.exports.moveColumn = async ({columnID, newPlace}) => {
  const turn = [];
  const getAllColumn = await this.getAllColumn();
  getAllColumn.forEach(row => {
    turn.push(row.column_id);
  });
  // --
  const oldPlace = turn.indexOf(columnID);
  const t = turn.splice(oldPlace, 1);
  turn.splice(newPlace, 0, t[0]);
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < turn.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await db.query(
      `UPDATE columns SET show_num = '${index + 1}' WHERE column_id = ${
        turn[index]
      };`,
    );
  }
};

module.exports.moveCard = async ({cardID, columnID, newPosition}) => {
  // get info abour card
  const cardInfo = await db.query(
    `SELECT * FROM cards WHERE card_id = ${cardID}`,
  );
  const oldColumnID = cardInfo.rows[0].column_id;
  if (columnID === oldColumnID) {
    // if same column
    // get all card in this column
    const cards = await db.query(
      `SELECT * FROM cards WHERE column_id = '${columnID}' ORDER BY show_num`,
    );
    const turn = [];
    cards.rows.forEach(card => {
      turn.push(card.card_id);
    });
    // --
    const oldPlace = turn.indexOf(cardID);
    const t = turn.splice(oldPlace, 1);
    if (!newPosition) turn.push(t[0]);
    turn.splice(newPosition, 0, t[0]);
    // --
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < turn.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await db.query(
        `UPDATE cards SET show_num = '${index + 1}' WHERE card_id = ${
          turn[index]
        };`,
      );
    }
  } else {
    // another column
    // cards in old column
    const oldCards = await db.query(
      `SELECT * FROM cards WHERE column_id = ${oldColumnID} ORDER BY show_num`,
    );
    // cards in new column
    const newCards = await db.query(
      `SELECT * FROM cards WHERE column_id = ${columnID} ORDER BY show_num`,
    );
    const oldTurn = [];
    const newTurn = [];
    oldCards.rows.forEach(card => {
      oldTurn.push(card.card_id);
    });
    newCards.rows.forEach(card => {
      newTurn.push(card.card_id);
    });
    // delete card from old turn
    const index = oldTurn.indexOf(cardID);
    const t = oldTurn.splice(index, 1);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < oldTurn.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await db.query(
        `UPDATE cards SET show_num = ${i + 1} WHERE card_id = ${oldTurn[i]};`,
      );
    }
    // update in config amount of carsd show id
    const oldColNum = await db.query(
      `SELECT config.show_id FROM config WHERE column_id = ${oldColumnID};`,
    );
    await db.query(
      `UPDATE config SET show_id = ${oldColNum.rows[0].show_id - 1}
       WHERE column_id = ${oldColumnID};`,
    );
    // add card into new turn
    if (!newPosition) newTurn.push(t[0]);
    else newTurn.splice(newPosition, 0, t[0]);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < newTurn.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await db.query(
        `UPDATE cards SET show_num = ${i + 1}, column_id = ${columnID}
         WHERE card_id = ${newTurn[i]};`,
      );
    }
    const newColNum = await db.query(
      `SELECT config.show_id FROM config WHERE column_id = ${columnID};`,
    );
    await db.query(
      `UPDATE config SET show_id = ${newColNum.rows[0].show_id + 1}
       WHERE column_id = ${columnID};`,
    );
  }
};

module.exports.deleteColumn = async id => {
  const turn = [];
  const getAllColumn = await this.getAllColumn();
  getAllColumn.forEach(row => {
    turn.push(row.column_id);
  });
  // --
  let getColNum = await db.query(
    `SELECT config.show_id FROM config WHERE type_of = 'column';`,
  );
  getColNum = getColNum.rows[0].show_id;
  // --
  await db.query(`DELETE FROM columns WHERE column_id = ${id};`);
  let index = turn.indexOf(id);
  turn.splice(index, 1);
  // --
  // eslint-disable-next-line no-plusplus
  for (; index < turn.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await db.query(
      `UPDATE columns SET show_num = '${index + 1}' WHERE column_id = ${
        turn[index]
      };`,
    );
  }
  // --
  await db.query(
    `UPDATE config SET show_id = '${getColNum - 1}' WHERE type_of = 'column';`,
  );
};

module.exports.deleteCard = async id => {
  // get card by id
  const card = await db.query(`SELECT * FROM cards WHERE card_id = ${id};`);
  // get all card in that column
  const cards = await db.query(
    `SELECT * FROM cards WHERE column_id = ${card.rows[0].column_id}
     ORDER BY show_num;`,
  );
  // --
  let getColNum = await db.query(
    `SELECT config.show_id FROM config WHERE column_id = ${card.rows[0].column_id};`,
  );
  getColNum = getColNum.rows[0].show_id;
  // --
  await db.query(`DELETE FROM cards WHERE card_id = ${id};`);
  const turn = [];
  cards.rows.forEach(element => {
    turn.push(element.card_id);
  });
  let index = turn.indexOf(id);
  turn.splice(index, 1);

  // eslint-disable-next-line no-plusplus
  for (; index < turn.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await db.query(
      `UPDATE cards SET show_num = '${index + 1}' WHERE card_id = ${
        turn[index]
      };`,
    );
  }
  // --
  await db.query(
    `UPDATE config SET show_id = '${getColNum - 1}'
     WHERE column_id = ${card.rows[0].column_id};`,
  );

  // await db.query(`DELETE FROM cards WHERE card_id = ${id};`);
};
