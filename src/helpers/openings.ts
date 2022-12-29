import boardToFen from "./boardToFen";

export default function openings(board: string[][]) {
  const fen = boardToFen(board);

  // @ts-ignore
  if (OPENINGS[fen]) return OPENINGS[fen].responses[Math.floor(Math.random() * OPENINGS[fen].responses.length)];
  else return null;
}

interface Opening {
  [key: string]: {
    responses: {
      name: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
    }[];
  };
}

const OPENINGS: Opening = {
  "RNBQKBNR/PPPPPPPP/8/8/4p3/8/pppp1ppp/rnbqkbnr": {
    responses: [
      {
        name: "King's Pawn Game: Sicilian Defense, Alapin Variation",
        from: { x: 2, y: 1 },
        to: { x: 2, y: 3 },
      },
      {
        name: "King's Pawn Game: Sicilian Defense, Alapin Variation",
        from: { x: 2, y: 1 },
        to: { x: 2, y: 3 },
      },
    ],
  },
};
