/* eslint-disable no-console */
const Moralis = require('moralis/node');
const chalk = require('chalk');
const app = require('./server');
const dotenv = require('dotenv').config();
const serverUrl = process.env.TEST_SERVER_URL;
const appId = process.env.TEST_APP_ID;

const PORT = process.env.PORT || 3000;

Moralis.start({ serverUrl, appId });
app.listen(PORT, () => {
  console.log(chalk.yellow(`listening on port ${PORT}`));
});
