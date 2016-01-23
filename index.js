'use strict'

function middleware (options) {
  options = options || { jsonp: true }

  return function (req, res, next) {
    var jsonMethod = options.jsonp ? 'jsonp' : 'json'

    function genericResponse (type) {
      return function (status, message) {
        if (typeof arguments[0] !== 'number') {
          message = status
          status = 200
        }

        var response = { status: type }
        if (message) response.data = message
        return res.status(status)[jsonMethod](response)
      }
    }

    function errorResponse (status, message, code) {
      if (typeof arguments[0] !== 'number') {
        code = message
        message = status
        status = 500
      }

      var response = { status: 'error' }

      code = (message instanceof Object && !(message instanceof Array)) ? message : code

      if (typeof status === 'string' || status instanceof Error) {
        response.message = (status instanceof Error) ? status.message : status
      }

      if (typeof status === 'number' && (typeof message === 'string' || message instanceof Error)) {
        response.message = (message instanceof Error) ? message.message : message
      }

      if (code instanceof Object && !(code instanceof Array)) {
        if (!code.code && status instanceof Error) {
          response.code = status.name
        }
        if (!code.code && message instanceof Error) {
          response.code = message.name
        }
        if (code.code) {
          response.code = code.code
        }
        if (code.data) {
          response.data = code.data
        }
      }

      return res.status(status)[jsonMethod](response)
    }

    // res.success()
    // res.success(200)
    // res.success('hello world')
    // res.success(200, 'hello world')
    res.success = genericResponse('success')

    // res.fail()
    // res.fail(200)
    // res.fail('hello world')
    // res.fail(200, 'hello world')
    res.fail = genericResponse('fail')

    // res.error('Unauthorized')
    // res.error(new Error('Something is wrong!'))
    // res.error(401, 'Unauthorized')
    // res.error(401, new Error('Unauthorized'))
    // res.error(403, 'Forbidden', { code:402, data:'rejected' })
    // res.error('Forbidden', { code:402, data:'rejected' })
    res.error = errorResponse

    next()
  }
}

module.exports = middleware
