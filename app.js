// express 모듈
const express = require('express')
const app = express()

// dotenv 모듈
const dotenv = require('dotenv')
dotenv.config()

// 유의미한 포트 번호 지정
app.listen(process.env.PORT)

const userRouter = require('./routes/users')
const booksRouter = require('./routes/books')
const categoryRouter = require('./routes/category')
const likesRouter = require('./routes/likes')
const cartsRouter = require('./routes/carts')
const ordersRouter = require('./routes/orders')

app.use("/users", userRouter)
app.use("/books", booksRouter)
app.use("/category", categoryRouter)
app.use("/likes", likesRouter)
app.use("/carts", cartsRouter)
app.use("/orders", ordersRouter)