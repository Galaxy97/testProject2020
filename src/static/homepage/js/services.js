function showColomn(colomns) {
  // eslint-disable-next-line no-undef
  const listsDiv = document.getElementsByClassName('lists')[0];
  if (!colomns) {
    // eslint-disable-next-line no-undef
    const colomn = document.createElement('div');
    listsDiv.append(colomn);
    colomn.className = 'list';
  }
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
      createColomnDiv.remove();
      showColomn();
      createColomn();
    };
    // eslint-disable-next-line no-undef
    const cancel = document.createElement('button');
    cancel.innerText = 'x';
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
