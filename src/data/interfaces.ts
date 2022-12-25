// export interface PositionType {
//   x: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
//   y: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
// }

export interface PositionType {
  x: number;
  y: number;
}

export interface PieceType extends PositionType {
  id: string;
  team: 0 | 1;
  type: "p" | "r" | "k" | "b" | "q" | "k";
}
