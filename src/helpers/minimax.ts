import boardToFen from "./boardToFen";
import getAvailableMoves from "./getAvailableMoves";
import lookForCheck, { inBounds } from "./lookForCheck";
import numberOfPieces from "./numberOfPieces";
import orderMoves from "./orderMoves";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface MoveDatabase {
  [key: string]: MinimaxMove;
}

// const transpositionTable: MoveDatabase = {};

let checkCount = 0;
let transpositionTable: MoveDatabase = {};
const MAX_TRANSPOSITION_TABLE_SIZE = 64000;

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

const checkMateScore = 1000000;
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

function getGameState(board: string[][]) {
  const pieceCount = numberOfPieces(board);

  // Get gameWeights
  const earlyGameWeight = pieceCount / 32;
  const midGameWeight = pieceCount / 16;
  const endGameWeight = 8 / pieceCount;

  return [earlyGameWeight, midGameWeight, endGameWeight];
}

function getDoubledPawns(board: string[][], color: number) {
  let white = 0;
  let black = 0;
  const pawn = color === 0 ? "P" : "p";

  const distanceWeights: { [key: number]: number } = {
    1: 0.5,
    2: 0.4,
    3: 0.3,
    4: 0.2,
    5: 0.1,
  };

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length - 1; j++) {
      for (let k = 1; k < 6; k++) {
        if (!color && !inBounds(i + k, j)) continue;
        if (color && !inBounds(i - k, j)) continue;

        if (!color && board[i][j] === pawn && board[i + k][j] === pawn) black += distanceWeights[k]; // Black doubled pawns
        if (color && board[i][j] === pawn && board[i - k][j] === pawn) white -= distanceWeights[k]; // White doubled pawns

        // Check if a pawn is blocked by another piece
      }

      if (!color && board[i][j] === pawn && board[i + 1][j] !== "") black += 0.1; // Black blocked pawns
      if (color && board[i][j] === pawn && board[i - 1][j] !== "") white -= 0.1; // White blocked pawns
    }
  }

  return color ? black : white;
}

function getPositionalScore(board: string[][]) {
  const [earlyGameWeight, midGameWeight, endGameWeight] = getGameState(board);

  let score = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "") continue;

      score += pieceValues[board[i][j]];

      // Early game positional score
      // Pawns knights and bishops are generally better to move in the early game towards the center
      if (board[i][j] === "p") score += 0.1 * (6 - i) * earlyGameWeight;
      if (board[i][j] === "P") score -= 0.1 * (i - 1) * earlyGameWeight;

      if (board[i][j] === "p") score += 0.1 * (6 - i) * earlyGameWeight;
      if (board[i][j] === "P") score -= 0.1 * (i - 1) * earlyGameWeight;

      if (board[i][j] === "n") score += 0.11 * (6 - i) * earlyGameWeight;
      if (board[i][j] === "N") score -= 0.11 * (i - 1) * earlyGameWeight;

      if (board[i][j] === "b") score += 0.11 * (6 - i) * earlyGameWeight;
      if (board[i][j] === "B") score -= 0.11 * (i - 1) * earlyGameWeight;

      // Queens and rooks are generally not moved in the early game so discourage moving them
      if (board[i][j] === "r") score -= 0.12 * (6 - i) * earlyGameWeight;
      if (board[i][j] === "R") score += 0.12 * (i - 1) * earlyGameWeight;

      if (board[i][j] === "q") score -= 0.13 * (6 - i) * earlyGameWeight;
      if (board[i][j] === "Q") score += 0.13 * (i - 1) * earlyGameWeight;

      // Midgame positional score
      // Queens rooks and bishops and knights are generally played in the midgame
      if (board[i][j] === "r") score += 0.12 * (6 - i) * midGameWeight;
      if (board[i][j] === "R") score -= 0.12 * (i - 1) * midGameWeight;

      if (board[i][j] === "q") score += 0.13 * (6 - i) * midGameWeight;
      if (board[i][j] === "Q") score -= 0.13 * (i - 1) * midGameWeight;

      if (board[i][j] === "b") score += 0.11 * (6 - i) * midGameWeight;
      if (board[i][j] === "B") score -= 0.11 * (i - 1) * midGameWeight;

      if (board[i][j] === "n") score += 0.11 * (6 - i) * midGameWeight;
      if (board[i][j] === "N") score -= 0.11 * (i - 1) * midGameWeight;

      // End game positional score
      // Pawns are generally played in the endgame for promotion
      if (board[i][j] === "p") score += 0.1 * (6 - i) * endGameWeight;
      if (board[i][j] === "P") score -= 0.1 * (i - 1) * endGameWeight;

      // You generally want to get the other king to the edge or corners of the board

      // TODO Fix later because it's 4am and I'm tired and I don't want to think about it right now lol :D
      if (board[i][j] === "k") {
        score -= 0.1 * (6 - i) * endGameWeight;
        // score += 0.1 * (6 - j) * endGameWeight;

        score -= 0.1 * Math.abs(3 - j) * endGameWeight;
      }

      if (board[i][j] === "K") {
        score += 0.1 * (i - 1) * endGameWeight;
        // score -= 0.1 * (j - 1) * endGameWeight;
        score += 0.1 * Math.abs(3 - j) * endGameWeight;
      }
    }
  }

  return score;
}

export function evaluateBoard(board: string[][]) {
  const whiteMoves = getAllMoves(board, 0, true);
  const blackMoves = getAllMoves(board, 1, true);

  // // // Check for stalemate
  if (whiteMoves.length === 0 && !lookForCheck(board, "white")) return 0;
  if (blackMoves.length === 0 && !lookForCheck(board, "black")) return 0;

  // // // Check for checkmate
  if (whiteMoves.length === 0) return -checkMateScore; // White is in checkmate
  if (blackMoves.length === 0) return checkMateScore; // Black is in checkmate

  let score = 0;

  // // Check for doubled pawns, this is a bad thing so we subtract the score
  score -= getDoubledPawns(board, 0); // White
  score += getDoubledPawns(board, 1); // Black

  // // Check for positional score, value certain pieces by their position on the board
  score += getPositionalScore(board);

  // let score = 0;
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

  // If game is over
  if (currentBestMove.score === checkMateScore || currentBestMove.score === -checkMateScore) return currentBestMove;

  // Time limit reached
  if (elapsedTime >= timeLimit) return null;

  // White is maximizing
  if (isMaximizing) {
    const allMoves = orderMoves(board, getAllMoves(board, 0), true, currentBestMove, doMoveOrdering);

    // Check for stalemate
    if (allMoves.length === 0 && !lookForCheck(board, "white")) {
      bestMove.score = 0;
      return bestMove;
    }

    // Check for checkmate
    if (allMoves.length === 0) {
      bestMove.score = -checkMateScore;
      return bestMove;
    }

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
      if (prevEncounter && prevEncounter.piece) {
        if (prevEncounter.score > bestScore) {
          bestScore = prevEncounter.score;
          bestMove = { ...move, score: bestScore };
        }
        return prevEncounter;
      }

      const nextEval: any = minimax(
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
      transpositionTable[boardToFen(board)] = nextEval;
      if (Object.keys(transpositionTable).length > MAX_TRANSPOSITION_TABLE_SIZE) transpositionTable = {};

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

    // Check for stalemate
    if (allMoves.length === 0 && !lookForCheck(board, "black")) {
      bestMove.score = 0;
      return bestMove;
    }

    // Check for checkmate
    if (allMoves.length === 0) {
      bestMove.score = checkMateScore;
      return bestMove;
    }

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
      if (prevEncounter && prevEncounter.piece) {
        if (prevEncounter.score < bestScore) {
          bestScore = prevEncounter.score;
          bestMove = { ...move, score: bestScore };
        }
        return prevEncounter;
      }

      const nextEval: any = minimax(
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

      if (nextEval.score === -checkMateScore) {
        // console.log(nextEval);
      }

      // Undo the move
      board = newBoard.map((row) => [...row]);

      // Update the best score
      if (nextEval!.score < bestScore) {
        bestScore = nextEval!.score;
        bestMove = { ...move, score: bestScore };
      }

      // Update transposition table
      transpositionTable[boardToFen(board)] = nextEval;
      if (Object.keys(transpositionTable).length > MAX_TRANSPOSITION_TABLE_SIZE) transpositionTable = {};

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

// Search in a specific order to improve the chances of finding any move incase we are looking for check,
// As if we find a move, then we can stop searching, and without it is causing the depth to lower

const moveSearchOrderI = [2, 1, 3, 0, 4, 5, 6, 7];
const moveSearchOrderJ = [2, 1, 3, 0, 4, 5, 6, 7];
export function getAllMoves(board: string[][], player: number, lookingForMate = false) {
  const allAvailebleMoves: Move[] = [];

  // for (let i = 0; i < board.length; i++) {
  //   for (let j = 0; j < board[i].length; j++) {
  for (const i of moveSearchOrderI) {
    for (const j of moveSearchOrderJ) {
      // Check if the square is empty
      if (board[i][j] === "") continue;

      // Check if the piece is the same color as the player
      if (player === 0 && board[i][j] === board[i][j].toUpperCase()) continue;
      if (player === 1 && board[i][j] === board[i][j].toLowerCase()) continue;

      const availableMoves = getAvailableMoves(board, board[i][j], j, i);
      if (lookingForMate && availableMoves.length > 0) return availableMoves;

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
