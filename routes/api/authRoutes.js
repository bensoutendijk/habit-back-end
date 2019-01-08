const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, async (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(!user.passwordConfirmation) {
    return res.status(422).json({
      errors: {
        passwordConfirmation: 'is required',
      },
    });
  }

  if (user.password !== user.passwordConfirmation) {
    return res.status(442).json({
      errors: {
        passwordConfirmation: 'does not match',
      },
    });
  }

  const existingUser = await User.findOne({ email: user.email });

  if (!existingUser) {
  
    const finalUser = new User(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }));
  }
  return res.status(442).json({
    errors: {
      email: 'already exists',
    },
  });
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(400).json({
      errors: {
        authentication: 'failure',
      },
    });
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return User.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;