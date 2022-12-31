import React, { useContext } from "react";
import { PieceStyleContext } from "../App";

type Props = {
  team: number;
  width: number;
  x: number;
  setPromotionPiece: any;
};

export default function Promotion({ team, width, x, setPromotionPiece }: Props) {
  const style = useContext(PieceStyleContext);

  const q = "./assets/images/styles/" + style + "/" + "q" + team + ".png";
  const r = "./assets/images/styles/" + style + "/" + "r" + team + ".png";
  const b = "./assets/images/styles/" + style + "/" + "b" + team + ".png";
  const n = "./assets/images/styles/" + style + "/" + "n" + team + ".png";

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "rgba(240, 240, 240, 0.9)",
        height: `${width / 2}px`,
        left: `${(width / 8) * x}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src={q}
        style={{ outline: "1px solid black", cursor: "pointer", width: width / 8 + "px" }}
        onClick={() => setPromotionPiece("q")}
        alt="Queen"
      />
      <img
        src={r}
        style={{ outline: "1px solid black", cursor: "pointer", width: width / 8 + "px" }}
        onClick={() => setPromotionPiece("r")}
        alt="Rook"
      />
      <img
        src={b}
        style={{ outline: "1px solid black", cursor: "pointer", width: width / 8 + "px" }}
        onClick={() => setPromotionPiece("b")}
        alt="Bishop"
      />
      <img
        src={n}
        style={{ outline: "1px solid black", cursor: "pointer", width: width / 8 + "px" }}
        onClick={() => setPromotionPiece("n")}
        alt="Knight"
      />
    </div>
  );
}
