const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const xWinsDisplay = document.getElementById('xWins');
const oWinsDisplay = document.getElementById('oWins');
const drawsDisplay = document.getElementById('draws');

let board = Array(9).fill(null);
const human = 'X';
const ai = 'O';

let xWins = 0;
let oWins = 0;
let draws = 0;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (board[index] || checkWinner(board)) return;
    makeMove(index, human);
    if (!checkWinner(board) && !isDraw()) {
      const aiMove = bestMove();
      makeMove(aiMove, ai);
    }
  });
});

restartButton.addEventListener('click', restartGame);

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;

  const winner = checkWinner(board);
  if (winner) {
    updateScore(winner);
    setTimeout(() => alert(${winner} wins!), 100);
  } else if (isDraw()) {
    draws++;
    drawsDisplay.textContent = draws;
    setTimeout(() => alert(It's a draw!), 100);
  }
}

function checkWinner(boardState) {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }
  return null;
}

function isDraw() {
  return board.every(cell => cell);
}

function restartGame() {
  board.fill(null);
  cells.forEach(cell => cell.textContent = '');
}

function updateScore(winner) {
  if (winner === 'X') {
    xWins++;
    xWinsDisplay.textContent = xWins;
  } else if (winner === 'O') {
    oWins++;
    oWinsDisplay.textContent = oWins;
  }
}

// Minimax AI
function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

const scores = {
  X: -1,
  O: 1,
  draw: 0
};

function minimax(boardState, depth, isMaximizing) {
  let winner = checkWinner(boardState);
  if (winner) return scores[winner];
  if (isDraw()) return scores['draw'];

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = ai;
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = human;
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}