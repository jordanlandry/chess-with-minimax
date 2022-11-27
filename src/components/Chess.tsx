import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { PieceType } from "../data/interfaces";
import nextId from "../helpers/nextId";
import Piece from "./Piece";
import { colors } from "../data/properties";

export const ColorContext = createContext(colors);
export default function Chess() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<any>(null);

  const BOARD_SIZE = 8;
  const [canvWidth, setCanvWidth] = useState(Math.floor(window.innerWidth / 2));
  const [squareSize, setSquareSize] = useState(canvWidth / BOARD_SIZE);
  const [turn, setTurn] = useState(0);

  const STARTING_POSITION: PieceType[] = [
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

  const [selected, setSelected] = useState("");
  const [pieces, setPieces] = useState(STARTING_POSITION);

  // Create context for color

  const drawBoard = () => {
    // Draw grid with alternating colors for light and dark squares
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if ((i + j) % 2 === 0) ctx.fillStyle = colors.light;
        else ctx.fillStyle = colors.dark;

        ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      }
    }
  };

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    setCtx(context);
  }, []);

  // Initial Draw
  useEffect(() => {
    if (!ctx) return;
    drawBoard();
  }, [ctx, canvWidth]);

  // Update canv width on window resize
  useEffect(() => {
    const handleResize = () => {
      setCanvWidth(Math.floor(window.innerWidth / 2));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update square size on canv width change
  useEffect(() => {
    setSquareSize(canvWidth / BOARD_SIZE);
  }, [canvWidth]);

  const pieceElements = pieces.map((piece) => (
    <Piece
      key={piece.id}
      id={piece.id}
      type={piece.type}
      team={piece.team}
      x={piece.x}
      y={piece.y}
      squareSize={squareSize}
      setSelected={setSelected}
      selected={piece.id === selected}
    />
  ));

  // Reset selected when user presses escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected("");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={canvWidth} height={canvWidth} />
      <ColorContext.Provider value={colors}>{pieceElements}</ColorContext.Provider>
    </div>
  );
}
