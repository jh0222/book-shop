// 서지현
const express = require('express')
const router = express.Router()
const {
  getOrders,
  order,
  getOrderDetail
} = require('../controller/OrderController')

router.use(express.json())
module.exports = router

router
  .route('/')
  .get(getOrders)
  .post(order)

  router.get('/:id', getOrderDetail)

