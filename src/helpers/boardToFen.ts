export default function boardToFen(board: string[][]) {
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
}
