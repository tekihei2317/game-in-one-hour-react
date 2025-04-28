import { useEffect, useState } from "react";

const FIELD_WIDTH = 160;
const FIELD_HEIGHT = 160;

/** 一秒あたりの更新回数 */
const FPS = 10;
/** 更新間隔（ ms） */
const INTERVAL = 1000 / FPS;

type Field = boolean[][];
const EMPTY_ROW = new Array(FIELD_WIDTH).fill(false);

/**
 * フィールドを表示する
 */
function Field({ field }: { field: Field }) {
  return (
    <div style={{ fontSize: 6 }}>
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

type Pattern = boolean[][];

/**
 * フィールドに特定のパターンを書き込む
 */
function writePattern(
  field: Field,
  pattern: Pattern,
  destY: number,
  destX: number
) {
  const newField = structuredClone(field);
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[0].length; j++) {
      console.log(i, j);
      newField[destY + i][destX + j] = pattern[i][j];
    }
  }
  return newField;
}

const patternWidth = 10;
const patternHeight = 8;
const pattern: Pattern = [
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, true, false, false],
  [false, false, false, false, false, true, false, true, true, false],
  [false, false, false, false, false, true, false, true, false, false],
  [false, false, false, false, false, true, false, false, false, false],
  [false, false, false, true, false, false, false, false, false, false],
  [false, true, false, true, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
];

function App() {
  const [field, setField] = useState<Field>(
    [...new Array(FIELD_HEIGHT)].map(() => EMPTY_ROW.slice())
  );

  useEffect(() => {
    // フィールド中央にパターンをコピーする
    setField(
      writePattern(
        field,
        pattern,
        FIELD_HEIGHT / 2 - patternHeight / 2,
        FIELD_WIDTH / 2 - patternWidth / 2
      )
    );
    // TODO: 一回だけでOKなので...
  }, []);

  // 一定間隔ごとにフィールドを更新する
  useEffect(() => {
    const intervalId = setInterval(() => {
      setField(nextGeneration(field));
    }, INTERVAL);

    return () => clearInterval(intervalId);
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
