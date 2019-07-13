const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/api', require('./api'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(chalk.bold.blue(`listening on port ${PORT}`));
});
