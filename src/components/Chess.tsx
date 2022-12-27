import { useEffect, useRef, useState } from "react";
import { PositionType, PieceType } from "../data/interfaces";
import { BOARD_SIZE, colors, STARTING_POSITION } from "../data/properties";
import getAvailableMoves from "../helpers/getAvailableMoves";
import nextId from "../helpers/nextId";
import useKeybind from "../hooks/useKeybind";
import useWidth from "../hooks/useWidth";
import Piece from "./Piece";
import Square from "./Square";

export default function Chess() {
  // ~~~ HOOKS ~~~ \\
  useWidth();
  useKeybind("Escape", () => setSelectedPiece(undefined));

  // ~~~ STATES ~~~ \\
  const [board, setBoard] = useState(STARTING_POSITION);
  const [squareElements, setSquareElements] = useState<any>([]);
  const [selectedPiece, setSelectedPiece] = useState<PositionType>();
  const [availableMoves, setAvailableMoves] = useState<PositionType[]>([]);
  const [whosTurn, setWhosTurn] = useState<0 | 1>(0);

  // ~~~ REFS ~~~ \\
  const boardRef = useRef<HTMLDivElement>(null);

  // ~~~ INITIALIZE BOARD ~~~ \\
  useEffect(() => {
    let key = 0;
    const squareElements: any[] = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        let color = (i + j) % 2 === 0 ? colors.light : colors.dark;

        availableMoves.forEach((move: PositionType) => {
          if (move.x === j && move.y === i) color = board[i][j] ? colors.overTake : colors.availableMove;
        });

        squareElements.push(<Square key={key} color={color} onClick={clickSquareToMove} x={i} y={j} />);
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
          onClick={handlePieceClick}
          // isSelected={selectedPiece === }
        />
      ) : null;
    });
  });

  // ~~~ FUNCTIONS ~~~ \\
  function clickSquareToMove(y: number, x: number) {
    if (!selectedPiece) return;

    // If the selected square is an available move, move the piece there
    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i].x === x && availableMoves[i].y === y) {
        const newBoard = [...board];
        newBoard[y][x] = board[selectedPiece!.y][selectedPiece!.x];
        newBoard[selectedPiece!.y][selectedPiece!.x] = "";

        // Update state
        setBoard(newBoard);
        setSelectedPiece(undefined);
        setWhosTurn((whosTurn) => (whosTurn === 0 ? 1 : 0));
        return;
      }
    }

    // If the selected square is not an available move, deselect the piece
    setSelectedPiece(undefined);
  }

  function moveFrom(x1: number, y1: number, x2: number, y2: number) {
    const newBoard = [...board];
    newBoard[y2][x2] = board[y1][x1];
    newBoard[y1][x1] = "";
    setBoard(newBoard);
    setSelectedPiece(undefined);
  }

  function handlePieceClick(piece: PieceType) {
    if (piece.team === whosTurn) {
      setSelectedPiece({ x: piece.x, y: piece.y });
      return;
    }

    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i].x === piece.x && availableMoves[i].y === piece.y) {
        moveFrom(selectedPiece!.x, selectedPiece!.y, piece.x, piece.y);
        setWhosTurn(whosTurn === 0 ? 1 : 0);
      }
    }
  }

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
