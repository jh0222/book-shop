const ensureAthorization = require('../auth')
const jwt = require('jsonwebtoken')
const conn = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const addLike = (req, res) => {
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
    const liked_book_id = req.params.id

    const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)'
    const values = [authorization.id, liked_book_id]

    conn.query(sql, values, (err, results) => {
      if(err) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).end()
      }
      return res.status(StatusCodes.CREATED).json(results)
    })
  } 
}

const removeLike = (req, res) => {
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
    const liked_book_id = req.params.id

    const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?'
    const values = [authorization.id, liked_book_id]

    conn.query(sql, values, (err, results) => {
      if(err) {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).end()
      }
      return res.status(StatusCodes.OK).json(results)
    })
  } 
}

module.exports = {
  addLike,
  removeLike
}