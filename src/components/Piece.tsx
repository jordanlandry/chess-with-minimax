import { useContext, useState } from "react";
import { PieceProps } from "../data/interfaces";
import { colors } from "../data/properties";

export default function Piece({ squareSize, id, team, type, setSelected, selected, x, y }: PieceProps) {
  // Black pieces

  const [hovering, setHovering] = useState(false);

  // Will change these to images later
  const getPiece = () => {
    if (team === 1) {
      switch (type) {
        case "p":
          return <p>♟</p>;
        case "r":
          return <p>♜</p>;
        case "n":
          return <p>♞</p>;
        case "b":
          return <p>♝</p>;
        case "q":
          return <p>♛</p>;
        case "k":
          return <p>♚</p>;
      }
    }

    // White pieces
    else {
      switch (type) {
        case "p":
          return <p>♙</p>;
        case "r":
          return <p>♖</p>;
        case "n":
          return <p>♘</p>;
        case "b":
          return <p>♗</p>;
        case "q":
          return <p>♕</p>;
        case "k":
          return <p>♔</p>;
      }
    }
  };

  const p = getPiece();
  const toggleSelected = () => {
    setSelected((prev: any) => (selected ? "" : id));
  };

  const SCALE_FACTOR = 0.9;

  const bg = selected ? colors.selected : "";
  return (
    <div
      data-hover-color={colors.hover}
      className={`piece`}
      style={{
        fontSize: `${squareSize * SCALE_FACTOR}px`,
        height: squareSize,
        width: squareSize,
        position: "absolute",
        left: `${x * squareSize}px`,
        top: `${y * squareSize}px`,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: bg,
      }}
      onClick={toggleSelected}
    >
      {p}
    </div>
  );
}
