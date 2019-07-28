const router = require('express').Router();
const { User, Session } = require('./db');

module.exports = router;

router.post('/login', async (req, res, next) => {
  //TODO: Password hash and check. split this function up into two pieces. email check, then password check
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
    });
    if (!user) {
      return res.status(304).send('Incorrect Email or Password');
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

router.post('/logout/:id', (req, res, next) => {
  Session.findOne({ where: { sessionId: req.params.id } })
    .then(session => {
      session.userId = null;
      session.save().then(session => res.json(session));
    })
    .catch(next);
});
