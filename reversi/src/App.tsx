import { useEffect, useState } from "react";

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;

type CellState = 0 | 1 | 2;
type Board = CellState[][];

const CELL_BLACK = 0;
const CELL_WHITE = 1;
const CELL_NONE = 2;

/** セルのアスキーアート */
const cellAA = ["●", "○️", "・"];

type Vector2 = { x: number; y: number };

function Board({
  board,
  cursorPosition,
}: {
  board: Board;
  cursorPosition: Vector2;
}) {
  return (
    <div style={{ fontSize: 36 }}>
      {board.map((row, index) => (
        <div style={{ lineHeight: 1 }} key={index}>
          {row.map((cell) => cellAA[cell])}
          {index === cursorPosition.y && "←"}
        </div>
      ))}
      <div>
        {board[0].map((_, index) => (index === cursorPosition.x ? "↑" : "　"))}
      </div>
    </div>
  );
}

function App() {
  const [board] = useState<Board>(
    [...new Array(BOARD_HEIGHT)].map((_, i) =>
      [...new Array(BOARD_WIDTH)].map((_, j) => {
        if ((i === 3 && j === 4) || (i === 4 && j === 3)) return CELL_BLACK;
        if ((i === 3 && j === 3) || (i === 4 && j === 4)) return CELL_WHITE;
        return CELL_NONE;
      })
    )
  );
  const [cursorPosition, setCursorPosition] = useState<Vector2>({ x: 3, y: 3 });

  // カーソルを動かす
  useEffect(() => {
    const keyToDiff = (key: string): { dy: number; dx: number } => {
      if (key === "w") return { dy: -1, dx: 0 };
      if (key === "s") return { dy: 1, dx: 0 };
      if (key === "a") return { dy: 0, dx: -1 };
      if (key === "d") return { dy: 0, dx: 1 };
      return { dy: 0, dx: 0 };
    };
    const handler = (e: KeyboardEvent) => {
      // WASDでカーソルを上下左右に動かす
      const diff = keyToDiff(e.key);
      setCursorPosition((prev) => ({
        y: (prev.y + diff.dy + BOARD_HEIGHT) % BOARD_HEIGHT,
        x: (prev.x + diff.dx + BOARD_WIDTH) % BOARD_WIDTH,
      }));
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Board board={board} cursorPosition={cursorPosition} />
    </div>
  );
}

export default App;
