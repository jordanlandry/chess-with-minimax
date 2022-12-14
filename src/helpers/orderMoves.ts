import { pieceValues } from "./minimax";

let count = 0;

// A huge optimization for alpha-beta pruning is to order the moves by their likelihood of being a good move
export default function orderMoves(
  board: string[][],
  availableMoves: any,
  isMaximizing: boolean,
  currentBestMove: any,
  doMoveOrdering: boolean
) {
  const confidence = new Array(availableMoves.length).fill(0);
  const newAvailableMoves = [...availableMoves];

  const multiplier = isMaximizing ? 1 : -1;
  // If move ordering is disabled, return the original array
  if (!doMoveOrdering) return availableMoves;

  // Check if you can capture a piece with high value
  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];

    // If you capture a piece with high value, increase the confidence using a low value piece
    if (board[move.to.y][move.to.x]) {
      const captureValue = pieceValues[board[move.to.y][move.to.x]];
      const pieceValue = pieceValues[move.piece];

      if (isMaximizing && captureValue < pieceValue) confidence[i] += captureValue / -pieceValue;
      if (!isMaximizing && captureValue > pieceValue) confidence[i] -= captureValue / -pieceValue;

      // Check previous moves to expand on
      if (
        currentBestMove.from.x === move.from.x &&
        currentBestMove.from.y === move.from.y &&
        currentBestMove.to.x === move.to.x &&
        currentBestMove.to.y === move.to.y
      )
        confidence[i] += 5 * multiplier;
    }

    // If you are developing a piece, increase the confidence slightly (this is a very small optimization)
    if (move.piece === "P" && move.to.y > move.from.y) confidence[i] += 0.5 * multiplier;
    if (move.piece === "p" && move.to.y < move.from.y) confidence[i] += 0.5 * multiplier;

    // If you have a high value piece that is being attacked, increase the confidence of moving that piece

    // If you are going to promote a pawn, increase the confidence of that move
    if (move.piece === "P" && move.to.y === 7) confidence[i] += 1 * multiplier;
    if (move.piece === "p" && move.to.y === 0) confidence[i] += 1 * multiplier;
  }

  // Sort the moves by their confidence
  for (let i = 0; i < confidence.length; i++) {
    for (let j = 0; j < confidence.length; j++) {
      if (confidence[i] <= confidence[j]) continue;

      const temp = confidence[i];
      confidence[i] = confidence[j];
      confidence[j] = temp;

      const temp2 = newAvailableMoves[i];
      newAvailableMoves[i] = newAvailableMoves[j];
      newAvailableMoves[j] = temp2;
    }
  }

  count++;

  return newAvailableMoves;
}
