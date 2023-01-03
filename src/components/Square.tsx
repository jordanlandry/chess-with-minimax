import React, { useEffect, useState } from "react";
import { colors } from "../data/properties";

type Props = {
  color: string;
  onClick: (x: number, y: number) => void;
  x: number;
  y: number;
  isOvertakeSquare: boolean;
  isAvailableSquare: boolean;

  movedFromX?: number;
  movedFromY?: number;
  movedToX?: number;
  movedToY?: number;

  width: number;
  holdingPiece: boolean;
};

export default function Square({
  color,
  onClick,
  x,
  y,
  isOvertakeSquare,
  isAvailableSquare,
  movedFromX,
  movedFromY,
  movedToX,
  movedToY,
  width,

  holdingPiece,
}: Props) {
  const [hoverX, setHoverX] = useState(-1);
  const [hoverY, setHoverY] = useState(-1);

  useEffect(() => {
    if (!holdingPiece) {
      setHoverX(-1);
      setHoverY(-1);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.floor(e.clientX / width);
      const newY = Math.floor(e.clientY / width);

      setHoverX(newX);
      setHoverY(newY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [holdingPiece]);

  return (
    <div
      className={`${x}-${y}`}
      onClick={() => onClick(x, y)}
      style={{
        width: width,
        height: width,
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: hoverX === y && hoverY === x ? `inset 0 0 0 0.5rem rgba(255, 255, 255, 0.5)` : "none",
      }}
    >
      {isOvertakeSquare ? (
        <div
          style={{
            aspectRatio: "1/1",
            backgroundColor: "transparent",
            width: "75%",
            borderRadius: "50%",
            zIndex: 2,
            border: `0.5rem solid ${colors.overTake}`,
          }}
        />
      ) : isAvailableSquare ? (
        <div
          style={{
            aspectRatio: "1/1",
            backgroundColor: colors.availableMove,
            width: "33%",
            borderRadius: "50%",
          }}
        />
      ) : null}
    </div>
  );
}
