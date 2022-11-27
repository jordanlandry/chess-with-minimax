import nextId from "../helpers/nextId";
import { PieceType } from "./interfaces";

export const colors = {
  light: "#f0d9b5",
  dark: "#b58863",
  overTake: "#ff0000",
  availebleMove: "#00ff00",
  selected: "rgba(255, 180, 180, 0.75)",
  hover: "rgba(255, 180, 180, 0.5)",
};

export const BOARD_SIZE = 8;
export const MAX_WIDTH = 800;

export const STARTING_POSITION: PieceType[] = [
  { id: nextId(), team: 0, type: "r", x: 0, y: 0 },
  { id: nextId(), team: 0, type: "n", x: 1, y: 0 },
  { id: nextId(), team: 0, type: "b", x: 2, y: 0 },
  { id: nextId(), team: 0, type: "q", x: 3, y: 0 },
  { id: nextId(), team: 0, type: "k", x: 4, y: 0 },
  { id: nextId(), team: 0, type: "b", x: 5, y: 0 },
  { id: nextId(), team: 0, type: "n", x: 6, y: 0 },
  { id: nextId(), team: 0, type: "r", x: 7, y: 0 },
  { id: nextId(), team: 0, type: "p", x: 0, y: 1 },
  { id: nextId(), team: 0, type: "p", x: 1, y: 1 },
  { id: nextId(), team: 0, type: "p", x: 2, y: 1 },
  { id: nextId(), team: 0, type: "p", x: 3, y: 1 },
  { id: nextId(), team: 0, type: "p", x: 4, y: 1 },
  { id: nextId(), team: 0, type: "p", x: 5, y: 1 },
  { id: nextId(), team: 0, type: "p", x: 6, y: 1 },
  { id: nextId(), team: 0, type: "p", x: 7, y: 1 },
  { id: nextId(), team: 1, type: "r", x: 0, y: 7 },
  { id: nextId(), team: 1, type: "n", x: 1, y: 7 },
  { id: nextId(), team: 1, type: "b", x: 2, y: 7 },
  { id: nextId(), team: 1, type: "q", x: 3, y: 7 },
  { id: nextId(), team: 1, type: "k", x: 4, y: 7 },
  { id: nextId(), team: 1, type: "b", x: 5, y: 7 },
  { id: nextId(), team: 1, type: "n", x: 6, y: 7 },
  { id: nextId(), team: 1, type: "r", x: 7, y: 7 },
  { id: nextId(), team: 1, type: "p", x: 0, y: 6 },
  { id: nextId(), team: 1, type: "p", x: 1, y: 6 },
  { id: nextId(), team: 1, type: "p", x: 2, y: 6 },
  { id: nextId(), team: 1, type: "p", x: 3, y: 6 },
  { id: nextId(), team: 1, type: "p", x: 4, y: 6 },
  { id: nextId(), team: 1, type: "p", x: 5, y: 6 },
  { id: nextId(), team: 1, type: "p", x: 6, y: 6 },
  { id: nextId(), team: 1, type: "p", x: 7, y: 6 },
];
