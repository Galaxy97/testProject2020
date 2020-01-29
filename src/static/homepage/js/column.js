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
    this.process(column);
  },
  showColumn(col) {
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
    this.process(column);
  },
  process(columnElement) {
    columnElement.addEventListener('dragstart', this.dragstart);
    columnElement.addEventListener('dragend', this.dragend);

    columnElement.addEventListener('dragenter', this.dragenter);
    columnElement.addEventListener('dragover', this.dragover);
    columnElement.addEventListener('dragleave', this.dragleave);

    columnElement.addEventListener('drop', this.drop);
  },
  dragstart(event) {
    console.log('dragstart');
    Column.dragged = this;
    event.stopPropagation();
  },
  dragend() {
    console.log('dragend');
    Column.dragged = null;
  },
  dragenter() {
    // console.log('dragenter');
  },
  dragover(event) {
    event.preventDefault();
    event.stopPropagation();
    // console.log('dragover');
  },
  dragleave() {
    // console.log('dragleave');
  },
  drop() {
    console.log('drop');
    if (Column.dragged) {
      // eslint-disable-next-line no-undef
      const children = Array.from(document.querySelector('.lists').children);
      const indexA = children.indexOf(this);
      const indexB = children.indexOf(Column.dragged);
      const draggedObj = Column.dragged; // Event loop)))
      console.log(Column.dragged.id.slice(4), indexA);
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
