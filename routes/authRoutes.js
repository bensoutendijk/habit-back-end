const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth',
    passport.authenticate('local')
  );

  app.get(
    '/auth/callback',
    passport.authenticate('local'),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};