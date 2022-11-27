export interface PieceType {
  id: string;
  type: string;
  team: 0 | 1;
  x: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  y: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface PieceProps extends PieceType {
  squareSize: number;
  setSelected: any;
  selected: boolean;
}
