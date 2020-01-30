/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
const Card = {
  idCounter: 8,
  dragged: null,

  createPlaceForCard(column) {
    // eslint-disable-next-line no-undef
    const place = document.createElement('div');
    column.append(place);
    // eslint-disable-next-line no-undef
    const addButton = document.createElement('button');
    place.append(addButton);
    addButton.innerText = 'add new card';
    addButton.onclick = () => {
      addButton.remove();
      // ----------------------------------------------- create textarea
      // eslint-disable-next-line no-undef
      const title = document.createElement('textarea');
      place.append(title);
      title.placeholder = 'input some title';
      // ----------------------------------------------- create textarea
      // eslint-disable-next-line no-undef
      const text = document.createElement('textarea');
      place.append(text);
      text.placeholder = 'input some text';
      text.className = 'textPlace';
      // ----------------------------------------------- create save button
      // eslint-disable-next-line no-undef
      const save = document.createElement('button');
      place.append(save);
      save.innerText = 'Save it';
      save.onclick = () => {
        place.innerHTML = '';
        title.value = title.value || title.placeholder;
        text.value = text.value || text.placeholder;
        // eslint-disable-next-line no-undef
        axios
          .post('/api/card', {
            colomnID: column.id.slice(4),
            title: title.value,
            description: place.value,
          })
          .then(res => {
            place.append(
              this.createCard({
                card_id: res.data.card_id,
                card_title: title.value,
                card_description: text.value,
                created_at: res.data.created_at,
              }),
            );
            this.createPlaceForCard(column);
          })
          .catch(e => {
            console.error(e);
          });
      };
      // ----------------------------------------------- create cancel button
      // eslint-disable-next-line no-undef
      const cancel = document.createElement('button');
      place.append(cancel);
      cancel.innerText = 'cancel';
      cancel.onclick = () => {
        place.remove();
        this.createPlaceForCard(column);
      };
    };
    // Card.process(noteElement);
  },
  createCard(cardInfo) {
    // eslint-disable-next-line no-undef
    const card = document.createElement('div');
    card.className = 'list-item';
    card.draggable = 'true';
    card.id = `card-${cardInfo.card_id}`;
    // ----------------------------------- TITLE
    // eslint-disable-next-line no-undef
    const titleDiv = document.createElement('div');
    card.append(titleDiv);
    titleDiv.innerText = cardInfo.card_title;
    // ----------------------------------- DESCRIPTION
    // eslint-disable-next-line no-undef
    const descriptionDiv = document.createElement('div');
    card.append(descriptionDiv);
    descriptionDiv.innerText = cardInfo.card_description;
    // ----------------------------------- CREATE_AT
    // eslint-disable-next-line no-undef
    const date = document.createElement('div');
    card.append(date);
    date.innerText = new Date(cardInfo.created_at)
      .toLocaleString()
      .slice(0, 10);
    // eslint-disable-next-line no-use-before-define
    Card.controlDiv(card);
    // eslint-disable-next-line no-undef
    Card.process(card);
    return card;
  },
  process(noteElement) {
    noteElement.addEventListener('dragstart', Card.dragstart);
    noteElement.addEventListener('dragend', Card.dragend);
    noteElement.addEventListener('drop', Card.drop);
  },

  dragstart(event) {
    Card.dragged = this;
    event.stopPropagation();
  },

  dragend() {
    Card.dragged = null;
  },

  async drop(event) {
    // debugger;
    if (Card.dragged === null) {
      return;
    }
    if (this === Card.dragged) {
      return;
    }
    event.stopPropagation();
    // debugger;
    const insertElem = Card.dragged;
    if (this.parentElement === Card.dragged.parentElement) {
      const note = Array.from(this.parentElement.childNodes);
      const indexA = note.indexOf(this);
      const indexB = note.indexOf(Card.dragged);

      const res = await Card.send(
        Card.dragged.id.slice(5),
        this.closest('.list').id.slice(4),
        indexA,
      );
      if (res) {
        // debugger;
        if (indexA < indexB) {
          this.parentElement.insertBefore(insertElem, this);
        } else {
          this.parentElement.insertBefore(insertElem, this.nextElementSibling);
        }
      }
    } else {
      const res = await Card.send(
        Card.dragged.id.slice(5),
        this.closest('.list').id.slice(4),
      );
      // debugger;
      if (res) this.parentElement.insertBefore(insertElem, this);
    }
  },
  async send(cardID, columnID, newPosition) {
    try {
      // eslint-disable-next-line no-undef
      await axios.put('/api/card', {
        cardID: Number(cardID),
        columnID: Number(columnID),
        newPosition: Number(newPosition),
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  controlDiv(element) {
    // eslint-disable-next-line no-undef
    const div = document.createElement('div');
    element.append(div);
    // eslint-disable-next-line no-undef
    const edit = document.createElement('button');
    div.append(edit);
    edit.innerText = 'edit';
    edit.onclick = () => {
      // -------------------------------------------------------- CARD EDIT
      const originalEDIT = Object.assign(div.childNodes[0]);
      const originalCanc = Object.assign(div.childNodes[1]);
      div.innerHTML = '';
      const oldTitle = element.childNodes[0].innerText;
      const oldDesc = element.childNodes[1].innerText;
      const oldDate = element.childNodes[2].innerText;
      const date = oldDate.split('.');
      const dateVal = `${date[2]}-${date[1]}-${date[0]}`;
      // -----------------------------------TITLE
      element.childNodes[0].innerHTML = '';
      // eslint-disable-next-line no-undef
      const title = document.createElement('textarea');
      title.value = oldTitle;
      element.childNodes[0].append(title);
      // ----------------------------------END TITLE
      // ----------------------------------DESCRIPTION
      element.childNodes[1].innerHTML = '';
      // eslint-disable-next-line no-undef
      const desc = document.createElement('textarea');
      desc.value = oldDesc;
      element.childNodes[1].append(desc);
      // ----------------------------------END DESCRIPTION
      // ----------------------------------DATE
      // debugger
      element.childNodes[2].innerHTML = '';
      // eslint-disable-next-line no-undef
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = dateVal;
      element.childNodes[2].append(dateInput);
      // ----------------------------------END DATE
      // -------------------------------------- control buttonS
      // ----------------------------------------------- create save button
      // eslint-disable-next-line no-undef
      const save = document.createElement('button');
      div.append(save);
      save.innerText = 'save it';
      save.onclick = () => {
        // eslint-disable-next-line no-undef
        axios
          .patch('/api/card', {
            id: element.id.slice(5),
            newTitle: title.value,
            newDesc: desc.value,
            newDate: new Date(dateInput.value).getTime(),
          })
          .then(() => {
            // eslint-disable-next-line no-param-reassign
            element.childNodes[0].innerText = title.value;
            element.childNodes[1].innerText = desc.value;
            element.childNodes[2].innerText = dateInput.value;
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
        element.childNodes[0].innerText = oldTitle;
        element.childNodes[1].innerText = oldDesc;
        element.childNodes[2].innerText = oldDate;
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
  },
};
