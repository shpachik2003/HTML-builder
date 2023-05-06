const fs = require('fs');

const rs = fs.createReadStream('text.txt', 'utf-8');
rs.on('data', (chunk) => {
  console.log(chunk);
});
rs.on('error', (err) => {
  console.error(err);
});