import { PositionType } from "../data/interfaces";

export default function getAvailableMoves(board: string[][], piece: string, x: number, y: number) {
  const availableMoves: any = [];

  console.log(y);
  // White Pawn
  if (piece === "p") {
    if (y === 6) availableMoves.push({ x: x, y: y - 2 });
    availableMoves.push({ x: x, y: y - 1 });
  }

  piece = piece.toLowerCase();
  return availableMoves;
}
