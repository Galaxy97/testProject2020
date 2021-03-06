/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
const Column = {
  idCounter: 4,
  dragged: null,
  columnTurn: [],
  createNewPlace() {
    // eslint-disable-next-line no-undef
    const createColomnDiv = document.createElement('div');
    // eslint-disable-next-line no-undef
    const listsDiv = document.getElementsByClassName('lists')[0];
    listsDiv.append(createColomnDiv);
    createColomnDiv.className = 'newColomn';
    // eslint-disable-next-line no-undef
    const createColomnButton = document.createElement('button');
    createColomnDiv.append(createColomnButton);
    createColomnButton.innerText = '+ Add new column';
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
            this.createNewColumn({title: input.value, id: res.data.id});
            this.createNewPlace();
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
        this.createNewPlace();
      };
      createColomnDiv.append(input, addColomn, cancel);
    };
  },
  createNewColumn(col) {
    this.columnTurn.push(col.id);
    // eslint-disable-next-line no-undef
    const listsDiv = document.getElementsByClassName('lists')[0];
    // eslint-disable-next-line no-undef
    const column = document.createElement('div');
    listsDiv.append(column);
    column.className = 'list';
    column.id = `col-${col.id}`;
    // eslint-disable-next-line no-undef
    const columnTitle = document.createElement('h3');
    column.append(columnTitle);
    // eslint-disable-next-line no-use-before-define
    columnTitle.innerText = col.title;
    // drag tegs
    column.setAttribute('draggable', true);
    // eslint-disable-next-line no-undef
    const divForCards = document.createElement('div');
    divForCards.className = 'forCards';
    this.editColumn(column);
    this.process(column);
    column.append(divForCards);
    // eslint-disable-next-line no-undef
    Card.createPlaceForCard(column);
  },
  showColumn(col, cards) {
    // eslint-disable-next-line no-undef
    const listsDiv = document.getElementsByClassName('lists')[0];
    // eslint-disable-next-line no-undef
    const column = document.createElement('div');
    listsDiv.append(column);
    column.className = 'list';
    column.id = `col-${col.column_id}`;
    // eslint-disable-next-line no-undef
    const columnTitle = document.createElement('h3');
    column.append(columnTitle);
    columnTitle.innerText = col.own_name;
    // drag tegs
    column.setAttribute('draggable', true);
    // eslint-disable-next-line no-undef
    const divForCards = document.createElement('div');
    divForCards.className = 'forCards';
    this.editColumn(column);
    this.process(column);
    // --------------------
    column.append(divForCards);
    //
    if (cards) {
      cards.forEach(card => {
        // eslint-disable-next-line no-undef
        const divCard = Card.createCard(card);
        // eslint-disable-next-line no-undef
        divForCards.append(divCard);
      });
    }
    //
    // append div create new card
    // eslint-disable-next-line no-undef
    Card.createPlaceForCard(column);
  },
  editColumn(element) {
    // eslint-disable-next-line no-undef
    const div = document.createElement('div');
    element.append(div);
    // eslint-disable-next-line no-undef
    const edit = document.createElement('button');
    div.append(edit);
    edit.innerText = 'edit';
    edit.onclick = () => {
      // for column --------------------------------------------- COLUMN EDIT
      const originalEDIT = Object.assign(div.childNodes[0]);
      const originalCanc = Object.assign(div.childNodes[1]);
      div.innerHTML = '';
      const oldTitle = element.childNodes[0].innerText;
      // eslint-disable-next-line no-param-reassign
      element.childNodes[0].innerHTML = '';
      // eslint-disable-next-line no-undef
      const input = document.createElement('input');
      input.type = 'text';
      input.value = oldTitle;
      element.childNodes[0].append(input);
      // ----------------------------------------------- create save button
      // eslint-disable-next-line no-undef
      const save = document.createElement('button');
      div.append(save);
      save.innerText = 'save it';
      save.onclick = () => {
        // eslint-disable-next-line no-undef
        axios
          .patch('/api/column', {
            id: element.id.slice(4),
            newTitle: input.value,
          })
          .then(() => {
            // eslint-disable-next-line no-param-reassign
            element.childNodes[0].innerHTML = input.value;
            div.innerHTML = '';
            div.append(originalEDIT);
            div.append(originalCanc);
          })
          .catch(e => {
            console.error(e);
          });
      };
      // ----------------------------------------------- create cancel button
      // eslint-disable-next-line no-undef
      const cancel = document.createElement('button');
      div.append(cancel);
      cancel.innerText = 'cancel';
      cancel.onclick = () => {
        // eslint-disable-next-line no-param-reassign
        element.childNodes[0].innerHTML = oldTitle;
        div.innerHTML = '';
        div.append(originalEDIT);
        div.append(originalCanc);
      };
    };
    // eslint-disable-next-line no-undef
    const del = document.createElement('button');
    div.append(del);
    del.innerText = 'delete';
    del.onclick = () => {
      // eslint-disable-next-line no-undef
      if (confirm('Do you want delete this?')) {
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
    };
  },
  process(columnElement) {
    columnElement.addEventListener('dragstart', this.dragstart);
    columnElement.addEventListener('dragend', this.dragend);

    columnElement.addEventListener('dragover', this.dragover);

    columnElement.addEventListener('drop', this.drop);
  },
  dragstart(event) {
    Column.dragged = this;
    event.stopPropagation();
  },
  dragend() {
    Column.dragged = null;
    Column.dropped = null;
  },
  dragover(event) {
    event.preventDefault();
    event.stopPropagation();

    if (Column.dragged === this) {
      Column.dropped = null;
    }

    if (!Column.dragged || Column.dragged === this) {
      return;
    }

    Column.dropped = this;
  },
  // eslint-disable-next-line consistent-return
  async drop() {
    // eslint-disable-next-line no-undef
    if (Card.dragged) {
      // eslint-disable-next-line no-undef
      const insertElement = Card.dragged;
      // eslint-disable-next-line no-undef
      const res = await Card.send(Card.dragged.id.slice(5), this.id.slice(4));
      if (res) {
        // eslint-disable-next-line no-undef
        return this.querySelector('.forCards').append(insertElement);
      }
    }
    if (Column.dragged) {
      // eslint-disable-next-line no-undef
      const children = Array.from(document.querySelector('.lists').children);
      const indexA = children.indexOf(this);
      const indexB = children.indexOf(Column.dragged);
      const draggedObj = Column.dragged; // Event loop)))
      // eslint-disable-next-line no-undef
      axios
        .put('/api/column', {
          columnID: Column.dragged.id.slice(4),
          newPlace: indexA,
        })
        .then(() => {
          if (indexA < indexB) {
            // eslint-disable-next-line no-undef
            document.querySelector('.lists').insertBefore(draggedObj, this);
          } else {
            // eslint-disable-next-line no-undef
            document
              .querySelector('.lists')
              .insertBefore(draggedObj, this.nextElementSibling);
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  },
};
