import { useEffect, useState } from "react";
import { colors } from "../data/properties";

type Props = {
  color: string;
  onClick: (x: number, y: number) => void;
  pos: { x: number; y: number };
  // x: number;
  // y: number;
  isOvertakeSquare: boolean;
  isAvailableSquare: boolean;

  move: { from: { x: number; y: number }; to: { x: number; y: number } };

  offset: { x: number; y: number };
  selectedPos: { x: number; y: number };
  width: number;
  holdingPiece: boolean;
};

export default function Square({
  pos,
  selectedPos,
  color,
  onClick,
  isOvertakeSquare,
  isAvailableSquare,
  width,
  holdingPiece,
  offset,
  move,
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
      const newX = Math.floor((e.clientX - offset.x) / width);
      const newY = Math.floor((e.clientY - offset.y) / width);

      setHoverX(newX);
      setHoverY(newY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [holdingPiece]);

  const showYellow =
    (selectedPos!.y === pos.x && selectedPos!.x === pos.y) ||
    (move?.from.x === pos.y && move?.from.y === pos.x) ||
    (move?.to.y === pos.y && move?.to.x === pos.x);

  return (
    <div
      className={`${pos.x}-${pos.y}`}
      onClick={() => onClick(pos.x, pos.y)}
      style={{
        width: width,
        height: width,
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow:
          hoverX === pos.y && hoverY === pos.x ? `inset 0 0 0 ${width / 16}px rgba(255, 255, 255, 0.5)` : "none",
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

      {showYellow ? (
        <div
          style={{
            position: "absolute",
            backgroundColor: colors.movedTo,
            height: width,
            width: width,
            left: `${pos.y * width + offset.x}px`,
            top: `${pos.x * width + offset.y}px`,
          }}
        />
      ) : null}
    </div>
  );
}
