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
      return res.status(401).send('Incorrect Email or Password');
    }
    if (!user.correctPassword(password)) {
      console.log('Incorrect password for user:', email);
      return res.status(401).send('Incorrect Email or Password');
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
    const user = await User.findOne({ where: { email } });
    if (user) {
      const error = new Error('already a user by that email address');
      error.messageStatus = 'Email already exists';
      next(error);
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

      res.json(newUser);
    }
  } catch (e) {
    next(e);
  }
});

router.post('/logout', (req, res, next) => {
  Session.destroy({ where: { sessionId: req.cookies.SID } })
    .then(num => res.json(num))
    .catch(next);
});
