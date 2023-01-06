import { useContext, useEffect, useRef, useState } from "react";
import { PieceStyleContext } from "../App";
import clamp from "../helpers/clamp";

export default function Piece({
  id,
  x,
  y,
  team,
  type,
  width,
  onClick,
  setGrabbedPiece,
  grabbedPiece,
  moveToSquareFunction,
  offsetX,
  offsetY,
  animateSettings,
}: any) {
  let animationOffsetX = 0;
  let animationOffsetY = 0;
  if (animateSettings.piece.x === x && animateSettings.piece.y === y) {
    if (animateSettings.x !== -1 && animateSettings.y !== -1) {
      animationOffsetX = (animateSettings.x * width) / 16;
      animationOffsetY = (animateSettings.y * width) / 16;
    }
  }

  const style = useContext(PieceStyleContext);
  const img = "./assets/images/styles/" + style + "/" + type + team + ".png";

  const [xPos, setXPos] = useState((x * width) / 8 + offsetX);
  const [yPos, setYPos] = useState((y * width) / 8 + offsetY);
  const [mouseDown, setMouseDown] = useState(grabbedPiece === id);

  const handleMouseDown = () => {
    if (grabbedPiece !== -1) return;

    onClick({ x, y, team, type });
    setGrabbedPiece(id);
    setMouseDown(true);
  };

  const handleMouseUp = (e: MouseEvent) => {
    setMouseDown(false);
    setGrabbedPiece(-1);

    // // Move the piece to the position of the mouse
    const newX = Math.floor((e.clientX - offsetX) / (width / 8));
    const newY = Math.floor((e.clientY - offsetY) / (width / 8));

    if (newX === x && newY === y) return;
    moveToSquareFunction(newY, newX);
  };

  const handleDrag = (e: MouseEvent) => {
    if (!mouseDown || grabbedPiece !== id) return;

    const newX = e.clientX - width / 16;
    const newY = e.clientY - width / 16;

    setXPos(clamp(newX, -width / 16 + offsetX, width - width / 16 + offsetX));
    setYPos(clamp(newY, -width / 16 + offsetY, width - width / 16 + offsetY));
  };

  return (
    <img
      draggable="false"
      className="piece"
      onMouseDown={handleMouseDown}
      // @ts-ignore
      onMouseUp={handleMouseUp}
      // @ts-ignore
      onMouseMove={handleDrag}
      alt={type}
      src={img}
      width="100%"
      style={{
        position: "absolute",
        width: width / 8,
        height: width / 8,
        left: xPos + animationOffsetX,
        top: yPos + animationOffsetY,
        zIndex: mouseDown ? 100 : 1,
      }}
    />
  );
}
