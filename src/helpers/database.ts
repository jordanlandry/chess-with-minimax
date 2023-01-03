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
  // "rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR":  {
  //   whiteWins: 0.75,
  //   blackWins: 0,
  //   draws: 0.25,
  //   games: 4,
  // },
};

// export const database: DatabaseMove = {
//   "rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR": {
//     responses: [
//       {
//         move: {
//           from: { x: 4, y: 1 },
//           to: { x: 4, y: 3 },
//         },
//         whiteWins: 0.75,
//         blackWins: 0,
//         draws: 0.25,
//         games: 4,
//       },
//       {
//         move: {
//           from: { x: 3, y: 1 },
//           to: { x: 3, y: 3 },
//         },
//         whiteWins: 0.5,
//         blackWins: 0.25,
//         draws: 0.25,
//         games: 4,
//       },
//       {
//         move: {
//           from: { x: 6, y: 0 },
//           to: { x: 5, y: 2 },
//         },
//         whiteWins: 0.25,
//         blackWins: 0.25,
//         draws: 0.5,
//         games: 4,
//       },
//       {
//         move: {
//           from: { x: 0, y: 1 },
//           to: { x: 0, y: 3 },
//         },
//         whiteWins: 0.5,
//         blackWins: 0.5,
//         draws: 0,
//         games: 4,
//       },
//       {
//         move: {
//           from: { x: 0, y: 1 },
//           to: { x: 0, y: 3 },
//         },
//         whiteWins: 0.5,
//         blackWins: 0,
//         draws: 0.5,
//         games: 2,
//       },
//       {
//         move: {
//           from: { x: 0, y: 1 },
//           to: { x: 0, y: 3 },
//         },
//         whiteWins: 0,
//         blackWins: 0,
//         draws: 1,
//         games: 2,
//       },
//     ],
//   },
//   "rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR": {
//     responses: [
//       {
//         move: {
//           from: { x: 4, y: 1 },
//           to: { x: 4, y: 3 },
//         },
//         whiteWins: 0.35,
//         blackWins: 0.36,
//         draws: 0.18,
//         games: 1165,
//       },
//       {
//         move: {
//           from: { x: 3, y: 1 },
//           to: { x: 3, y: 3 },
//         },
//         whiteWins: 0.32,
//         blackWins: 0.44,
//         draws: 0.23,
//         games: 629,
//       },
//       {
//         move: {
//           from: { x: 2, y: 1 },
//           to: { x: 2, y: 3 },
//         },
//         whiteWins: 0.36,
//         blackWins: 0.44,
//         draws: 0.2,
//         games: 227,
//       },
//       {
//         move: {
//           from: { x: 4, y: 1 },
//           to: { x: 4, y: 2 },
//         },
//         whiteWins: 0.4,
//         blackWins: 0.35,
//         draws: 0.25,
//         games: 174,
//       },
//     ],
//   },
// };
