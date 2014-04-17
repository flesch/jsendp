# jsendp

**jsendp** is middleware to provide `res.success`, `res.fail`, and `res.error` to Express and Connect apps. It works just like `res.json` and `res.jsonp` but wraps your response body in the [JSend specification](http://labs.omniti.com/labs/jsend).

This was heavily inspired by [jsender](https://www.npmjs.org/package/jsender) and [express-jsend](https://www.npmjs.org/package/express-jsend), however **jsendp** uses `res.jsonp` by default and lets you also special the HTTP status code.



## Installation

```
npm install jsendp --save
```

Add **jsendp** like you would any other middleware.


    var express = require('express')
      , jsendp = require('jsendp')
      ;

    var app = express();
    
    app.use(jsendp());

    app.get('/', function(req, res, next){
      res.success({
        text: 'Hi, Mom!'
      });
    });
    
    app.listen(3000);

`JSON-P` is enabled by default, though you can disable it (reverting to `res.json`) by passing an options object to the middleware:

    app.use(jsendp({ jsonp:false }));


## API

**jsendp** adds the following methods to the `res` object:

### res.success([body|status], [body])

Like Express, you can opt to send both a status code and body, or just the body.

    app.get('/posts', function(req, res, next){
      res.success([ {title:"First Post"}, {title:"Second Post"} ]);
    });

The response body will look like this:

    { 
      "status": "success",
      "data": [
        { title: "First Post" },
        { title: "Second Post" }
      ]
    }

### res.fail([body|status], [body])

This method is identical to `res.success` except the `status` key will be set to `"fail"`.

    app.post('/posts', function(req, res, next){
      res.fail(400, "Your request was bad and you should feel bad.");
    });

The response body will look like this:

    { 
      "status": "fail",
      "data": "Your request was bad and you should feel bad."
    }

In this example, a HTTP status code was supplied, so that response will have a `400 Bad Request` Status Code. This works like Express's [`res.send`](http://expressjs.com/4x/api.html#res.send).


### res.error([message|status], [message|obj], [obj])

Sending errors is a little more complex, but here's everything you can do:

    res.error('Unauthorized');
    res.error(new Error('Something is wrong!'));
    res.error(401, 'Unauthorized');
    res.error(401, new Error('Unauthorized'));
    res.error(403, 'Forbidden', { code:403, data:'This is forbidden.' });
    res.error('Forbidden', { code:403, data:'This is forbidden.' });

## License

Released under the MIT License: [http://flesch.mit-license.org](http://flesch.mit-license.org)