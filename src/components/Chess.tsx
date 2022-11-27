import { createContext, useEffect, useRef, useState } from "react";
import { BOARD_SIZE, colors, MAX_WIDTH, STARTING_POSITION } from "../data/properties";
import Piece from "./Piece";

export const ColorContext = createContext(colors);
export default function Chess() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<any>(null);

  // ------------------ State ------------------
  const [canvWidth, setCanvWidth] = useState(Math.min(Math.floor(window.innerWidth / 2), MAX_WIDTH));
  const [squareSize, setSquareSize] = useState(canvWidth / BOARD_SIZE);
  const [turn, setTurn] = useState(0); // 0 = white, 1 = black

  const [selected, setSelected] = useState("");
  const [pieces, setPieces] = useState(STARTING_POSITION);

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

  // Get Canvas
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
    // Handle Resize with max width
    const handleResize = () => {
      const width = Math.min(Math.floor(window.innerWidth / 2), MAX_WIDTH);
      setCanvWidth(width);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update square size on canv width change
  useEffect(() => {
    setSquareSize(canvWidth / BOARD_SIZE);
  }, [canvWidth]);

  // ------------------ Piece Elements ------------------
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

  // ------------------ Render ------------------
  return (
    <div>
      <canvas ref={canvasRef} width={canvWidth} height={canvWidth} />
      <ColorContext.Provider value={colors}>{pieceElements}</ColorContext.Provider>
    </div>
  );
}
