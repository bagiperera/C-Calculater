const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const koffi = require('koffi');
const path = require('path');

const dllPath = path.join(__dirname, 'calculator.dll');
console.log('DLL path:', dllPath);

const lib = koffi.load(dllPath);

const addition = lib.func('double add(double a, double b)');
const Subtract = lib.func('double Subtract(double a, double b)');
const multiply = lib.func('double multiply(double a, double b)');
const divide = lib.func('double divide(double a, double b)');

app.use(cors());
app.use(express.json());

 

app.get('/calculate', (req, res) => {
  try {
    const expression = req.query.expression;

    
    const tokens = expression.match(/(-?\d+(?:\.\d+)?)|([+\-*\/])/g);

    if (!tokens) {
      return res.status(400).json({ error: 'Invalid expression' });
    }

     
    let numbers = [];
    let operators = [];

    for (let i = 0; i < tokens.length; i++) {
      if (i % 2 === 0) {
        numbers.push(parseFloat(tokens[i]));
      } else {
        operators.push(tokens[i]);
      }
    }

      
    let i = 0;
    while (i < operators.length) {
      if (operators[i] === '*' || operators[i] === '/') {
        let result;
        if (operators[i] === '*') {
          result = multiply(numbers[i], numbers[i + 1]);
        } else {
          if (numbers[i + 1] === 0) {
            return res.status(400).json({ error: 'Division by zero' });
          }
          result = divide(numbers[i], numbers[i + 1]);
        }
        
        numbers.splice(i, 2, result);
        operators.splice(i, 1);
      } else {
        i++;
      }
    }

    // Step 2: Second pass - handle + and - (lower priority)
    let finalResult = numbers[0];
    for (let j = 0; j < operators.length; j++) {
      if (operators[j] === '+') {
        finalResult = addition(finalResult, numbers[j + 1]);
      } else if (operators[j] === '-') {
        finalResult = Subtract(finalResult, numbers[j + 1]);
      }
    }

    res.json({ result: finalResult });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Calculation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});