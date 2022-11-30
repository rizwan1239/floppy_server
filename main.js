/* eslint-disable no-console */
const app = require('./server');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
