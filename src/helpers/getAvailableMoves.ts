import { PositionType } from "../data/interfaces";
import lookForCheck from "./lookForCheck";

export default function getAvailableMoves(
  board: string[][],
  piece: string,
  x: number,
  y: number,
  castlingProperties: any
) {
  const availableMoves: any = [];
  const currentColor = piece === piece.toUpperCase() ? "white" : "black";

  // ~~~ WHITE PAWN ~~~ \\
  if (piece === "p") {
    if (y === 0) return availableMoves;

    if (y === 6 && board[y - 2][x] === "" && board[y - 1][x] === "") tryMove(x, y - 2); // First move
    if (board[y - 1][x] === "") tryMove(x, y - 1); // Move Forward
    if (board[y - 1][x + 1] && getColor(board[y - 1][x + 1]) !== currentColor) tryMove(x + 1, y - 1); // Capture right
    if (board[y - 1][x - 1] && getColor(board[y - 1][x - 1]) !== currentColor) tryMove(x - 1, y - 1); // Capture Left

    // TODO En passant

    // TODO Promotion
    if (y === 1 && board[0][x] === "") {
      availableMoves.push({ x, y: 0, promoteTo: "q" });
      availableMoves.push({ x, y: 0, promoteTo: "r" });
      availableMoves.push({ x, y: 0, promoteTo: "b" });
      availableMoves.push({ x, y: 0, promoteTo: "n" });
    }
  }

  // ~~~ BLACK PAWN ~~~ \\
  if (piece === "P") {
    if (y === 7) return availableMoves;

    if (y === 1 && board[y + 2][x] === "" && board[y + 1][x] === "") tryMove(x, y + 2); // First move
    if (board[y + 1][x] === "") tryMove(x, y + 1); // Move Forward

    if (board[y + 1][x + 1] && getColor(board[y + 1][x + 1]) !== currentColor) tryMove(x + 1, y + 1); // Capture right
    if (board[y + 1][x - 1] && getColor(board[y + 1][x - 1]) !== currentColor) tryMove(x - 1, y + 1); // Capture Left

    // TODO En passant
    // TODO Promotion
    if (y === 6 && board[7][x] === "") {
      availableMoves.push({ x, y: 7, promoteTo: "q" });
      availableMoves.push({ x, y: 7, promoteTo: "r" });
      availableMoves.push({ x, y: 7, promoteTo: "b" });
      availableMoves.push({ x, y: 7, promoteTo: "n" });
    }
  }

  // ~~~ ROOK ~~~ \\
  if (piece === "r" || piece === "R" || piece === "q" || piece === "Q") {
    // Move Up
    for (let i = y - 1; i >= 0; i--) {
      if (board[i][x] === "") tryMove(x, i);
      else if (getColor(board[i][x]) !== currentColor) {
        tryMove(x, i);
        break;
      } else break;
    }

    // Move Down
    for (let i = y + 1; i <= 7; i++) {
      if (board[i][x] === "") tryMove(x, i);
      else if (getColor(board[i][x]) !== currentColor) {
        tryMove(x, i);
        break;
      } else break;
    }

    // Move Left
    for (let i = x - 1; i >= 0; i--) {
      if (board[y][i] === "") tryMove(i, y);
      else if (getColor(board[y][i]) !== currentColor) {
        tryMove(i, y);
        break;
      } else break;
    }

    // Move Right
    for (let i = x + 1; i <= 7; i++) {
      if (board[y][i] === "") tryMove(i, y);
      else if (getColor(board[y][i]) !== currentColor) {
        tryMove(i, y);
        break;
      } else break;
    }
  }

  // ~~~ KNIGHT ~~~ \\
  if (piece === "n" || piece === "N") {
    // Top Left
    if (board[y - 2] && board[y - 2][x - 1] !== undefined) {
      if (board[y - 2][x - 1] === "" || getColor(board[y - 2][x - 1]) !== currentColor) tryMove(x - 1, y - 2);
    }

    // Top Right
    if (board[y - 2] && board[y - 2][x + 1] !== undefined) {
      if (board[y - 2][x + 1] === "" || getColor(board[y - 2][x + 1]) !== currentColor) tryMove(x + 1, y - 2);
    }

    // Bottom Left
    if (board[y + 2] && board[y + 2][x - 1] !== undefined) {
      if (board[y + 2][x - 1] === "" || getColor(board[y + 2][x - 1]) !== currentColor) tryMove(x - 1, y + 2);
    }

    // Bottom Right
    if (board[y + 2] && board[y + 2][x + 1] !== undefined) {
      if (board[y + 2][x + 1] === "" || getColor(board[y + 2][x + 1]) !== currentColor) tryMove(x + 1, y + 2);
    }

    // Left Top
    if (board[y - 1] && board[y - 1][x - 2] !== undefined) {
      if (board[y - 1][x - 2] === "" || getColor(board[y - 1][x - 2]) !== currentColor) tryMove(x - 2, y - 1);
    }

    // Left Bottom
    if (board[y + 1] && board[y + 1][x - 2] !== undefined) {
      if (board[y + 1][x - 2] === "" || getColor(board[y + 1][x - 2]) !== currentColor) tryMove(x - 2, y + 1);
    }

    // Right Top
    if (board[y - 1] && board[y - 1][x + 2] !== undefined) {
      if (board[y - 1][x + 2] === "" || getColor(board[y - 1][x + 2]) !== currentColor) tryMove(x + 2, y - 1);
    }

    // Right Bottom
    if (board[y + 1] && board[y + 1][x + 2] !== undefined) {
      if (board[y + 1][x + 2] === "" || getColor(board[y + 1][x + 2]) !== currentColor) tryMove(x + 2, y + 1);
    }
  }

  // ~~~ BISHOP ~~~ \\
  if (piece === "b" || piece === "B" || piece === "q" || piece === "Q") {
    // Top Left
    for (let i = 1; i <= 7; i++) {
      if (board[y - i] && board[y - i][x - i] !== undefined) {
        if (board[y - i][x - i] === "") tryMove(x - i, y - i);
        else if (getColor(board[y - i][x - i]) !== currentColor) {
          tryMove(x - i, y - i);
          break;
        } else break;
      } else break;
    }

    // Top Right
    for (let i = 1; i <= 7; i++) {
      if (board[y - i] && board[y - i][x + i] !== undefined) {
        if (board[y - i][x + i] === "") tryMove(x + i, y - i);
        else if (getColor(board[y - i][x + i]) !== currentColor) {
          tryMove(x + i, y - i);
          break;
        } else break;
      } else break;
    }

    // Bottom Left
    for (let i = 1; i <= 7; i++) {
      if (board[y + i] && board[y + i][x - i] !== undefined) {
        if (board[y + i][x - i] === "") tryMove(x - i, y + i);
        else if (getColor(board[y + i][x - i]) !== currentColor) {
          tryMove(x - i, y + i);
          break;
        } else break;
      } else break;
    }

    // Bottom Right
    for (let i = 1; i <= 7; i++) {
      if (board[y + i] && board[y + i][x + i] !== undefined) {
        if (board[y + i][x + i] === "") tryMove(x + i, y + i);
        else if (getColor(board[y + i][x + i]) !== currentColor) {
          tryMove(x + i, y + i);
          break;
        } else break;
      } else break;
    }
  }

  // ~~~ KING ~~~ \\
  if (piece === "k" || piece === "K") {
    // Top
    if (board[y - 1] && board[y - 1][x] !== undefined) {
      if (board[y - 1][x] === "" || getColor(board[y - 1][x]) !== currentColor) tryMove(x, y - 1);
    }

    // Bottom
    if (board[y + 1] && board[y + 1][x] !== undefined) {
      if (board[y + 1][x] === "" || getColor(board[y + 1][x]) !== currentColor) tryMove(x, y + 1);
    }

    // Left
    if (board[y] && board[y][x - 1] !== undefined) {
      if (board[y][x - 1] === "" || getColor(board[y][x - 1]) !== currentColor) tryMove(x - 1, y);
    }

    // Right
    if (board[y] && board[y][x + 1] !== undefined) {
      if (board[y][x + 1] === "" || getColor(board[y][x + 1]) !== currentColor) tryMove(x + 1, y);
    }

    // Top Left
    if (board[y - 1] && board[y - 1][x - 1] !== undefined) {
      if (board[y - 1][x - 1] === "" || getColor(board[y - 1][x - 1]) !== currentColor) tryMove(x - 1, y - 1);
    }

    // Top Right
    if (board[y - 1] && board[y - 1][x + 1] !== undefined) {
      if (board[y - 1][x + 1] === "" || getColor(board[y - 1][x + 1]) !== currentColor) tryMove(x + 1, y - 1);
    }

    // Bottom Left
    if (board[y + 1] && board[y + 1][x - 1] !== undefined) {
      if (board[y + 1][x - 1] === "" || getColor(board[y + 1][x - 1]) !== currentColor) tryMove(x - 1, y + 1);
    }

    // Bottom Right
    if (board[y + 1] && board[y + 1][x + 1] !== undefined) {
      if (board[y + 1][x + 1] === "" || getColor(board[y + 1][x + 1]) !== currentColor) tryMove(x + 1, y + 1);
    }

    // ~~ Castling ~~ \\

    // White side
    if (!lookForCheck(board, "white") && !castlingProperties.whiteKingHasMoved) {
      if (
        !castlingProperties.whiteRightRookHasMoved &&
        board[y][7] === "r" &&
        board[y][6] === "" &&
        board[y][5] === "" &&
        y === 7
      )
        tryMove(6, 7, true);
      if (
        !castlingProperties.whiteLeftRookHasMoved &&
        board[y][0] === "r" &&
        board[y][1] === "" &&
        board[y][2] === "" &&
        board[y][3] === "" &&
        y === 7
      )
        tryMove(2, 7, true);
    }

    // Black side
    if (!lookForCheck(board, "black") && !castlingProperties.blackKingHasMoved) {
      if (
        !castlingProperties.blackRightRookHasMoved &&
        board[y][7] === "R" &&
        board[y][6] === "" &&
        board[y][5] === "" &&
        y === 0
      )
        tryMove(6, 0, true);
      if (
        !castlingProperties.blackLeftRookHasMoved &&
        board[y][0] === "R" &&
        board[y][1] === "" &&
        board[y][2] === "" &&
        board[y][3] === "" &&
        y === 0
      )
        tryMove(2, 0, true);
    }
  }

  // Check if the move will result in a check for the player who's turn it is if not, push the move to the array
  function tryMove(x: number, y: number, isCastle?: boolean) {
    if (lookForCheck(board, currentColor, x, y, piece)) {
      return;
    }

    availableMoves.push({ x, y, isCastle });
  }

  function getColor(piece: string) {
    return piece === piece.toUpperCase() ? "white" : "black";
  }

  return availableMoves;
}

export function findPiece(board: string[][], piece: string) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === piece) return { x: j, y: i };
    }
  }

  return { x: -1, y: -1 };
}
