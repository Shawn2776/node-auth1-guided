const path = require('path');
const express = require('express');
const session = require('express-session');

const usersRouter = require('./users/users-router.js')
const authRouter = require('./auth/auth-router');
const server = express()

server.use(express.static(path.join(__dirname, '../client')));
server.use(express.json());
server.use(session({
  // lots of them / configuring the session
  name: 'monkey', // name of the sessionId
  secret: 'IUemHtfYk9HsJxZKmRFEeM8bpcHwpR1YOGwyWENDYIYBGLfYVCoELLAhc073HKR7R5Lpe3hdyZsBYW9ikkhDMKWmi4EgR4TtnP4M', // the sessin id is actually encrypted
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // in prod, should be true (only over https)
    httpOnly: false, // in prod, make true if possible (js cannot read the cookie)
  },
  rolling: true, // extend session when user reaches good session
  resave: false, // ignore for now
  saveUninitialized: false, // false, sessions not stored by default
}))

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
