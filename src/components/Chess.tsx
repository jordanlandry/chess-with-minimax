import { useEffect, useRef, useState } from "react";
import { BOARD_SIZE, colors, STARTING_POSITION } from "../data/properties";
import getAvailableMoves from "../helpers/getAvailableMoves";
import nextId from "../helpers/nextId";
import useKeybind from "../hooks/useKeybind";
import useWidth from "../hooks/useWidth";
import Piece from "./Piece";
import Square from "./Square";

interface position {
  x: number;
  y: number;
}

interface pieceType extends position {
  id: string;
  team: 0 | 1;
  type: "p" | "r" | "k" | "b" | "q" | "k";
}

export default function Chess() {
  // ~~~ HOOKS ~~~ \\
  useWidth();
  useKeybind("Escape", () => setSelectedPiece(undefined));

  // ~~~ STATES ~~~ \\
  const [board, setBoard] = useState(STARTING_POSITION);
  const [squareElements, setSquareElements] = useState<any>([]);
  const [selectedPiece, setSelectedPiece] = useState<position>();
  const [availableMoves, setAvailableMoves] = useState<position[]>([]);

  // ~~~ REFS ~~~ \\
  const boardRef = useRef<HTMLDivElement>(null);

  // ~~~ INITIALIZE BOARD ~~~ \\
  useEffect(() => {
    let key = 0;
    const squareElements: any[] = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        let color = (i + j) % 2 === 0 ? colors.light : colors.dark;

        availableMoves.forEach((move: position) => {
          if (move.x === j && move.y === i) color = board[i][j] ? colors.overTake : colors.availableMove;
        });

        squareElements.push(<Square key={key} color={color} onClick={movePiece} x={i} y={j} />);
        key++;
      }
    }

    setSquareElements(squareElements);
  }, [availableMoves]);

  // ~~~ AVAILABLE MOVES ~~~ \\
  useEffect(() => {
    setAvailableMoves(
      selectedPiece
        ? getAvailableMoves(board, board[selectedPiece!.y][selectedPiece!.x], selectedPiece?.x, selectedPiece?.y)
        : []
    );
  }, [selectedPiece]);

  // ~~~ ELEMENTS ~~~ \\
  const pieceElements = board.map((row, i) => {
    return row.map((piece, j) => {
      return piece ? (
        <Piece
          id={nextId()}
          key={nextId()}
          x={j}
          y={i}
          team={piece === piece.toUpperCase() ? 1 : 0}
          type={piece.toLowerCase()}
          width={boardRef.current?.offsetWidth || null}
          setSelectedPiece={setSelectedPiece}
        />
      ) : null;
    });
  });

  // ~~~ FUNCTIONS ~~~ \\
  const movePiece = (y: number, x: number) => {
    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i].x === x && availableMoves[i].y === y) {
        const newBoard = [...board];
        newBoard[y][x] = board[selectedPiece!.y][selectedPiece!.x];
        newBoard[selectedPiece!.y][selectedPiece!.x] = "";
        setBoard(newBoard);
        setSelectedPiece(undefined);
        return;
      }
    }

    setSelectedPiece(undefined);
  };

  // ~~~ RENDER ~~~ \\
  return (
    <div
      ref={boardRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        width: "min(100%, 800px)",
      }}
    >
      {pieceElements}
      {squareElements}
    </div>
  );
}
