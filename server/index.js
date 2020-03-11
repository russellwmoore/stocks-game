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
const PORT = process.env.PORT || 3000;

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

app.use(async (req, res, next) => {
  // if this cookie has a session, then add the user info to the req.user object. Don't include passwords!
  if (req.cookies[SID]) {
    try {
      const session = await Session.findOne({
        where: { sessionId: req.cookies[SID] },
        include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      });
      if (!session) {
        next();
      } else {
        // client is authenticated, so populate req.user with their info
        req.user = session.user.get({ plain: true });
        next();
      }
    } catch (e) {
      console.log('error finding the session', e);
      next(e);
    }
  } else {
    next();
  }
  // if there is no session in the db with the sessionId of the current cookie, send the request on its way. This is an unauthenticated user
});

app.use((req, res, next) => {
  console.log('This is the req.user obj', req.user);
  next();
});

// TODO: Make api route protected with middleware

app.use('/auth', require('./auth'));
app.use('/api', authCheck, require('./api'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(function(err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).json(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

const http = app.listen(PORT, () => {
  console.log(chalk.bold.blue(`listening on port ${PORT}`));
});

const io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('byyyyyeeee', socket.id);
  });
});
