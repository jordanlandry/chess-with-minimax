import React, { useEffect, useRef, useState } from "react";

type Props = {};

export default function Chess({}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<any>(null);

  const BOARD_SIZE = 8;
  const [canvWidth, setCanvWidth] = useState(Math.floor(window.innerWidth / 2));
  const [squareSize, setSquareSize] = useState(canvWidth / BOARD_SIZE);

  const colors = {
    light: "#f0d9b5",
    dark: "#b58863",
    overTake: "#ff0000",
    availebleMove: "#00ff00",
    selected: "#0000ff",
  };

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

  return (
    <div>
      <canvas ref={canvasRef} width={canvWidth} height={canvWidth} />
    </div>
  );
}
