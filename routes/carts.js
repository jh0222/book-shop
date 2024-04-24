const express = require('express')
const router = express.Router()
const {
  addToCart,
  getCartItems,
  removeCartItems
} = require('../controller/CartController')

router.use(express.json())
module.exports = router

router
  .route('/')
  .post(addToCart)
  .get(getCartItems)

router.delete('/:id', removeCartItems)