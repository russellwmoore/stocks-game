const router = require('express').Router();
const { User, Session } = require('./db');

module.exports = router;

router.post('/login', async (req, res, next) => {
  //TODO: Password hash and check. split this function up into two pieces. email check, then password check
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      console.log('No such user found:', req.body.email);
      return res.status(401).send('Incorrect Email or Password');
    }
    if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email);
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
  const { firstName, lastName, password, email } = req.body;
  console.log(req.body);
  const user = await User.findOne({ where: { email } });
  if (user) {
    res.json('already a user by that name');
  } else {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    }).catch(next);

    // TODO: also need to set up their transaction history here
    res.json(newUser);
  }
});

router.post('/logout', (req, res, next) => {
  Session.destroy({ where: { sessionId: req.cookies.SID } })
    .then(num => res.json(num))
    .catch(next);
});
