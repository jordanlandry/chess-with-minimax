import { useEffect, useRef, useState } from "react";
import { PieceType, PositionType } from "../data/interfaces";
import { BOARD_SIZE, colors, STARTING_POSITION } from "../data/properties";
import getAvailableMoves from "../helpers/getAvailableMoves";
import getMoveEvaluation from "../helpers/getMoveEvaluation";
import { getBestMove } from "../helpers/minimax";
import nextId from "../helpers/nextId";
import openings from "../helpers/openings";
import useHeight from "../hooks/useHeight";
import useKeybind from "../hooks/useKeybind";
import useLocalStorage from "../hooks/useLocalStorage";
import useWidth from "../hooks/useWidth";
import EvalBar from "./EvalBar";
import Piece from "./Piece";
import Promotion from "./Promotion";
import Square from "./Square";

export default function Chess() {
  interface MoveType extends PositionType {
    isCastle: boolean;
  }

  // ~~~ HOOKS ~~~ \\
  const width = useWidth();
  const height = useHeight();

  useKeybind("Escape", () => setSelectedPiece(undefined));

  // ~~~ STATES ~~~ \\
  const [board, setBoard] = useLocalStorage("board", STARTING_POSITION);

  const [squareElements, setSquareElements] = useState<any>([]);
  const [selectedPiece, setSelectedPiece] = useState<PositionType>();
  const [availableMoves, setAvailableMoves] = useState<MoveType[]>([]);
  const [whosTurn, setWhosTurn] = useLocalStorage("whosTurn", 0); // 0 = white, 1 = black

  // CASTLING STATES
  const [whiteKingHasMoved, setWhiteKingHasMoved] = useState(false);
  const [blackKingHasMoved, setBlackKingHasMoved] = useState(false);
  const [whiteLeftRookHasMoved, setWhiteLeftRookHasMoved] = useState(false);
  const [whiteRightRookHasMoved, setWhiteRightRookHasMoved] = useState(false);
  const [blackLeftRookHasMoved, setBlackLeftRookHasMoved] = useState(false);
  const [blackRightRookHasMoved, setBlackRightRookHasMoved] = useState(false);

  // PROMOTION STATES
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionPiece, setPromotionPiece] = useState("");

  // MINIMAX STATES
  const [timeToThink, setTimeToThink] = useLocalStorage("aiTimeToThink", 2.5); // In Seconds
  const [score, setScore] = useState<number>(0);
  const [checkCount, setCheckCount] = useState(0);
  const [lastMove, setLastMove] = useState<any>();
  const [depth, setDepth] = useState(0);

  const [doAlphaBeta, setDoAlphaBeta] = useLocalStorage("doAlphaBeta", true);
  const [doMoveOrdering, setDoMoveOrdering] = useLocalStorage("doMoveOrdering", true);
  const [showMinimaxDetails, setShowMinimaxDetails] = useLocalStorage("showMinimaxDetails", false);
  const [moveEvaluation, setMoveEvaluation] = useState("");

  const [boardHistory, setBoardHistory] = useLocalStorage("boardHistory", [STARTING_POSITION]);
  const [boardHistoryIndex, setBoardHistoryIndex] = useState(0);

  const [moveCount, setMoveCount] = useState(0);

  // PIECE STATES
  const [grabbedPiece, setGrabbedPiece] = useState(-1);

  // ~~~ REFS ~~~ \\
  const boardElementRef = useRef<HTMLDivElement>(null);

  // ~~~ INITIALIZE BOARD ~~~ \\
  useEffect(() => {
    let key = 0;
    const squareElements: any[] = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        let color = (i + j) % 2 === 0 ? colors.light : colors.dark;

        let isOvertakeSquare = false;
        let isAvailableSquare = false;

        availableMoves.forEach((move: PositionType) => {
          if (move.x === j && move.y === i) {
            isAvailableSquare = true;
            // Check if the square is an overtake square (if there is a piece on it that is not the same team as the selected piece)

            if (board[i][j]) {
              if (whosTurn === 0 && board[i][j].toLowerCase() !== board[i][j]) isOvertakeSquare = true;
              else if (whosTurn === 1 && board[i][j].toUpperCase() !== board[i][j]) isOvertakeSquare = true;
            }
          }
        });

        squareElements.push(
          <Square
            key={key}
            color={color}
            onClick={clickSquareToMove}
            x={i}
            y={j}
            isOvertakeSquare={isOvertakeSquare}
            isAvailableSquare={isAvailableSquare}
            movedFromX={lastMove?.from.x}
            movedFromY={lastMove?.from.y}
            movedToX={lastMove?.to.x}
            movedToY={lastMove?.to.y}
            width={boardElementRef.current?.clientWidth! / BOARD_SIZE}
            holdingPiece={grabbedPiece !== -1}
            selectedX={selectedPiece?.x}
            selectedY={selectedPiece?.y}
            offsetX={boardElementRef.current?.offsetLeft || 0}
            offsetY={boardElementRef.current?.offsetTop || 0}
          />
        );
        key++;
      }
    }

    setSquareElements(squareElements);
  }, [availableMoves, grabbedPiece, width, height, lastMove, showMinimaxDetails]);

  // ~~~ AVAILABLE MOVES ~~~ \\
  useEffect(() => {
    let moves = selectedPiece
      ? getAvailableMoves(board, board[selectedPiece!.y][selectedPiece!.x], selectedPiece?.x, selectedPiece?.y)
      : [];

    // Check if you can castle
    for (let i = 0; i < moves.length; i++) {
      if (!moves[i].isCastle) continue;

      if (moves[i].x === 2 && moves[i].y === 0 && (blackKingHasMoved || blackLeftRookHasMoved)) {
        moves.splice(i, 1);
        i--;
      }

      if (moves[i].x === 6 && moves[i].y === 0 && (blackKingHasMoved || blackRightRookHasMoved)) {
        moves.splice(i, 1);
        i--;
      }

      if (moves[i].x === 2 && moves[i].y === 7 && (whiteKingHasMoved || whiteRightRookHasMoved)) {
        moves.splice(i, 1);
        i--;
      }

      if (moves[i].x === 6 && moves[i].y === 7 && (whiteKingHasMoved || whiteLeftRookHasMoved)) {
        moves.splice(i, 1);
        i--;
      }
      // TODO: Check if the king is in check after the move
    }

    setAvailableMoves(moves);
    // Go through each move
  }, [selectedPiece]);

  // ~~~ HANDLE AI MOVES ~~~ \\
  const handleAIMove = () => {
    if (whosTurn === 0) return; // If it's not the AI's turn, return
    if (isPromoting) return; // If the other person is promoting, return
    if (moveCount === -1) return; // If the game is over, return TODO

    // Check for openings
    const openingMove = openings(board.map((b: any) => b));
    if (openingMove) {
      setMoveEvaluation("book");
      setTimeout(() => {
        moveFrom(openingMove.from.x, openingMove.from.y, openingMove.to.x, openingMove.to.y);
      }, timeToThink * 1000);
      return;
    }

    const prevScore = score;
    const move = getBestMove([...board], timeToThink * 1000, doAlphaBeta, doMoveOrdering);
    const newScore = move.score;

    // After each move, check if it's a good move or a blunder etc.
    setMoveEvaluation(getMoveEvaluation(prevScore, newScore));

    // If the move is a promotion, promote the piece
    if (move.to.y === 7 && move.piece === "P") {
      promotePiece("Q", move.to.x, move.to.y);
    }

    if (move.from.x === -1) return;
    moveFrom(move.from.x, move.from.y, move.to.x, move.to.y);

    setDepth(move.depth ? move.depth : 0);
    setScore(move.score ? move.score : 0);
    setCheckCount(move.checkCount ? move.checkCount : 0);
  };

  useEffect(() => {
    setTimeout(() => {
      handleAIMove();
    }, 500);
  }, [whosTurn, isPromoting]);

  // ~~~ ELEMENTS ~~~ \\
  const pieceElements = board.map((row: any, i: number) => {
    return row.map((piece: any, j: number) => {
      return piece ? (
        <Piece
          id={i * 8 + j}
          key={nextId()}
          x={j}
          y={i}
          team={piece === piece.toUpperCase() ? 1 : 0}
          type={piece.toLowerCase()}
          width={boardElementRef.current?.offsetWidth || null}
          setSelectedPiece={setSelectedPiece}
          onClick={handlePieceClick}
          grabbedPiece={grabbedPiece}
          setGrabbedPiece={setGrabbedPiece}
          moveToSquareFunction={clickSquareToMove}
          offsetX={boardElementRef.current?.offsetLeft || 0}
          offsetY={0}
        />
      ) : null;
    });
  });

  // ~~~ FUNCTIONS ~~~ \\

  function clickSquareToMove(y: number, x: number) {
    if (!selectedPiece) return;

    // If the selected square is an available move, move the piece there
    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i].x === x && availableMoves[i].y === y) {
        // Check for castling
        if (availableMoves[i].isCastle) {
          // White Castle
          if (y === 7 && x === 6) moveFrom(7, 7, 5, 7, false);
          if (y === 7 && x === 2) moveFrom(0, 7, 3, 7, false);

          // Black Castle
          if (y === 0 && x === 6) moveFrom(7, 0, 5, 0, false);
          if (y === 0 && x === 2) moveFrom(0, 0, 3, 0, false);
        }

        // Check for Promotion
        // @ts-ignore
        if (availableMoves[i].promoteTo) setIsPromoting(true);

        moveFrom(selectedPiece!.x, selectedPiece!.y, x, y);

        setSelectedPiece(undefined);
      }
    }

    // If the selected square is not an available move, deselect the piece
    setSelectedPiece(undefined);
  }

  async function moveFrom(x1: number, y1: number, x2: number, y2: number, changeTurn = true) {
    // AI Castle
    if (board[y1][x1] === "K" && !blackKingHasMoved) {
      setBlackKingHasMoved(true);

      if (x2 === 6) {
        const newBoard = [...board];
        newBoard[0][5] = "R";
        newBoard[0][7] = "";
        setBoard(newBoard);

        setBlackRightRookHasMoved(true);
      }

      if (x2 === 2) {
        const newBoard = [...board];
        newBoard[0][3] = "R";
        newBoard[0][0] = "";
        setBoard(newBoard);

        setBlackLeftRookHasMoved(true);
      }
    }

    // Play audio
    const audio =
      board[y2][x2] === "" ? new Audio("./assets/sounds/move-self.mp3") : new Audio("./assets/sounds/capture.mp3");
    audio.play();

    const newBoard = [...board];
    newBoard[y2][x2] = board[y1][x1];
    newBoard[y1][x1] = "";

    setBoard(newBoard);
    setSelectedPiece(undefined);
    setMoveCount((moveCount) => moveCount + 1);
    setLastMove({ from: { x: x1, y: y1 }, to: { x: x2, y: y2 } });

    if (board[y2][x2] === "k") setWhiteKingHasMoved(true);
    if (board[y2][x2] === "K") setBlackKingHasMoved(true);
    if (board[y2][x2] === "r" && y2 === 7 && x2 === 7) setWhiteLeftRookHasMoved(true);
    if (board[y2][x2] === "r" && y2 === 7 && x2 === 0) setWhiteRightRookHasMoved(true);
    if (board[y2][x2] === "R" && y2 === 0 && x2 === 7) setBlackLeftRookHasMoved(true);
    if (board[y2][x2] === "R" && y2 === 0 && x2 === 0) setBlackRightRookHasMoved(true);

    setWhosTurn((prev: number) => (prev === 0 ? 1 : 0));
  }

  function handlePieceClick(piece: PieceType) {
    if (piece.team === whosTurn) {
      setSelectedPiece({ x: piece.x, y: piece.y });
      return;
    }

    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i].x === piece.x && availableMoves[i].y === piece.y) {
        moveFrom(selectedPiece!.x, selectedPiece!.y, piece.x, piece.y);
      }
    }
  }

  const promotePiece = (to: string, x?: number, y?: number) => {
    // Set the piece to the promoted piece
    const newBoard = [...board];
    if (x !== undefined && y !== undefined) newBoard[y - 1][x] = to;
    else newBoard[lastMove.to.y][lastMove.to.x] = to;

    setBoard(newBoard);
    setPromotionPiece(to);
    setIsPromoting(false);
  };

  const reset = () => {
    setWhosTurn(0);
    setMoveCount(0);
    setLastMove({ from: { x: -1, y: -1 }, to: { x: -1, y: -1 } });
    setWhiteKingHasMoved(false);
    setBlackKingHasMoved(false);
    setWhiteLeftRookHasMoved(false);
    setWhiteRightRookHasMoved(false);
    setBlackLeftRookHasMoved(false);
    setBlackRightRookHasMoved(false);
    setPromotionPiece("");
    setIsPromoting(false);
    setAvailableMoves([]);
    setSelectedPiece(undefined);
    setScore(0);
    setGrabbedPiece(-1);
    setDepth(0);
    setCheckCount(0);
    setSquareElements([]);
    setMoveEvaluation("");

    // For some reason, it was not resetting the board properly so I had to do this
    setBoard([
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["r", "n", "b", "q", "k", "b", "n", "r"],
    ]);
  };

  // ~~~ DRAG AND DROP ~~~ \\
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      setGrabbedPiece(-1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (grabbedPiece === -1) return;
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ~~~ RENDER ~~~ \\
  return (
    <>
      <div className="chess-wrapper">
        <EvalBar evaluation={score} height={boardElementRef.current?.offsetWidth!} />
        <div
          className="chess-board"
          ref={boardElementRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            width: "min(calc(90%), min(80vh, 800px))",
          }}
          draggable={false}
        >
          {pieceElements}
          {squareElements}
          {isPromoting ? (
            <Promotion
              team={0}
              width={boardElementRef.current?.offsetWidth!}
              x={lastMove.from.x}
              setPromotionPiece={promotePiece}
              offsetX={boardElementRef.current?.offsetLeft!}
            />
          ) : null}
        </div>
      </div>

      <div className="move-eval-wrapper">
        <p className={`${moveEvaluation}-text move-eval-text`}>{moveEvaluation ? moveEvaluation : "Move evaluation"}</p>
      </div>

      <p style={{ textAlign: "center", margin: "10px 0" }}>{whosTurn === 0 ? "White's turn" : "Black's turn"}</p>
      <div className="button-wrapper">
        <button onClick={reset}>New Game</button>
        <button onClick={() => setShowMinimaxDetails((prev: boolean) => !prev)}>
          {showMinimaxDetails ? "Hide" : "Show"} Minimax Details
        </button>
      </div>

      {showMinimaxDetails ? (
        <div style={{ display: "flex", flexDirection: "column", width: "250px", margin: "auto", marginTop: "10px" }}>
          <p>Checks: {checkCount.toLocaleString()}</p>
          <p>Depth: {depth}</p>
          <p>Minimax Settings</p>
          <p>{`Time to think:  ${timeToThink}s`}</p>

          <div style={{ display: "flex" }}>
            <button onClick={() => setTimeToThink((prev: any) => (prev > 0.5 ? prev - 0.5 : 0.5))}>-</button>
            <button onClick={() => setTimeToThink((prev: any) => prev + 0.5)}>+</button>
          </div>

          <div>
            <input
              type="checkbox"
              id="alpha-beta-input"
              checked={doAlphaBeta}
              onChange={() => setDoAlphaBeta((prev: boolean) => !prev)}
            />
            <label htmlFor="alpha-beta-input">Alpha-Beta Pruning</label>
            <br />
            <input
              id="move-ordering-input"
              type="checkbox"
              checked={doMoveOrdering}
              onChange={() => setDoMoveOrdering((prev: boolean) => !prev)}
            />
            <label htmlFor="move-ordering-input">Move Ordering</label>
          </div>
        </div>
      ) : null}
    </>
  );
}
