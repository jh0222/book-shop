// 서지현
const express = require('express')
const router = express.Router()
const {
  addLike,
  removeLike
} = require('../controller/LikeController')

router.use(express.json())
module.exports = router

router
  .route('/:id')
  .post(addLike)
  .delete(removeLike)
