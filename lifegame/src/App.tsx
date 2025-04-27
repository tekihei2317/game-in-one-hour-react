import { useEffect, useState } from "react";

const FIELD_WIDTH = 12;
const FIELD_HEIGHT = 12;

type Field = boolean[][];
const EMPTY_ROW = new Array(FIELD_WIDTH).fill(false);

/**
 * フィールドを表示する
 */
function Field({ field }: { field: Field }) {
  return (
    <div>
      {field.map((row, index) => (
        <div key={index}>{row.map((cell) => (cell ? "■" : "　")).join("")}</div>
      ))}
    </div>
  );
}

/**
 * 指定したセルの、周囲の生きたセルの数を数える
 */
function countAliveNeighbors(field: Field, row: number, column: number) {
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    const y = (row + dy + FIELD_HEIGHT) % FIELD_HEIGHT;

    for (let dx = -1; dx <= 1; dx++) {
      const x = (column + dx + FIELD_WIDTH) % FIELD_WIDTH;

      // 自身は除外する
      if (y === row && x === column) continue;

      count += field[y][x] ? 1 : 0;
    }
  }

  return count;
}

/**
 * 次の世代を返す
 */
function nextGeneration(field: Field): Field {
  const newField = [...new Array(FIELD_HEIGHT)].map(() =>
    new Array(FIELD_WIDTH).fill(false)
  );

  for (let i = 0; i < FIELD_HEIGHT; i++) {
    for (let j = 0; j < FIELD_WIDTH; j++) {
      const count = countAliveNeighbors(field, i, j);
      newField[i][j] = field[i][j];

      if (field[i][j]) {
        // 過疎による死滅
        if (count < 2) newField[i][j] = false;

        // 過密による死滅
        if (count >= 4) newField[i][j] = false;
      } else {
        // 誕生
        if (count === 3) newField[i][j] = true;
      }
    }
  }

  return newField;
}

function App() {
  const [field, setField] = useState<Field>([
    [false, true, false, ...new Array(FIELD_WIDTH - 3).fill(false)],
    [false, false, true, ...new Array(FIELD_WIDTH - 3).fill(false)],
    [true, true, true, ...new Array(FIELD_WIDTH - 3).fill(false)],
    ...[...new Array(FIELD_HEIGHT - 3)].map(() => EMPTY_ROW),
  ]);

  // Enterを押すごとにシミュレーションを進める
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setField(nextGeneration(field));
      }
    };

    window.addEventListener("keydown", handle);

    return () => window.removeEventListener("keydown", handle);
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
