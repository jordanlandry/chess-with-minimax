export default function Piece({ x, y, team, type, width, setSelectedPiece, id, onClick }: any) {
  const img = "../src/assets/images/" + type + team + ".png";

  return (
    <img
      onClick={() => onClick({ x, y, team, type })}
      alt={type}
      src={img}
      width="100%"
      style={{
        position: "absolute",
        width: width / 8,
        height: width / 8,
        left: (x * width) / 8,
        top: (y * width) / 8,
        zIndex: 1,
      }}
    />
  );
}
