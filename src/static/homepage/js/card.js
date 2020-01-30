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
    // controlDiv(card);
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
};
