const router = require('express').Router();
const { User, Session } = require('./db');

module.exports = router;

router.post('/login', async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  });

  if (!user) {
    return res.status(304).send('Incorrect Email or Password');
  }

  const [session, wasCreated] = await Session.findOrCreate({
    where: {
      sessionId: req.cookies.SID,
    },
  });

  session.setUser(user.id);

  res.send('logged in!');
  // if there is a match, then link this session ID with the logged in user

  // need to make a middleware to add req.user with the user id for every request to an authorized route
});
