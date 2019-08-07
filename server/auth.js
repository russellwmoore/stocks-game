const router = require('express').Router();
const { User, Session } = require('./db');

module.exports = router;

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      console.log('No such user found:', email);
      const error = new Error('Incorrect Email or Password');
      return next(error);
    }
    if (!user.correctPassword(password)) {
      console.log('Incorrect password for user:', email);
      const error = new Error('Incorrect Email or Password');
      return next(error);
    }
    // Sessions are for logged in users only
    const [session, wasCreated] = await Session.findOrCreate({
      where: {
        sessionId: req.cookies.SID,
      },
    });

    await session.setUser(user.id);

    return res.send(user);
  } catch (error) {
    next(error);
  }

  // if there is a match, then link this session ID with the logged in user

  // need to make a middleware to add req.user with the user id for every request to an authorized route
});

router.get('/me', (req, res, next) => {
  res.json(req.user);
});

router.post('/signup', async (req, res, next) => {
  // find user by email, if the email exists, throw error
  try {
    const { name, password, email } = req.body;
    console.log(req.body);
    if (!name) {
      const error = new Error('Please input a name');
      return next(error);
    }
    const user = await User.findOne({ where: { email } });
    if (user) {
      const error = new Error('Email address already exists!');
      error.messageStatus = 'Email already exists';
      return next(error);
    } else {
      const newUser = await User.create({
        name,
        email,
        password,
      });

      const session = await Session.create({
        sessionId: req.cookies.SID,
      });

      await session.setUser(newUser.id);

      return res.status(200).json(newUser);
    }
  } catch (e) {
    console.error('auth route error', e);
    next(e);
  }
});

router.post('/logout', (req, res, next) => {
  Session.destroy({ where: { sessionId: req.cookies.SID } })
    .then(num => res.json(num))
    .catch(next);
});
