const authCheck = (req, res, next) => {
  if (req.user === undefined) {
    return res.status(301).send('unauthorized suckah');
  } else {
    next();
  }
};

module.exports = authCheck;
