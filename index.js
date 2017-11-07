'use strict'

function middleware (opts = {}) {
  const {jsonp = true} = opts

  return function (req, res, next) {
    const method = jsonp ? 'jsonp' : 'json'

    function genericResponse ({status, defaultStatusCode}) {
      return function ({statusCode = defaultStatusCode, data, message}) {
        return res.status(statusCode)[method]({
          status,
          data,
          message
        })
      }
    }

    res.success = genericResponse({status: 'success', defaultStatusCode: 200})
    res.fail = genericResponse({status: 'fail', defaultStatusCode: 400})
    res.error = genericResponse({status: 'error', defaultStatusCode: 500})

    next()
  }
}

module.exports = middleware
