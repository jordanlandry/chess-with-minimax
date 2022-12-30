import { useEffect } from "react";
import boardToFen from "./boardToFen";
import getAvailableMoves from "./getAvailableMoves";
import orderMoves from "./orderMoves";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface MoveDatabase {
  [key: string]: MinimaxMove;
}

// const transpositionTable: MoveDatabase = {};

let checkCount = 0;

let transpositionTable: MoveDatabase = {};

let startTime = 0;
let elapsedTime = 0;
export function getBestMove(board: string[][], timeLimit: number, setDepth: (depth: number) => void) {
  let bestMove: MinimaxMove = {
    from: { x: -1, y: -1 },
    to: { x: -1, y: -1 },
    piece: "",
    score: -Infinity,
  };

  checkCount = 0;
  let depth = 1;

  startTime = Date.now();
  while (Date.now() - startTime < timeLimit) {
    // Reset the transposition table every iteration
    transpositionTable = {};

    setDepth(depth);
    const initialBoard = board.map((row) => [...row]);
    const newBoard = initialBoard.map((row) => [...row]);

    const currentBestMove = minimax(newBoard, depth, false, -Infinity, Infinity, timeLimit, bestMove);
    const endTime = Date.now();

    // console.log(currentBestMove);

    if (currentBestMove) {
      currentBestMove.timeToComplete = endTime - startTime;
      currentBestMove.checkCount = checkCount;
      bestMove = currentBestMove;
    }

    depth++;
  }

  // console.log(bestMove);

  return { ...bestMove, depth: depth - 1 };
}

export const pieceValues: { [key: string]: number } = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 100,

  // Black pieces are negative
  P: -1,
  N: -3,
  B: -3,
  R: -5,
  Q: -9,
  K: -100,
};

function evaluateBoard(board: string[][]) {
  let score = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "") continue;

      score += pieceValues[board[i][j]];
    }
  }

  return score;
}

interface Move {
  from: { x: number; y: number };
  to: { x: number; y: number };
  piece: string;
}

interface MinimaxMove extends Move {
  score: number;
  timeToComplete?: number;
  checkCount?: number;
}

// Minimax
export function minimax(
  board: string[][],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  timeLimit: number,
  currentBestMove: any
) {
  elapsedTime = Date.now() - startTime;

  let bestMove: MinimaxMove = {
    from: { x: -1, y: -1 },
    to: { x: -1, y: -1 },
    piece: "",
    score: 0,
  };

  // Base case
  if (depth === 0) {
    bestMove.score = evaluateBoard(board);
    return bestMove;
  }

  // Time limit reached
  if (elapsedTime >= timeLimit) return null;

  // White is maximizing
  if (isMaximizing) {
    const allMoves = orderMoves(board, getAllMoves(board, 0), true, currentBestMove);
    let bestScore = -Infinity;

    // Go through all the moves
    for (let i = 0; i < allMoves.length; i++) {
      checkCount++;
      const move = allMoves[i];

      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Make the move
      board[move.to.y][move.to.x] = move.piece;
      board[move.from.y][move.from.x] = "";

      const prevEncounter = transpositionTable[boardToFen(board)];
      if (prevEncounter) return prevEncounter;

      const nextEval = minimax(board, depth - 1, false, alpha, beta, timeLimit, currentBestMove);

      // Check if time limit reached
      if (!nextEval) return null;

      // Undo the move
      board = newBoard.map((row) => [...row]);

      // Update the best score
      if (nextEval!.score > bestScore) {
        bestScore = nextEval!.score;
        bestMove = { ...move, score: bestScore };
      }

      // Update transposition table
      // transpositionTable[boardToFen(board)] = nextEval;

      // Update alpha
      alpha = Math.max(alpha, bestScore);

      // Check if we can prune
      if (beta <= alpha) break;
    }

    return bestMove;
  }

  // Black is minimizing
  else {
    const allMoves = orderMoves(board, getAllMoves(board, 1), false, currentBestMove);

    let bestScore = Infinity;

    // Go through all the moves
    for (let i = 0; i < allMoves.length; i++) {
      checkCount++;
      const move = allMoves[i];

      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Make the move
      board[move.to.y][move.to.x] = move.piece;
      board[move.from.y][move.from.x] = "";

      const prevEncounter = transpositionTable[boardToFen(board)];
      if (prevEncounter) return prevEncounter;

      const nextEval = minimax(board, depth - 1, true, alpha, beta, timeLimit, currentBestMove);

      // Check if time limit reached
      if (!nextEval) return null;

      // Undo the move
      board = newBoard.map((row) => [...row]);

      // Update the best score
      if (nextEval!.score < bestScore) {
        bestScore = nextEval!.score;
        bestMove = { ...move, score: bestScore };
      }

      // Update transposition table
      // transpositionTable[boardToFen(board)] = nextEval;

      // Update alpha
      beta = Math.min(beta, bestScore);

      // Check if we can prune
      if (beta <= alpha) break;
    }
    return bestMove;
  }
}

export function getAllMoves(board: string[][], player: number) {
  const allAvailebleMoves: Move[] = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      // Check if the square is empty
      if (board[i][j] === "") continue;

      // Check if the piece is the same color as the player
      if (player === 0 && board[i][j] === board[i][j].toUpperCase()) continue;
      if (player === 1 && board[i][j] === board[i][j].toLowerCase()) continue;

      const availableMoves = getAvailableMoves(board, board[i][j], j, i);

      if (availableMoves.length === 0) continue;

      // Add all available moves to the array
      availableMoves.forEach((move: any) => {
        allAvailebleMoves.push({
          from: { x: j, y: i },
          to: { x: move.x, y: move.y },
          piece: board[i][j],
        });
      });
    }
  }

  return allAvailebleMoves;
}
