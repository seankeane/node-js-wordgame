(function() {
    const prompt = require('prompt-sync')();
    const fs = require('fs');

    function makeWordlist() {
        // get word list file present on Unix systems
        const wordsFile = fs.readFileSync("/usr/share/dict/words", 'utf8');
        const wordsArray = wordsFile.split("\n");
        let words = [];
        for (let sub of wordsArray) {
            //  check for only 5-letter words and words that do not start with uppercase
            if (sub.length === 5 && /^[a-z]*$/.test(sub)) {
                words.push(sub);
            }
        }
        return words;
    }

    function makeAnswer() {
        const n = Math.floor(Math.random() * wordsList.length);
        return wordsList[n];
    }

    function printInstructions() {
        console.log("Try to guess the 5-letter word.\nHow to play:\n" +
            "After each guess a key will show to indicate how close your are to guessing the word e.g. x+--x" +
            "\n\t+ means the letter in that position in the word you guessed is also in the same position in the answer." +
            "\n\t- means the letter in that position in the word you guessed is also in the answer but in a different position." +
            "\n\tx means the letter in that position is not present in the answer.\nGood Luck! The timer has started.");
    }

    function askForGuess() {
        numGuesses++;
        console.log("Enter your guess:")
        guess = prompt("> ");
        guess = guess.toLowerCase();
    }

    function checkIsValidGuess(g) {
        if (g.length !== 5) {
            console.log("Enter a 5-letter word please.");
            return false;
        } else if (!/^[A-Za-z]*$/.test(g)) {
            console.log("Your guess should only contain letters.");
            return false;
        } else if (!wordsList.includes(g)) {
            console.log("That is not a valid word.");
            return false;
        } else {
            return true;
        }
    }

    function printKey(g) {
        let res = "> ";
        for (let i = 0; i < g.length; i++) {
            if (g[i] === answer[i]) {
                res += "+";
            } else if (answer.includes(g[i])) {
                res += "-";
            } else {
                res += "x";
            }
        }
        console.log(res);
    }

    function printLetters(g) {
        for (let letter of g) {
            letters = letters.replace(letter, "-");
        }
        console.log(`Letters you haven't guessed: ${letters}`);
    }

    function printCongrats() {
        const finalTime = (new Date().getTime() - startTime) / 1000;
        console.log(`Well Done! The word was ${answer}.\n
    You took you ${finalTime} seconds and ${numGuesses} guesses to find the word.`);
    }

    let isSolved = false,
        numGuesses = 0,
        guess, letters = 'abcdefghijklmonpqrstuvwxyz';
    const wordsList = makeWordlist(),
        answer = makeAnswer(),
        startTime = new Date().getTime();
    printInstructions();

    while (!isSolved) {
        if (numGuesses > 0) {
            if (checkIsValidGuess(guess)) {
                if (guess === answer) {
                    isSolved = true;
                    printCongrats();
                } else {
                    printKey(guess);
                    printLetters(guess);
                    askForGuess();
                }
            } else {
                askForGuess();
            }
        } else {
            askForGuess();
        }
    }
}) ();