import { useState } from 'react'
import './App.css'


function App() {
  const [display, setDisplay] = useState("")
const calculate = async () => {
  try {
    // Split expression into parts
    // e.g. "2+2+2" becomes ["2", "+", "2", "+", "2"]
    const tokens = display.match(/(-?\d+(?:\.\d+)?)|([+\-*\/])/g);
    
    if (!tokens) {
      setDisplay("Error");
      return;
    }

    // Start with first number
    let result = parseFloat(tokens[0]);

    // Loop through remaining pairs of operator + number
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const nextNumber = parseFloat(tokens[i + 1]);

      // Send each step to backend
      const response = await fetch(
        `http://localhost:3000/calculate?expression=${encodeURIComponent(
          `${result}${operator}${nextNumber}`
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setDisplay("Error");
        return;
      }

      result = data.result;
    }

    setDisplay(String(result));

  } catch (error) {
    console.error(error);
    setDisplay("Error");
  }
};
   
  return (
    
  <div className="container">

    <h1>Calculator App</h1>

    <div>
      <input type="text" id="display" value={display} readOnly />
    </div>

    <div>
      <input type="button" value="AC" onClick={() => setDisplay("")} />
      <input type="button" value="DE" onClick={() => setDisplay(display.slice(0, -1))} />
      <input type="button" value="/" onClick={() => setDisplay(display + "/")} />
      <input type="button" value="*" onClick={() => setDisplay(display + "*")} />
    </div>

    <div>
      <input type="button" value="7" onClick={() => setDisplay(display + "7")} />
      <input type="button" value="8" onClick={() => setDisplay(display + "8")} />
      <input type="button" value="9" onClick={() => setDisplay(display + "9")} />
      <input type="button" value="-" onClick={() => setDisplay(display + "-")} />
    </div>

    <div>
      <input type="button" value="4" onClick={() => setDisplay(display + "4")} />
      <input type="button" value="5" onClick={() => setDisplay(display + "5")} />
      <input type="button" value="6" onClick={() => setDisplay(display + "6")} />
      <input type="button" value="+" onClick={() => setDisplay(display + "+")} />
    </div>

    <div>
      <input type="button" value="1" onClick={() => setDisplay(display + "1")} />
      <input type="button" value="2" onClick={() => setDisplay(display + "2")} />
      <input type="button" value="3" onClick={() => setDisplay(display + "3")} />
      <input type="button" value="^" onClick={() => setDisplay(display + "^")} />
    </div>

    <div>
      <input type="button" value="." onClick={() => setDisplay(display + ".")} />
      <input type="button" value="0" onClick={() => setDisplay(display + "0")} />
      <input type="button" value="%" onClick={() => setDisplay(display + "%")} />
      <input type="button" value="=" onClick={() => calculate()} />
    </div>

  </div>

    
  )
}

export default App
