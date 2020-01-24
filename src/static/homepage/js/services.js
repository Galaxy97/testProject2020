/* eslint-disable no-restricted-globals */
function createDivCard(cardInfo) {
  // eslint-disable-next-line no-undef
  const card = document.createElement('div');
  card.className = 'list-item';
  card.draggable = 'true';
  card.id = `card-${cardInfo.card_id}`;
  // eslint-disable-next-line no-use-before-define
  controlDiv(card);
  // eslint-disable-next-line no-undef
  const textDiv = document.createElement('div');
  card.append(textDiv);
  textDiv.innerText = cardInfo.card_text;
  // eslint-disable-next-line no-undef
  cardLogic(card);
  return card;
}

function createNewCard(colomn) {
  // eslint-disable-next-line no-undef
  const card = document.createElement('div');
  colomn.append(card);
  // eslint-disable-next-line no-undef
  const addButton = document.createElement('button');
  card.append(addButton);
  addButton.innerText = 'add new card';
  addButton.onclick = () => {
    addButton.remove();
    // ----------------------------------------------- create textarea
    // eslint-disable-next-line no-undef
    const place = document.createElement('textarea');
    card.append(place);
    place.placeholder = 'input some text';
    place.className = 'textPlace';
    // ----------------------------------------------- create save button
    // eslint-disable-next-line no-undef
    const save = document.createElement('button');
    card.append(save);
    save.innerText = 'Save it';
    save.onclick = () => {
      card.innerHTML = '';
      place.value = place.value || place.placeholder;
      // eslint-disable-next-line no-undef
      axios
        .post('/api/card', {
          colomnID: colomn.id.slice(4),
          text: place.value,
        })
        .then(res => {
          console.log(res);
          card.append(createDivCard({card_text: place.value})); // return div with card
          createNewCard(colomn);
        })
        .catch(e => {
          console.error(e);
        });
    };
    // ----------------------------------------------- create cancel button
    // eslint-disable-next-line no-undef
    const cancel = document.createElement('button');
    card.append(cancel);
    cancel.innerText = 'cancel';
    cancel.onclick = () => {
      card.remove();
      createNewCard(colomn);
    };
  };
}

function showNewColomn(col) {
  // eslint-disable-next-line no-undef
  const listsDiv = document.getElementsByClassName('lists')[0];
  // eslint-disable-next-line no-undef
  const colomn = document.createElement('div');
  listsDiv.append(colomn);
  colomn.className = 'list';
  colomn.id = col.id;
  // eslint-disable-next-line no-undef
  columnLogic(colomn);
  // eslint-disable-next-line no-undef
  const colomnTitle = document.createElement('h3');
  colomn.append(colomnTitle);
  // eslint-disable-next-line no-use-before-define
  controlDiv(colomn);
  colomnTitle.innerText = col.title;
  createNewCard(colomn); // return div
}

function createColomn() {
  // eslint-disable-next-line no-undef
  const listsDiv = document.getElementsByClassName('lists')[0];

  // eslint-disable-next-line no-undef
  const createColomnDiv = document.createElement('div');
  listsDiv.append(createColomnDiv);
  createColomnDiv.className = 'newColomn';
  // eslint-disable-next-line no-undef
  const createColomnButton = document.createElement('button');
  createColomnDiv.append(createColomnButton);
  createColomnButton.innerText = '+ Add new colomn';
  createColomnButton.onclick = () => {
    createColomnButton.remove();
    // eslint-disable-next-line no-undef
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'super name';
    // eslint-disable-next-line no-undef
    const addColomn = document.createElement('button');
    addColomn.innerText = 'add colomn';
    addColomn.onclick = () => {
      // save on server new colomn with name title
      input.value = input.value || input.placeholder;
      createColomnDiv.remove();
      // eslint-disable-next-line no-undef
      axios
        .post('/api/column', {
          ownName: input.value,
        })
        .then(res => {
          showNewColomn({title: input.value, id: res.data.id});
          createColomn();
        })
        .catch(e => {
          console.error(e);
        });
    };
    // eslint-disable-next-line no-undef
    const cancel = document.createElement('button');
    cancel.innerText = 'cancel';
    cancel.onclick = () => {
      createColomnDiv.remove();
      createColomn();
    };
    createColomnDiv.append(input, addColomn, cancel);
  };
}

function controlDiv(element) {
  // eslint-disable-next-line no-undef
  const div = document.createElement('div');
  element.append(div);
  // eslint-disable-next-line no-undef
  const edit = document.createElement('button');
  div.append(edit);
  edit.innerText = 'edit';
  // eslint-disable-next-line no-undef
  const del = document.createElement('button');
  div.append(del);
  del.innerText = 'delete';
  del.onclick = () => {
    // eslint-disable-next-line no-undef
    if (confirm('Do you want delete this?')) {
      if (element.id.slice(0, 4) === 'card') {
        // eslint-disable-next-line no-undef
        axios
          .delete('/api/card', {
            headers: {
              card_id: element.id.slice(5),
            },
          })
          .then(() => {
            element.remove();
          })
          .catch(e => console.error(e));
      } else {
        // eslint-disable-next-line no-undef
        axios
          .delete('/api/column', {
            headers: {
              column_id: element.id.slice(4),
            },
          })
          .then(() => {
            element.remove();
          })
          .catch(e => console.error(e));
      }
    }
  };
}

function showColomn(columnInfo, cards) {
  // eslint-disable-next-line no-undef
  const listsDiv = document.getElementsByClassName('lists')[0];
  // eslint-disable-next-line no-undef
  const column = document.createElement('div');
  listsDiv.append(column);
  // columnMagic(column);
  column.className = 'list';
  // eslint-disable-next-line no-undef
  columnLogic(column);
  column.id = `col-${columnInfo.column_id}`;
  // eslint-disable-next-line no-undef
  const columnTitle = document.createElement('h3');
  column.append(columnTitle);
  columnTitle.innerText = columnInfo.own_name;
  controlDiv(column);
  if (cards) {
    cards.forEach(card => {
      const divCard = createDivCard(card);
      controlDiv(divCard);
      column.append(divCard);
    });
  }
  createNewCard(column);
}

async function beforeLoadPage() {
  try {
    const response = await Promise.all([
      // eslint-disable-next-line no-undef
      axios.get('/api/columns'),
      // eslint-disable-next-line no-undef
      axios.get('/api/cards'),
    ]);
    const columns = response[0].data;
    const cards = response[1].data;
    if (Object.keys(columns).length === 0) {
      // if have not any colomns and cards
      createColomn();
    } else {
      // show colomns and cards
      columns.forEach(column => {
        showColomn(column, cards[column.column_id]);
      });
      createColomn();
    }
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line no-undef
    alert('problem with connection to server');
  }
}

// eslint-disable-next-line no-undef
document.addEventListener('DOMContentLoaded', beforeLoadPage);
