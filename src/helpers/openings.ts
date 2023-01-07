import boardToFen from "./boardToFen";

export default function openings(board: string[][]) {
  // Remove the last 2 characters from the FEN string (the current color)
  const fen = boardToFen(board, "white").slice(0, -2);

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
      // {
      //   name: "King's Pawn Game: Sicilian Defense, Alapin Variation",
      //   from: { x: 2, y: 1 },
      //   to: { x: 2, y: 3 },
      // },
    ],
  },
  "RNBQKBNR/PP1PPPPP/8/2P5/4p3/5n2/pppp1ppp/rnbqkb1r": {
    responses: [
      {
        name: "a",
        from: { x: 3, y: 1 },
        to: { x: 3, y: 2 },
      },
      // {
      //   name: "b",
      //   from: { x: 2, y: 1 },
      //   to: { x: 2, y: 3 },
      // },
    ],
  },
  "RNBQKBNR/PP2PPPP/3P4/2P5/4p3/2n2n2/pppp1ppp/r1bqkb1r": {
    responses: [
      {
        name: "c",
        from: { x: 1, y: 0 },
        to: { x: 2, y: 2 },
      },
    ],
  },
};
