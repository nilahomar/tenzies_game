import { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  //generate random new die
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  //create random dice number and push it to new array
  const allNewDies = () => {
    const newDies = [];
    for (let i = 0; i < 10; i++) {
      newDies.push(generateNewDie());
    }
    return newDies;
  };

  //create state to hold the random dice
  const [dice, setDice] = useState(allNewDies());
  //state represent whether the user won the game or not
  const [tenzies, setTenzies] = useState(false);
  const [countRoll, setCountRoll] = useState(0);

  //side effect runs only anytime the dice array changes its state.
  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld === true);
    const firstValue = dice[0].value;
    console.log(firstValue);
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
      setTenzies(true);
      console.log("You won!");
    }
  }, [dice]);

  //create function to generate random new dice
  function rollDice() {
    setCountRoll((countRoll) => countRoll + 1);
    console.log(countRoll);
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          /* Checking if the die is held. If it is, it will return the die as it was before. If it is not, it
        will return a new die. */
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDies());
    }
  }

  //create function to hold the dice and make it green when it is true
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        /* Checking if the id of the die is the same as the id of the die that is clicked. If it is, it
      will return the die with the isHeld property set to the opposite of what it was before. If it
      is not, it will return the die as it was before. */
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  //store the value of dice dynamically
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <p>{tenzies ? `You rolled ${countRoll} times to win the game` : ""}</p>
    </main>
  );
}

export default App;
