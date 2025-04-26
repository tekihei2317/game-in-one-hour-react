import { useEffect, useState } from "react";

const FIELD_WIDTH = 12;
const FIELD_HEIGHT = 12;

type Field = boolean[][];
const EMPTY_ROW = new Array(FIELD_WIDTH).fill(0);

/**
 * フィールドを表示する
 */
function Field({ field }: { field: Field }) {
  return (
    <div>
      {field.map((row) => (
        <div>{row.map((cell) => (cell ? "■" : "　")).join("")}</div>
      ))}
    </div>
  );
}

/**
 * 指定したセルの、周囲の生きたセルの数を数える
 */
function countAliveNeighbors(field: Field, row: number, column: number) {
  let count = 0;

  // TODO: フィールドの範囲外に出た時に、ループさせる
  for (let dy = -1; dy <= 1; dy++) {
    const y = row + dy;
    if (y < 0 || y >= FIELD_HEIGHT) continue;

    for (let dx = -1; dx <= 1; dx++) {
      const x = column + dx;
      if (x < 0 || x >= FIELD_WIDTH) continue;

      // 自身は除外する
      if (y === row && x === column) continue;

      count += field[y][x] ? 1 : 0;
    }
  }
  return count;
}

function App() {
  const [field, setField] = useState<Field>([
    [0, 1, 0, ...new Array(FIELD_WIDTH - 3).fill(0)],
    [0, 0, 1, ...new Array(FIELD_WIDTH - 3).fill(0)],
    [1, 1, 1, ...new Array(FIELD_WIDTH - 3).fill(0)],
    ...new Array(FIELD_HEIGHT - 3).fill(EMPTY_ROW),
  ]);

  useEffect(() => {
    for (let i = 0; i < FIELD_HEIGHT; i++) {
      console.log(field[i]);
    }
  }, [field]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <Field field={field} />
        </div>
      </div>
    </>
  );
}

export default App;
