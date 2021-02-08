const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(function(req, res) {
      const chunks  = [];

      req.on('data', (buf) => {
        chunks.push(buf);
      });

      req.on('end', () => {
        const content = Buffer.concat(chunks).toString();

        if (req.url === '/stream') {
          if (req.method === 'PUT') {
            res.end(content);
          } else if (req.method === 'GET') {
            const tmp = path.join(process.cwd(), 'test/file/tmp.txt');
            res.end(fs.readFileSync(tmp, { encoding: 'utf-8' }))
          }

          return;
        }

        res.end('test server')
      });
    });

    server.on('error', reject);
    server.on('close', () => {
      // console.log('test server closeed');
    })
    
    server.listen(function() {
      const address = server.address();
    
      // console.log('test server listen at ', address);
      resolve({
        port: address.port,
        server,
      });
    });
  })
};