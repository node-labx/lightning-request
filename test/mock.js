const http = require('http');

const app = http.createServer(function (req, res) {
  if (req.url === '/301' || req.url === '/302') {
    res.writeHead(301, 'Moved Permanently');
    res.end();
  } else if (req.url.startsWith('/200')) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(
      JSON.stringify({
        now: Date.now(),
      })
    );
  } else {
    res.writeHead(404, 'Not Found');
    res.end();
  }
});

app.listen(3000, function () {
  console.log('http://127.0.0.1:3000/');
});
