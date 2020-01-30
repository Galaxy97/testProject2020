async function run() {
  try {
    // get all column and cards
    const response = await Promise.all([
      // eslint-disable-next-line no-undef
      axios.get('/api/columns'),
      // eslint-disable-next-line no-undef
      axios.get('/api/cards'),
    ]);
    const columns = response[0].data;
    if (columns.length === 0) {
      // eslint-disable-next-line no-undef
      Column.createNewPlace();
    } else {
      columns.forEach(column => {
        // eslint-disable-next-line no-undef
        Column.showColumn(column);
      });
      // eslint-disable-next-line no-undef
      Column.createNewPlace();
      // show columns
    }

    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

run().catch(e => {
  console.log(e);
  // eslint-disable-next-line no-undef
  alert('sorry important problem');
});
