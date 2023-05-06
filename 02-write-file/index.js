const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeToFile = (data) => {
  fs.appendFile(filePath, `${data}\n`, (err) => {
    if (err) throw err;
  });
};

let firstInput;

console.log('Hello! What is your name?\n');

rl.on('line', (input) => {
  if (!firstInput) {
    firstInput = input;
  }
  if (input === 'exit') {
    console.log(`Goodbye, ${firstInput}!`);
    rl.close();
  } else {
    writeToFile(input);
  }
});

rl.on('SIGINT', () => {
  console.log(`Goodbye, ${firstInput}!`);
  rl.close();
});