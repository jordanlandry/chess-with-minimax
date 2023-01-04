// interface DatabaseMove {
//   [key: string]: {
//     responses: {
//       move: {
//         from: { x: number; y: number };
//         to: { x: number; y: number };
//       };
//       whiteWins: number;
//       blackWins: number;
//       draws: number;
//       games: number;
//     }[];
//   };
// }

interface DatabaseMove {
  [key: string]: {
    whiteWins: number;
    blackWins: number;
    draws: number;
    games: number;
  };
}

export const database: DatabaseMove = {
  "rnbqkbnr/pppp1ppp/8/4p3/P7/8/1PPPPPPP/RNBQKBNR": {
    whiteWins: 0.75,
    blackWins: 0,
    draws: 0.25,
    games: 4,
  },
};
