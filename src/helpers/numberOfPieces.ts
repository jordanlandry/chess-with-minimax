export default function numberOfPieces(board: string[][]) {
  let count = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== "") count++;
    }
  }

  return count;
}
