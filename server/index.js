const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const path = require('path');
const cookieparser = require('cookie-parser');
const uuidv4 = require('uuid/v4');
const { SID } = require('../constants');
const { Session, User } = require('./db');
const authCheck = require('./authCheck');

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.use((req, res, next) => {
  // assign cookies if not already assigned
  if (!req.cookies[SID]) {
    // new client
    res.cookie(SID, uuidv4());
  }
  next();
});

app.use((req, res, next) => {
  // if this cookie has a session, then add the user info to the req.user object. Don't include passwords!
  if (req.cookies[SID]) {
    Session.findOne({
      where: { sessionId: req.cookies[SID] },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
    }).then(session => {
      // if there is no session in the db with the sessionId of the current cookie, send the request on its way. This is an unauthenticated user
      if (!session) {
        next();
      } else {
        // client is authenticated, so populate req.user with their info
        req.user = session.user.get({ plain: true });
        next();
      }
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  // console.log('This is the req.user obj', req.user);
  next();
});

// TODO: Make api route protected with middleware

app.use('/auth', require('./auth'));
app.use('/api', authCheck, require('./api'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(chalk.bold.blue(`listening on port ${PORT}`));
});
