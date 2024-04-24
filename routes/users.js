const express = require('express')
const router = express.Router()
const {
  join,
  login,
  PasswordResetrequest,
  passwordReset
} = require('../controller/UserController')

router.use(express.json())
module.exports = router

router.post('/join', join)
router.post('/login', login)
router
  .route('/reset')
  .post(PasswordResetrequest)
  .put(passwordReset)