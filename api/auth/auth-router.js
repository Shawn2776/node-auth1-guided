const router = require('express').Router();
const bcrypt = require('bcryptjs')
const { add, findBy } = require('../users/users-model')


const validatePayload = (req, res, next) => {next()}

router.post('/register', validatePayload, async (req, res, next) => {
  try {
    const { username, password} = req.body
    const hash = bcrypt.hashSync(password, 8) // 2 ^ 8
    const user = { username, password: hash}
    const createdUser = await add(user)
    
    res.status(201).json(createdUser)
  } catch (err) {
    next(err)
  }
});

router.post('/login', validatePayload, async (req, res, next) => {
  try {
    const { username, password } = req.body
    // does username correspond to an existing user?
    const [ user ] = await findBy({ username })

    // if existing has length, great, otherwise, no go
    if(user && bcrypt.compareSync(password, user.password)) {
      // determined username and pw are legit
      // start a session with this user
      req.session.user = user;
      // a cookie will be set on the response
      // the session will be stored
      res.json({ message: `welcome, ${username}, have a cookie`});
    } else {
      next({ status: 401, message: 'bad credentials'})
    }
  } catch (err) {
    next(err);
  }
});

router.get('/logout', async (req, res, next) => {
  if (req.session.user) {
    // destroy the session
    req.session.destroy(err => {
      if (err) {
        res.json({ message: 'sorry, you cannot leave'})
      } else {
        res.json({ message: `Goodbye`})
      }
    })
  } else {
    res.json({ message: 'No current sessions'})
  }
});

module.exports = router