const ffi = require('ffi-napi');
const ref = require('ref-napi');

// Load your calculator DLL
const calculator = ffi.Library('./calculator', {
  'add':      ['double', ['double', 'double']],
  'subtract': ['double', ['double', 'double']],
  'multiply': ['double', ['double', 'double']],
  'divide':   ['double', ['double', 'double']]
});

// Create a simple web server
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // Parse the URL
  const url = new URL(req.url, `http://localhost:3000`);
  const a = parseFloat(url.searchParams.get('a'));
  const b = parseFloat(url.searchParams.get('b'));
  const op = url.searchParams.get('op');

  let result;

  if (op === 'add')           result = calculator.add(a, b);
  else if (op === 'subtract') result = calculator.subtract(a, b);
  else if (op === 'multiply') result = calculator.multiply(a, b);
  else if (op === 'divide')   result = calculator.divide(a, b);
  else                        result = 'Invalid operation';

  res.end(JSON.stringify({ result }));
});

server.listen(3000, () => {
  console.log('Calculator server running on http://localhost:3000');
});