const ensureAthorization = require('../auth')
const conn = require('../mariadb')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const addToCart = (req, res) => {
  let authorization = ensureAthorization(req, res)

  if(authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요"
    })
  } else if(authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message": "잘못된 토큰입니다"
    })
  } else {
    const { book_id, quantity } = req.body
  
    const sql = 'INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)'
    const values = [book_id, quantity, authorization.id]
  
    conn.query(sql, values, (err, results) => {
      if(err) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).end()
      }
      return res.status(StatusCodes.CREATED).json(results)
    })
  }
}
  
const getCartItems = (req, res) => {
  let authorization = ensureAthorization(req, res)

  if(authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요"
    })
  } else if(authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message": "잘못된 토큰입니다"
    })
  } else {
    const { selected } = req.body

    // 전제 장바구니 조회
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems 
                LEFT JOIN books ON cartItems.book_id = books.id
                WHERE user_id = ?`
    let values = [ authorization.id ]

    // 선택한 장바구니 조회
    if (selected) {
      sql += ' AND cartItems.id IN (?)'
      values.push(selected)
    }

    conn.query(sql, values, (err, results) => {
      if(err) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).end()
      }
      if(results[0]){
        return res.status(StatusCodes.OK).json(results)
      } else {
        return res.status(StatusCodes.BAD_REQUEST).end()
      } 
    })
  }
}

const removeCartItems = (req, res) => {
  let authorization = ensureAthorization(req, res)

  if(authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요"
    })
  } else if(authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message": "잘못된 토큰입니다"
    })
  } else {
    const { id } = req.params
    const sql = 'DELETE FROM cartItems WHERE id = ?'

    conn.query(sql, id, (err, results) => {
      if(err) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).end()
      }
      return res.status(StatusCodes.OK).json(results)
    })
  }
}

module.exports = {
  addToCart,
  getCartItems,
  removeCartItems
}