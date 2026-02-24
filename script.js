const input = document.getElementById("word-input");
const gridCells = document.getElementsByClassName("grid-cell");
const message = document.getElementById("message");
const button = document.querySelector("button");

let validWords = [];

async function loadWords() {
  try {
    const response = await fetch("words");
    const text = await response.text();

    validWords = text.split("\n").map((word) => word.trim().toUpperCase());

    console.log("Words loaded!", validWords.length);
  } catch (err) {
    console.error("Could not load words file:", err);
  }
}

let answerWord;
loadWords().then(() => {
  answerWord = validWords[Math.floor(Math.random() * validWords.length)];
  console.log(answerWord);
});

let gridPointer = 0;
document.onkeydown = (e) => {
  if (e.key === "Enter") button.click();
};

function wordleHandler() {
  const guess = input.value.toUpperCase();

  if (guess.length === 5 && validWords.includes(guess)) {
    const guessArray = guess.split("");
    const answerArray = answerWord.split("");
    const statuses = new Array(5).fill("gray");
    const letterCounts = {};

    for (const char of answerArray) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }

    guessArray.forEach((char, i) => {
      if (char === answerArray[i]) {
        statuses[i] = "green";
        letterCounts[char]--;
      }
    });

    guessArray.forEach((char, i) => {
      if (statuses[i] !== "green") {
        if (letterCounts[char] > 0) {
          statuses[i] = "yellow";
          letterCounts[char]--;
        }
      }
    });

    statuses.forEach((status, i) => {
      const cell = gridCells[gridPointer];
      cell.classList.add(status);
      cell.innerText = guessArray[i];
      gridPointer++;
    });

    input.value = "";
    if (guess === answerWord) {
      message.innerText = "You've Won!";
    } else if (gridPointer === 30) { // how far can we reach
      message.innerText = "Correct Word: " + answerWord;
      button.removeEventListener("click", wordleHandler);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  }
}

button.addEventListener("click", wordleHandler);

setInterval(() => input.focus(), 100);
