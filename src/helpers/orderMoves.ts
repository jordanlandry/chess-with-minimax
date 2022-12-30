import { pieceValues } from "./minimax";

let count = 0;

// A huge optimization for alpha-beta pruning is to order the moves by their likelihood of being a good move
export default function orderMoves(
  board: string[][],
  availableMoves: any,
  isMaximizing: boolean,
  currentBestMove: any
) {
  const confidence = new Array(availableMoves.length).fill(0);
  const newAvailableMoves = [...availableMoves];

  // Check if you can capture a piece with high value
  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];

    // If you capture a piece with high value, increase the confidence using a low value piece
    if (board[move.to.y][move.to.x]) {
      // @ts-ignore
      const captureValue = pieceValues[board[move.to.y][move.to.x]];
      // @ts-ignore
      const pieceValue = pieceValues[move.piece];

      if (isMaximizing) {
        if (captureValue < pieceValue) {
          confidence[i] += captureValue / -pieceValue;
        }
      }

      if (!isMaximizing) {
        if (captureValue > pieceValue) {
          confidence[i] -= captureValue / -pieceValue;
        }
      }

      // Check previous moves to expand on
      if (
        currentBestMove.from.x === move.from.x &&
        currentBestMove.from.y === move.from.y &&
        currentBestMove.to.x === move.to.x &&
        currentBestMove.to.y === move.to.y
      ) {
        confidence[i] += 2;
      }
    }

    // If you are developing a piece, increase the confidence slightly (this is a very small optimization)
    if (move.piece === "P" && move.to.y > move.from.y) confidence[i] -= 0.1;
    if (move.piece === "p" && move.to.y < move.from.y) confidence[i] += 0.1;

    // If you have a high value piece that is being attacked, increase the confidence of moving that piece
    // TODO
  }

  // Sort the moves by their confidence
  for (let i = 0; i < confidence.length; i++) {
    for (let j = 0; j < confidence.length; j++) {
      if (confidence[i] > confidence[j]) {
        const temp = confidence[i];
        confidence[i] = confidence[j];
        confidence[j] = temp;

        const temp2 = newAvailableMoves[i];
        newAvailableMoves[i] = newAvailableMoves[j];
        newAvailableMoves[j] = temp2;
      }
    }
  }

  count++;

  return newAvailableMoves;
}
