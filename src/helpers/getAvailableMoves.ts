import { PositionType } from "../data/interfaces";

export default function getAvailableMoves(board: string[][], piece: string, x: number, y: number) {
  const availableMoves: any = [];

  // ~~~ WHITE PAWN ~~~ \\
  if (piece === "p") {
    if (y === 0) return availableMoves;

    // Normal Move
    if (board[y - 1][x] === "") tryMove(x, y - 1);

    // First Move
    if (y === 6 && board[y - 2][x] === "" && board[y - 1][x] === "") tryMove(x, y - 2);

    // Take Right
    if (
      board[y - 1][x + 1] !== "" &&
      board[y - 1][x + 1] !== undefined &&
      board[y - 1][x + 1].toUpperCase() === board[y - 1][x + 1]
    )
      tryMove(x + 1, y - 1);

    // Take Left
    if (
      board[y - 1][x - 1] !== "" &&
      board[y - 1][x - 1] !== undefined &&
      board[y - 1][x - 1].toUpperCase() === board[y - 1][x - 1]
    )
      tryMove(x - 1, y - 1);

    // TODO En Passant
  }

  // ~~~ BLACK PAWN ~~~ \\
  if (piece === "P") {
    if (y === 7) return availableMoves;

    // Normal Move
    if (board[y + 1][x] === "") tryMove(x, y + 1);

    // First Move
    if (y === 1 && board[y + 2][x] === "" && board[y + 1][x] === "") tryMove(x, y + 2);

    // Take Right
    if (
      board[y + 1][x + 1] !== "" &&
      board[y + 1][x + 1] !== undefined &&
      board[y + 1][x + 1].toLowerCase() === board[y + 1][x + 1]
    )
      tryMove(x + 1, y + 1);

    // Take Left
    if (
      board[y + 1][x - 1] !== "" &&
      board[y + 1][x - 1] !== undefined &&
      board[y + 1][x - 1].toLowerCase() === board[y + 1][x - 1]
    )
      tryMove(x - 1, y + 1);

    // TODO En Passant
  }

  // The rest of the pieces are the same for both teams so we can just lowercase the piece
  piece = piece.toLowerCase();

  // ~~~ ROOK ~~~ \\
  if (piece === "r") {
    // Up
    for (let i = y - 1; i >= 0; i--) {
      if (board[i][x] === "") tryMove(x, i);
      else if (board[i][x].toUpperCase() === board[i][x]) {
        tryMove(i, y);
        break;
      } else break;
    }

    // Down
    for (let i = y + 1; i < 8; i++) {
      if (board[i][x] === "") tryMove(x, i);
      else if (board[i][x].toUpperCase() === board[i][x]) {
        tryMove(i, y);
        break;
      } else break;
    }

    // Left
    for (let i = x - 1; i >= 0; i--) {
      if (board[y][i] === "") availableMoves.push({ x: i, y });
      else if (board[y][i].toUpperCase() === board[y][i]) {
        tryMove(i, y);
        break;
      } else break;
    }

    // Right
    for (let i = x + 1; i < 8; i++) {
      if (board[y][i] === "") tryMove(i, y);
      else if (board[y][i].toUpperCase() === board[y][i]) {
        tryMove(i, y);
        break;
      } else break;
    }
  }

  // ~~~ KNIGHT ~~~ \\
  if (piece === "n") {
    // Up Left
    if (board[y - 2] !== undefined && board[y - 2][x - 1] !== undefined) {
      if (board[y - 2][x - 1] === "" || board[y - 2][x - 1].toUpperCase() === board[y - 2][x - 1])
        tryMove(x - 1, y - 2);
    }

    // Up Right
    if (board[y - 2] !== undefined && board[y - 2][x + 1] !== undefined) {
      if (board[y - 2][x + 1] === "" || board[y - 2][x + 1].toUpperCase() === board[y - 2][x + 1])
        tryMove(x + 1, y - 2);
    }

    // Down Left
    if (board[y + 2] !== undefined && board[y + 2][x - 1] !== undefined) {
      if (board[y + 2][x - 1] === "" || board[y + 2][x - 1].toUpperCase() === board[y + 2][x - 1])
        tryMove(x - 1, y + 2);
    }

    // Down Right
    if (board[y + 2] !== undefined && board[y + 2][x + 1] !== undefined) {
      if (board[y + 2][x + 1] === "" || board[y + 2][x + 1].toUpperCase() === board[y + 2][x + 1])
        tryMove(x + 1, y + 2);
    }

    // Left Up
    if (board[y - 1] !== undefined && board[y - 1][x - 2] !== undefined) {
      if (board[y - 1][x - 2] === "" || board[y - 1][x - 2].toUpperCase() === board[y - 1][x - 2])
        tryMove(x - 2, y - 1);
    }

    // Left Down
    if (board[y + 1] !== undefined && board[y + 1][x - 2] !== undefined) {
      if (board[y + 1][x - 2] === "" || board[y + 1][x - 2].toUpperCase() === board[y + 1][x - 2])
        tryMove(x - 2, y + 1);
    }

    // Right Up
    if (board[y - 1] !== undefined && board[y - 1][x + 2] !== undefined) {
      if (board[y - 1][x + 2] === "" || board[y - 1][x + 2].toUpperCase() === board[y - 1][x + 2])
        tryMove(x + 2, y - 1);
    }

    // Right Down
    if (board[y + 1] !== undefined && board[y + 1][x + 2] !== undefined) {
      if (board[y + 1][x + 2] === "" || board[y + 1][x + 2].toUpperCase() === board[y + 1][x + 2])
        tryMove(x + 2, y + 1);
    }
  }

  // ~~~ BISHOP ~~~ \\
  if (piece === "b") {
    // Up Left
    for (let i = 1; i < 8; i++) {
      if (board[y - i] !== undefined && board[y - i][x - i] !== undefined) {
        if (board[y - i][x - i] === "") availableMoves.push({ x: x - i, y: y - i });
        else if (board[y - i][x - i].toUpperCase() === board[y - i][x - i]) {
          tryMove(x - i, y - i);
          break;
        } else break;
      } else break;
    }

    // Up Right
    for (let i = 1; i < 8; i++) {
      if (board[y - i] !== undefined && board[y - i][x + i] !== undefined) {
        if (board[y - i][x + i] === "") availableMoves.push({ x: x + i, y: y - i });
        else if (board[y - i][x + i].toUpperCase() === board[y - i][x + i]) {
          tryMove(x + i, y - i);
          break;
        } else break;
      } else break;
    }

    // Down Left
    for (let i = 1; i < 8; i++) {
      if (board[y + i] !== undefined && board[y + i][x - i] !== undefined) {
        if (board[y + i][x - i] === "") availableMoves.push({ x: x - i, y: y + i });
        else if (board[y + i][x - i].toUpperCase() === board[y + i][x - i]) {
          tryMove(x - i, y + i);
          break;
        } else break;
      } else break;
    }

    // Down Right
    for (let i = 1; i < 8; i++) {
      if (board[y + i] !== undefined && board[y + i][x + i] !== undefined) {
        if (board[y + i][x + i] === "") availableMoves.push({ x: x + i, y: y + i });
        else if (board[y + i][x + i].toUpperCase() === board[y + i][x + i]) {
          tryMove(x + i, y + i);
          break;
        } else break;
      } else break;
    }
  }

  // Check if the move will result in a check for the player who's turn it is if not, push the move to the array
  function tryMove(x: number, y: number) {
    // TODO
    availableMoves.push({ x, y });
  }

  // piece = piece.toLowerCase();
  return availableMoves;
}
