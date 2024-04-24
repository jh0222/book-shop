const express = require('express')
const router = express.Router()
const {
  allBooks,
  bookDetail
} = require('../controller/BookController')

router.use(express.json())
module.exports = router

router.get('/', allBooks)
router.get('/:id', bookDetail)