import './App.css';
import { useCallback, useEffect, useState } from 'react';
import { wordsList } from "./Data/words";
import StartScreen from './Components/StartScreen';
import Game from './Components/Game';
import GameOver from './Components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

const guesseQtde = 3

function App() {
  const [gameSatge, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guesseQtde)
  const [score, setScore] = useState(0)

  const pickedWordAndCategory = useCallback(() => {
    // pick a random categoy
    const categories = Object.keys(words)
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category)

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)
    return { word, category };

  },[words]);


  const startGame = useCallback(() => {
    //cleat all letters
    clearLetterStates();

    // picked word e pick category
    const { word, category } = pickedWordAndCategory();

    // create aeeay of letters

    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category)
    console.log(wordLetters)

    // fill states

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  },[pickedWordAndCategory]);

  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    if ( guessedLetters.includes(normalizedLetter) || 
    wrongLetters.includes(normalizedLetter)
    ){
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses -1)
    }
 }

 const clearLetterStates = () =>{
  setGuessedLetters([]);
  setWrongLetters([]);
 };

 useEffect(() =>{

  if(guesses <= 0){
    // reset all stages
    clearLetterStates()
    setGameStage(stages[2].name)
  }
 }, [guesses])

  useEffect(() =>{

    const uniqueLetters = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length){
      //win condition
      setScore((actualScore) => (actualScore += 100));
      // restart game and new game
      startGame()
    }

 }, [guessedLetters, letters, startGame]);

  const retry = () => {
    setScore(0);
    setGuesses(guesseQtde);
    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameSatge === "start" && <StartScreen startGame={startGame} />}
      {gameSatge === "game" && <Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameSatge === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  )
}

export default App

