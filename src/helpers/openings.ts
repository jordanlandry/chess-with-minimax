export default function openings(board: string[][]) {
  for (const opening in OPENINGS) {
    console.log(opening);
  }
}

const OPENINGS = [
  {
    name: "Sicilian Defense",
    moves: [
      [
        ["R", "N", "B", "Q", "K", "B", "N", "R"],
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "p", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["p", "p", "p", "p", "", "p", "p", "p"],
        ["r", "n", "b", "q", "k", "b", "n", "r"],
      ],
      [
        ["R", "N", "B", "Q", "K", "B", "N", "R"],
        ["P", "P", "", "P", "P", "P", "P", "P"],
        ["", "", "P", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "p", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["p", "p", "p", "p", "", "p", "p", "p"],
        ["r", "n", "b", "q", "k", "b", "n", "r"],
      ],
    ],
  },
];

// const SICILIAN_DEFENSE = [
// [

// ],
// [
//
// ],
// ];

// const OPENINGS = [SICILIAN_DEFENSE];
