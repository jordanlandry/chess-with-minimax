import { useContext, useState } from "react";
import { PieceStyleContext } from "../App";

export default function Piece({ x, y, team, type, width, onClick }: any) {
  const style = useContext(PieceStyleContext);
  const img = "../src/assets/images/styles/" + style + "/" + type + team + ".png";

  const animationTime = 1000; // ms

  const [xPos, setXPos] = useState((x * width) / 8);
  const [yPos, setYPos] = useState((y * width) / 8);

  const handleOnClick = () => {
    onClick({ x, y, team, type });
  };

  return (
    <img
      className="piece"
      onClick={handleOnClick}
      alt={type}
      src={img}
      width="100%"
      style={{
        position: "absolute",
        width: width / 8,
        height: width / 8,
        left: xPos,
        top: yPos,
        zIndex: 1,
      }}
    />
  );
}
