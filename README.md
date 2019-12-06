⚡ Lightweight Node.js HTTP client.

![logo](./logo.png)

## Install

```
npm i lightning-request
```

## Why lightning-request?

lightning-request is the most lightweight HTTP client for Node, it provides a number of extremely useful features.

## Use lightning-request

First, require the library.

```
const request = require('lightning-request');
```

Then let's make a request in an async function.

```
const request = require('lightning-request');

(async function() {
  try {
    const result = await request({
      url: 'https://github.com/node-labx/lightning-request',
    });
    console.log(result.statusCode); // response status code
    console.log(result.body); // response body
  } catch (error) {
    console.log(error);
  }
})();
```

## Contributing

- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3
