import { useEffect } from "react";
import getAvailableMoves from "./getAvailableMoves";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const boardToFen = (board: string[][]) => {
  let fen = "";

  for (let i = 0; i < board.length; i++) {
    let emptySquares = 0;

    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "") {
        emptySquares++;
      } else {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }

        fen += board[i][j];
      }
    }

    if (emptySquares > 0) {
      fen += emptySquares;
      emptySquares = 0;
    }

    if (i < board.length - 1) fen += "/";
  }

  return fen;
};

interface MoveDatabase {
  [key: string]: MinimaxMove;
}

// const transpositionTable: MoveDatabase = {};

export function getBestMove(board: string[][]) {
  const startTime = Date.now();

  const initialBoard = board.map((row) => [...row]);
  const newBoard = initialBoard.map((row) => [...row]);

  const bestMove = minimax(newBoard, 4, false, -Infinity, Infinity);
  const endTime = Date.now();

  bestMove.timeToComplete = endTime - startTime;

  // console.log(transpositionTable);
  return bestMove;
}

const pieceValues = {
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
      // @ts-ignore
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
}

// Minimax
export function minimax(board: string[][], depth: number, isMaximizing: boolean, alpha: number, beta: number) {
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

  // White is maximizing
  if (isMaximizing) {
    const allMoves = getAllMoves(board, 0);

    let bestScore = -Infinity;

    // Go through all the moves
    for (let i = 0; i < allMoves.length; i++) {
      const move = allMoves[i];
      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Make the move
      board[move.to.y][move.to.x] = move.piece;
      board[move.from.y][move.from.x] = "";

      const nextEval = minimax(board, depth - 1, false, alpha, beta);

      // Get the score
      // let nextEval = bestMove;
      // Check if the move is in the transposition table
      // if (transpositionTable[boardToFen(board)]) nextEval = transpositionTable[boardToFen(board)];
      // else nextEval = minimax(board, depth - 1, false, alpha, beta);

      // Undo the move
      board = newBoard.map((row) => [...row]);

      // board[move.to.y][move.to.x] = "";
      // board[move.from.y][move.from.x] = move.piece;

      // Update the best score
      if (nextEval!.score > bestScore) {
        bestScore = nextEval!.score;
        bestMove = { ...move, score: bestScore };
      }

      // Update alpha
      alpha = Math.max(alpha, bestScore);

      // Check if we can prune
      if (beta <= alpha) break;
    }

    // Add the best move to the transposition table
    // transpositionTable[boardToFen(board)] = bestMove;
    return bestMove;
  }

  // Black is minimizing
  else {
    const allMoves = getAllMoves(board, 1);

    let bestScore = Infinity;

    // Go through all the moves
    for (let i = 0; i < allMoves.length; i++) {
      const move = allMoves[i];

      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Make the move
      board[move.to.y][move.to.x] = move.piece;
      board[move.from.y][move.from.x] = "";

      // Get the score
      // let nextEval = bestMove;

      // Check if the move is in the transposition table
      // if (transpositionTable[boardToFen(board)]) nextEval = transpositionTable[boardToFen(board)];
      // else nextEval = minimax(board, depth - 1, false, alpha, beta);

      const nextEval = minimax(board, depth - 1, true, alpha, beta);

      // Undo the move
      board = newBoard.map((row) => [...row]);
      // board[move.to.y][move.to.x] = "";
      // board[move.from.y][move.from.x] = move.piece;

      // Update the best score
      if (nextEval!.score < bestScore) {
        bestScore = nextEval!.score;
        bestMove = { ...move, score: bestScore };
      }

      // Update alpha
      beta = Math.min(beta, bestScore);

      // Check if we can prune
      if (beta <= alpha) break;
    }

    // Add the best move to the transposition table
    // transpositionTable[boardToFen(board)] = bestMove;
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
