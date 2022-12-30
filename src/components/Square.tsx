import React from "react";
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
}: Props) {
  return (
    <div
      className={`${x}-${y}`}
      onClick={() => onClick(x, y)}
      style={{
        width: "100%",
        aspectRatio: "1/1",
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
