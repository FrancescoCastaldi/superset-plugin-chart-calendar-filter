const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = path.join(
    'C:\\Users\\franc\\OneDrive - mapsengineering.com\\Calendar-Filter-Superset\\demo',
    req.url === '/' ? 'index.html' : req.url
  );
  try {
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8080, () => console.log('Server running on http://localhost:8080'));
