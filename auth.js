const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const ensureAthorization = function (req, res) {
  try {
    let receivedJwt = req.headers["authorization"]
    console.log(receivedJwt);

    if (receivedJwt) {
      let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY)
      console.log(decodedJwt);

      return decodedJwt
    } else {
      throw new ReferenceError("jwt must be provided")
    }
  } catch (error) {
    console.log(error.name);
    console.log(error.message);

    return error
  }
}

module.exports = ensureAthorization