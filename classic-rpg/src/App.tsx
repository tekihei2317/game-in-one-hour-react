import { useEffect, useState } from "react";
import "./App.css";

/** プレイヤーが選択するコマンド（戦う、呪文、逃げる） */
type Command = "FIGHT" | "SPELL" | "RUN";

/**
 * キャラクターのステータス
 */
export type CharacterStatus = {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  name: string;
  /** アスキーアート */
  aa: string;
  /** 選択中のコマンド */
  command: Command;
};

export const MONSTER_PLAYER = 0;
export const MONSTER_SLIME = 1;
export const MONSTER_MAX = 2;

export const CHARACTER_PLAYER = 0;
export const CHARACTER_MONSTER = 1;
export const CHARACTER_MAX = 2;

/**
 * モンスターのステータスの配列
 */
const monsters: CharacterStatus[] = [
  {
    hp: 15,
    maxHp: 15,
    mp: 15,
    maxMp: 15,
    name: "ゆうしゃ",
    aa: "",
    command: "FIGHT",
  },
  {
    hp: 3,
    maxHp: 3,
    mp: 0,
    maxMp: 3,
    name: "スライム",
    aa: `／・Д・＼
～～～～～`,
    command: "FIGHT",
  },
];

function waitForEnter() {
  return new Promise<void>((resolve) => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        window.removeEventListener("keydown", handler);
        resolve(); // ユーザーがEnterを押したら解決
      }
    };
    window.addEventListener("keydown", handler);
  });
}

/** 戦闘中の状態（戦闘開始、コマンド選択、戦闘終了） */
type BattleStatus = "start" | "command" | "end";

type CommandUIProps = {
  selectedCommand: Command;
  onEnter: () => void;
};

function CommandUI({ selectedCommand }: CommandUIProps) {
  return (
    <div>
      <div>{selectedCommand === "FIGHT" ? "＞" : "　"}たたかう</div>
      <div>{selectedCommand === "SPELL" ? "＞" : "　"}じゅもん</div>
      <div>{selectedCommand === "RUN" ? "＞" : "　"}にげる</div>
    </div>
  );
}

function App() {
  const [battleStatus, setBattleStatus] = useState<BattleStatus>("start");

  // キーボード入力の処理をする
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // プレイヤーがEnterを押したら、"start"→"command"にする
      if (battleStatus === "start") {
        if (e.key === "Enter") {
          setBattleStatus("command");
        }
      }
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [battleStatus]);

  // プレイヤーのステータスを初期化する
  // ↑これstateで持つのかrefで持つのかどっちがいいんだろうね...
  const [characters] = useState<CharacterStatus[]>([
    monsters[MONSTER_PLAYER],
    monsters[MONSTER_SLIME],
  ]);

  const [messages, setMessages] = useState<string[]>([
    `${characters[CHARACTER_MONSTER].name}が　あらわれた！`,
  ]);

  /** コマンドを実行する */
  const handleCommand = async () => {
    for (const character of characters) {
      if (character.command === "FIGHT") {
        console.log("戦う");

        setMessages([`${character.name}の　こうげき！`]);
        await waitForEnter();
      } else if (character.command === "SPELL") {
        console.log("呪文");
      } else {
        console.log("逃げる");
      }
    }
  };

  // const messages = (() => {
  //   if (battleStatus === "start") {
  //     return <div>{characters[CHARACTER_MONSTER].name}があらわれた！</div>;
  //   } else if (battleStatus === "command") {
  //     return <div>コマンド</div>;
  //   } else {
  //     <div>戦闘終了</div>;
  //   }
  // })();

  return (
    <>
      <div className="container-outer">
        <div className="container">
          {/* プレイヤーを表示する */}
          <div>{characters[CHARACTER_PLAYER].name}</div>
          <div>
            HP：{characters[CHARACTER_PLAYER].hp}／
            {characters[CHARACTER_PLAYER].maxHp} MP：
            {characters[CHARACTER_PLAYER].mp}／
            {characters[CHARACTER_PLAYER].maxHp}
          </div>

          {/* モンスターを表示する */}
          <div>
            <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
              {characters[CHARACTER_MONSTER].aa}
              （H P：{characters[CHARACTER_MONSTER].hp}／
              {characters[CHARACTER_MONSTER].maxHp}）
            </div>
          </div>

          {/* メッセージを表示する */}
          <div>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>

          <div>
            <CommandUI
              selectedCommand="FIGHT"
              onEnter={() => console.log("コマンドが選ばれました")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
