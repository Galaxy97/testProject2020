function createCard(text) {
  // eslint-disable-next-line no-undef
  const card = document.createElement('div');
  card.className = 'list-item';
  card.draggable = 'true';
  // eslint-disable-next-line no-undef
  const textDiv = document.createElement('div');
  card.append(textDiv);
  textDiv.innerText = text;
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
      card.append(createCard(place.value)); // return div with card
      // eslint-disable-next-line no-undef
      cardLogic();
      createNewCard(colomn);
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

function showNewColomn(title) {
  // eslint-disable-next-line no-undef
  const listsDiv = document.getElementsByClassName('lists')[0];
  // eslint-disable-next-line no-undef
  const colomn = document.createElement('div');
  listsDiv.append(colomn);
  colomn.className = 'list';
  // eslint-disable-next-line no-undef
  const colomnTitle = document.createElement('h3');
  colomn.append(colomnTitle);
  colomnTitle.innerText = title;
  createNewCard(colomn); // return div
  // eslint-disable-next-line no-undef
  cardLogic();
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
      showNewColomn(input.value);
      createColomn();
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
/* eslint-disable no-debugger */
async function beforeLoadPage() {
  try {
    // eslint-disable-next-line no-undef
    const {data} = await axios.get('/api/columns'); // get json with colomns and cards in colomn
    if (Object.keys(data).length === 0) {
      // if have not any colomns and cards
      createColomn();
    } else {
      // show colomns and cards
      // showColomn();
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
