module.exports = function (options) {
  options = options || {}

  return function (req, res, next) {
    var method = (('jsonp' in options) && !options.jsonp) ? 'json' : 'jsonp'

    function send (status, obj) {
      return this.status(status)[method](obj)
    }

    // res.success({ })
    res.success = function (code, body) {
      var data = ({
        status: 'success',
        data: (arguments.length === 2) ? body : code
      })
      return send.apply(this, ((arguments.length === 2) ? [code, data] : [data]))
    }

    res.fail = function (code, body) {
      var data = ({
        status: 'fail',
        data: (arguments.length === 2) ? body : code
      })
      return send.apply(this, ((arguments.length === 2) ? [code, data] : [data]))
    }

    // res.error('Unauthorized')
    // res.error(new Error('Something is wrong!'))
    // res.error(401, 'Unauthorized')
    // res.error(401, new Error('Unauthorized'))
    // res.error(403, 'Forbidden', { code:402, data:'rejected' })
    // res.error('Forbidden', { code:402, data:'rejected' })
    res.error = function (status, message, obj) {
      obj = (message instanceof Object && !(message instanceof Array)) ? message : obj

      var response = { status: 'error', message: null }

      if (typeof status === 'string' || status instanceof Error) {
        response.message = (status instanceof Error) ? status.message : status
      }

      if (typeof status === 'number' && (typeof message === 'string' || message instanceof Error)) {
        response.message = (message instanceof Error) ? message.message : message
      }

      if (obj instanceof Object && !(obj instanceof Array)) {
        if (!('code' in obj) && status instanceof Error) {
          response.code = status.name
        }
        if (!('code' in obj) && message instanceof Error) {
          response.code = message.name
        }
        if (obj.code) {
          response.code = obj.code
        }
        if (obj.data) {
          response.data = obj.data
        }
      }

      return send.apply(this, (typeof status === 'number' ? [status, response] : [response]))
    }
    next()
  }
}
