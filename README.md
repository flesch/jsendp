# jsendp

**jsendp** is middleware to add:

- `res.success`
- `res.fail`
- `res.error`

in Express and Connect apps. It works just like `res.json` and `res.jsonp` but wraps your response body in the [JSend specification](http://labs.omniti.com/labs/jsend).

This was heavily inspired by [jsender](https://www.npmjs.org/package/jsender) and [express-jsend](https://www.npmjs.org/package/express-jsend), however **jsendp** uses `res.jsonp` by default and lets you also special the HTTP status code.

## Installation

```
npm install jsendp --save
```

## Usage

Add **jsendp** like you would any other middleware.

```js
const express = require('express')
const jsendp = require('jsendp')

const app = express()

app.use(jsendp())

app.get('/', function (req, res, next) {
  res.success({
    message: 'Hi, Mom!'
  })
})

app.listen(3000)
```

`JSON-P` is enabled by default, though you can disable it (reverting to `res.json`) by passing an options object to the middleware:

```js
const express = require('express')
const jsendp = require('jsendp')

app.use(jsendp({ jsonp: false }))
```

## API

**jsendp** adds the following methods to the `res` object:

```
res.success({statusCode, data, message})
res.fail({statusCode, data, message})
res.error({statusCode, data, message})
```

## License

Released under the MIT License: [http://flesch.mit-license.org](http://flesch.mit-license.org)