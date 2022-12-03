export interface PositionType {
  x: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  y: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface PieceType extends PositionType {
  id: string;
  type: string;
  team: 0 | 1;
}

export interface PositionOffsetType {
  x: -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  y: -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface PieceMoveType {
  normal: PositionOffsetType[];
  first?: PositionOffsetType[];
  take?: PositionOffsetType[];
  canJump: boolean;
}

export interface AllMovesType {
  [key: string]: PieceMoveType;
}

// --- Props ---
export interface PieceProps extends PieceType {
  squareSize: number;
  setSelected: any;
  selected: boolean;
}
