import { createContext, useContext, useState } from "react";
import Chess from "./components/Chess";

export const PieceStyleContext = createContext("wood");
function App() {
  const [pieceStyle, setPieceStyle] = useState("wood");

  return (
    <PieceStyleContext.Provider value={pieceStyle}>
      <div className="App">
        <Chess />
      </div>
    </PieceStyleContext.Provider>
  );
}

export default App;
