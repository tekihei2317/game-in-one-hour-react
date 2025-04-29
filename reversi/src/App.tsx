import { useState } from "react";

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;

type CellState = 0 | 1 | 2;
type Board = CellState[][];

const CELL_BLACK = 0;
const CELL_WHITE = 1;
const CELL_NONE = 2;

/** セルのアスキーアート */
const cellAA = ["●", "○️", "・"];

function Board({ board }: { board: Board }) {
  return (
    <div style={{ fontSize: 36 }}>
      {board.map((row, index) => (
        <div style={{ lineHeight: 1 }} key={index}>
          {row.map((cell) => cellAA[cell])}
        </div>
      ))}
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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Board board={board} />
    </div>
  );
}

export default App;
