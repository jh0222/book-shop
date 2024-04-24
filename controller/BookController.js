const ensureAthorization = require('../auth')
const jwt = require('jsonwebtoken')
const conn = require('../mariadb')
const { StatusCodes } = require('http-status-codes')

const allBooks = (req, res) => {
  let allBooksRes = {}
  let { category_id, new_book, limit, currentPage } = req.query
  new_book = parseInt(new_book)
  let offset = limit * (currentPage - 1)

  let sql = 'SELECT sql_calc_found_rows *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books'
  let values = []

  if(category_id && new_book) {
    sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()'
    values.push(category_id)
  } else if(category_id) {
    sql += ' WHERE category_id = ?'
    values.push(category_id)
  } else if(new_book) {
    sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()'
  }

  sql += ' LIMIT ? OFFSET ?'
  values.push(parseInt(limit), offset)

  conn.query(sql, values, (err, results) => {
    if(err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    if(results[0]) {
      results.map(function(results) {
        results.pubDate = result.pub_date
        delete result.pub_date
      })
      allBooksRes.books = results
    } else {
      return res.status(StatusCodes.NOT_FOUND).end()
    }
  })

  sql = 'select found_rows()'
  values.push(parseInt(limit), offset)

  conn.query(sql, (err, results) => {
    if(err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

    let totalCount = results[0]["found_rows()"]
    let pagination = {}
    pagination.currentPage = parseInt(currentPage)
    pagination.totalCount = totalCount
    allBooksRes.pagination = pagination
    return res.status(StatusCodes.OK).json(allBooksRes)
  })
}

const bookDetail = (req, res) => {
  let authorization = ensureAthorization(req, res)

  if(authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요"
    })
  } else if(authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "message": "잘못된 토큰입니다"
    })
  } else if(authorization instanceof ReferenceError) { 
    let book_id = req.params.id
    
    const sql = `SELECT *, 
                  (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes
                FROM books 
                LEFT JOIN category ON books.category_id = category.category_id 
                WHERE books.id = ?`
    conn.query(sql, book_id, (err, results) => {
      if(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end()
      }

      if(results[0]) {
        return res.status(StatusCodes.OK).json(results[0])
      } else {
        return res.status(StatusCodes.NOT_FOUND).end()
      }
    })
  } else {
    let book_id = req.params.id
    
    const sql = `SELECT *, 
                  (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes, 
                  EXISTS (SELECT * FROM likes WHERE likes.user_id = ? AND likes.liked_book_id = ?) AS liked 
                FROM books 
                LEFT JOIN category ON books.category_id = category.category_id 
                WHERE books.id = ?`
    let values = [authorization.id, book_id, book_id]
    conn.query(sql, values, (err, results) => {
      if(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end()
      }

      if(results[0]) {
        return res.status(StatusCodes.OK).json(results[0])
      } else {
        return res.status(StatusCodes.NOT_FOUND).end()
      }
    })
  }
}

module.exports = {
  allBooks,
  bookDetail
}