/* eslint-disable func-names */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const listItems = document.querySelectorAll('.list-item');
const lists = document.querySelectorAll('.list');

let draggedItem = null;

for (let i = 0; i < listItems.length; i++) {
  const item = listItems[i];

  item.addEventListener('dragstart', () => {
    draggedItem = item;
    setTimeout(() => {
      item.style.display = 'none';
    }, 0);
  });

  item.addEventListener('dragend', () => {
    setTimeout(() => {
      draggedItem.style.display = 'block';
      draggedItem = null;
    }, 0);
  });

  for (let j = 0; j < lists.length; j++) {
    const list = lists[j];

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
      this.append(draggedItem);
      this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });
  }
}
