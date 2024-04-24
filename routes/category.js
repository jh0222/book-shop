// 서지현
const express = require('express')
const router = express.Router()
const {
  allCategory
} = require('../controller/CategoryController')

router.use(express.json())
module.exports = router

router.get('/', allCategory)