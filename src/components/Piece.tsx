import { useContext, useEffect, useRef, useState } from "react";
import { PieceStyleContext } from "../App";

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
}: any) {
  const style = useContext(PieceStyleContext);
  const img = "./assets/images/styles/" + style + "/" + type + team + ".png";

  const animationTime = 1000; // ms

  const [xPos, setXPos] = useState((x * width) / 8);
  const [yPos, setYPos] = useState((y * width) / 8);
  const [mouseDown, setMouseDown] = useState(grabbedPiece === id);

  const handleMouseDown = () => {
    onClick({ x, y, team, type });
    setGrabbedPiece(id);
    setMouseDown(true);
  };

  const handleMouseUp = (e: MouseEvent) => {
    setMouseDown(false);
    setGrabbedPiece(-1);

    // Move the piece to the position of the mouse
    const newX = Math.floor(e.clientX / (width / 8));
    const newY = Math.floor(e.clientY / (width / 8));

    if (newX === x && newY === y) return;

    onClick({ x, y, team, type });
    moveToSquareFunction(newY, newX);
  };

  const handleOnClick = () => {
    onClick({ x, y, team, type });
  };

  const handleDrag = (e: MouseEvent) => {
    if (!mouseDown) return;
    if (grabbedPiece !== id) return;

    // if ()

    const newX = e.clientX - width / 16;
    const newY = e.clientY - width / 16;

    setXPos(newX);
    setYPos(newY);
  };

  useEffect(() => {
    // const handleMouseDown = (e: MouseEvent) => {
    //   setXPos(e.clientX - width / 16);
    //   setYPos(e.clientY - width / 16);
    // };
    // window.addEventListener("mousedown", handleMouseDown);
    // return () => {
    //   window.removeEventListener("mousedown", handleMouseDown);
    // };
  }, []);

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
        left: xPos,
        top: yPos,
        zIndex: mouseDown ? 100 : 1,
      }}
    />
  );
}
