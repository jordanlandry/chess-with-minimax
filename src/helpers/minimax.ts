import boardToFen from "./boardToFen";
import getAvailableMoves from "./getAvailableMoves";
import numberOfPieces from "./numberOfPieces";
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
export function getBestMove(board: string[][], timeLimit: number, doAlphaBeta: boolean, doMoveOrdering: boolean) {
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

    const initialBoard = board.map((row) => [...row]);
    const newBoard = initialBoard.map((row) => [...row]);

    const currentBestMove = minimax(
      newBoard,
      depth,
      false,
      -Infinity,
      Infinity,
      timeLimit,
      bestMove,
      doAlphaBeta,
      doMoveOrdering
    );
    const endTime = Date.now();

    if (currentBestMove) {
      currentBestMove.timeToComplete = endTime - startTime;
      currentBestMove.checkCount = checkCount;
      bestMove = currentBestMove;
    }

    depth++;
  }

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

const gameWeights = {
  endGame: 16,
  midGame: 24,
};

function getGameState(board: string[][]) {
  const pieceCount = numberOfPieces(board);

  // Get gameWeights
  const midGameWeight = pieceCount / 24;
  const endGameWeight = pieceCount / 16;

  return [midGameWeight, endGameWeight];
}

function evaluateBoard(board: string[][]) {
  const [midGameWeight, endGameWeight] = getGameState(board);

  const whiteMoves = getAllMoves(board, 0);
  const blackMoves = getAllMoves(board, 1);

  if (whiteMoves.length === 0) return -1000000000; // White is in checkmate
  if (blackMoves.length === 0) return 1000000000; // Black is in checkmate

  let score = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "") continue;

      score += pieceValues[board[i][j]];

      // Add positional score
      if (board[i][j] === "p") score += 0.1 * (6 - i);
      if (board[i][j] === "P") score -= 0.1 * i;

      if (board[i][j] === "n") score += 0.11 * (6 - i);
      if (board[i][j] === "N") score -= 0.11 * i;

      if (board[i][j] === "b") score += 0.11 * (6 - i);
      if (board[i][j] === "B") score -= 0.11 * i;

      if (board[i][j] === "r") score += 0.12 * (6 - i);
      if (board[i][j] === "R") score -= 0.12 * i;

      if (board[i][j] === "q") score += 0.13 * (6 - i);
      if (board[i][j] === "Q") score -= 0.13 * i;
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
  currentBestMove: any,
  doAlphaBeta: boolean,
  doMoveOrdering: boolean
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
    const allMoves = orderMoves(board, getAllMoves(board, 0), true, currentBestMove, doMoveOrdering);
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

      // Check if it's a pawn promotion
      if (move.piece === "p" && move.to.y === 0) board[move.to.y][move.to.x] = "q";

      // Check for castle -- Just need to move the rook to the correct position
      if (move.piece === "k" && move.from.x === 4 && move.to.x === 6) {
        board[7][5] = "r";
        board[7][7] = "";
      }

      if (move.piece === "k" && move.from.x === 4 && move.to.x === 2) {
        board[7][3] = "r";
        board[7][0] = "";
      }

      const prevEncounter = transpositionTable[boardToFen(board)];
      if (prevEncounter) return prevEncounter;

      const nextEval = minimax(
        board,
        depth - 1,
        false,
        alpha,
        beta,
        timeLimit,
        currentBestMove,
        doAlphaBeta,
        doMoveOrdering
      );

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
      if (doAlphaBeta) {
        alpha = Math.max(alpha, bestScore);

        // Check if we can prune
        if (beta <= alpha) break;
      }
    }

    return bestMove;
  }

  // Black is minimizing
  else {
    const allMoves = orderMoves(board, getAllMoves(board, 1), false, currentBestMove, doMoveOrdering);

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

      // Check for pawn promotion
      if (move.piece === "P" && move.to.y === 7) board[move.to.y][move.to.x] = "Q";

      // Check for castle -- Just need to move the rook to the correct position
      if (move.piece === "K" && move.from.x === 4 && move.to.x === 6) {
        board[0][5] = "R";
        board[0][7] = "";
      }

      if (move.piece === "K" && move.from.x === 4 && move.to.x === 2) {
        board[0][3] = "R";
        board[0][0] = "";
      }

      const prevEncounter = transpositionTable[boardToFen(board)];
      if (prevEncounter) return prevEncounter;

      const nextEval = minimax(
        board,
        depth - 1,
        true,
        alpha,
        beta,
        timeLimit,
        currentBestMove,
        doAlphaBeta,
        doMoveOrdering
      );

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
      if (doAlphaBeta) {
        beta = Math.min(beta, bestScore);

        // Check if we can prune
        if (beta <= alpha) break;
      }
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
