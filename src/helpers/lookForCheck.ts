export default function lookForCheck(board: string[][], currentColor: string, x: number, y: number, piece: string) {
  let kingX = 0;
  let kingY = 0;

  // Find the king
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === (currentColor === "white" ? "K" : "k")) {
        kingX = j;
        kingY = i;
      }
    }
  }

  // Make the move
  const tempBoard = board.map((row) => [...row]);
  tempBoard[y][x] = piece;

  if (piece === "k" || piece === "K") {
    kingX = x;
    kingY = y;
  }

  // See if the king can be captured
  // Look for pawn
  if (currentColor === "white") {
    if (inBounds(kingX - 1, kingY - 1) && tempBoard[kingY - 1][kingX - 1] === "p") return true;
    if (inBounds(kingX + 1, kingY - 1) && tempBoard[kingY - 1][kingX + 1] === "p") return true;
  }

  if (currentColor === "black") {
    if (inBounds(kingX - 1, kingY - 1) && tempBoard[kingY - 1][kingX - 1] === "P") return true;
    if (inBounds(kingX + 1, kingY - 1) && tempBoard[kingY - 1][kingX + 1] === "P") return true;
  }

  // Look for knight
  const knightMoves = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 1, y: -2 },
    { x: 2, y: -1 },
    { x: -1, y: 2 },
    { x: -2, y: 1 },
    { x: -1, y: -2 },
    { x: -2, y: -1 },
  ];

  for (let i = 0; i < knightMoves.length; i++) {
    const move = knightMoves[i];
    if (
      inBounds(kingX + move.x, kingY + move.y) &&
      tempBoard[kingY + move.y][kingX + move.x] === (currentColor === "white" ? "n" : "N")
    )
      return true;
  }

  // Diagonal

  let upRight = true;
  let upLeft = true;
  let downRight = true;
  let downLeft = true;
  for (let i = 1; i < 8; i++) {
    // Up right
    let x = kingX + i;
    let y = kingY - i;
    if (inBounds(x, y) && upRight) {
      if (tempBoard[y][x] === (currentColor === "white" ? "b" : "B")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") upRight = false;
    }

    // Up left
    x = kingX - i;
    y = kingY - i;
    if (inBounds(x, y) && upLeft) {
      if (tempBoard[y][x] === (currentColor === "white" ? "b" : "B")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") upLeft = false;
    }

    // Down right
    x = kingX + i;
    y = kingY + i;
    if (inBounds(x, y) && downRight) {
      if (tempBoard[y][x] === (currentColor === "white" ? "b" : "B")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") downRight = false;
    }

    // Down left
    x = kingX - i;
    y = kingY + i;
    if (inBounds(x, y) && downLeft) {
      if (tempBoard[y][x] === (currentColor === "white" ? "b" : "B")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") downLeft = false;
    }
  }

  let up = true;
  let down = true;
  let right = true;
  let left = true;
  // Straight
  for (let i = 1; i < 8; i++) {
    // Up
    let x = kingX;
    let y = kingY - i;

    if (inBounds(x, y) && up) {
      if (tempBoard[y][x] === (currentColor === "white" ? "r" : "R")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") up = false;
    }

    // Down
    x = kingX;
    y = kingY + i;
    if (inBounds(x, y) && down) {
      if (tempBoard[y][x] === (currentColor === "white" ? "r" : "R")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") down = false;
    }

    // Right
    x = kingX + i;
    y = kingY;
    if (inBounds(x, y) && right) {
      if (tempBoard[y][x] === (currentColor === "white" ? "r" : "R")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") right = false;
    }

    // Left
    x = kingX - i;
    y = kingY;
    if (inBounds(x, y) && left) {
      if (tempBoard[y][x] === (currentColor === "white" ? "r" : "R")) return true;
      if (tempBoard[y][x] === (currentColor === "white" ? "q" : "Q")) return true;
      if (tempBoard[y][x] !== "") left = false;
    }
  }

  // King
  const kingMoves = [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
  ];

  for (let i = 0; i < kingMoves.length; i++) {
    const move = kingMoves[i];
    if (
      inBounds(kingX + move.x, kingY + move.y) &&
      tempBoard[kingY + move.y][kingX + move.x] === (currentColor === "white" ? "k" : "K")
    )
      return true;
  }

  return false;
}

export function inBounds(x: number, y: number) {
  if (y < 0 || y > 7 || x < 0 || x > 7) return false;

  return true;
}
