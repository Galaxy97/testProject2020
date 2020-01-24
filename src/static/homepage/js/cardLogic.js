/* eslint-disable func-names */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
let draggedItem = null;
// eslint-disable-next-line no-unused-vars
function cardLogic(item) {
  item.addEventListener('dragstart', () => {
    draggedItem = item;
    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      item.style.display = 'none';
    }, 0);
  });

  item.addEventListener('dragend', () => {
    setTimeout(() => {
      draggedItem.style.display = 'block';
      draggedItem = null;
    }, 0);
  });
}

// eslint-disable-next-line no-unused-vars
function columnLogic(list) {
  list.addEventListener('dragover', e => {
    e.preventDefault();
  });

  list.addEventListener('dragenter', function(e) {
    e.preventDefault();
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  });

  list.addEventListener('dragleave', function() {
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  });

  list.addEventListener('drop', function() {
    console.log('drop');
    if (draggedItem) {
      // eslint-disable-next-line no-use-before-define
      send(draggedItem.id.slice(5), this.id.slice(4));

      const btn = Object.assign(this.lastElementChild);
      this.lastElementChild.remove();
      this.append(draggedItem);
      this.append(btn);
    }
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  });
}

function send(cardID, columnID) {
  axios
    .put('/api/card', {
      cardID,
      columnID,
    })
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.error(e);
    });
}
