import { useCallback, useEffect, useState } from "react";
import "./App.css";

/** プレイヤーが選択するコマンド（戦う、呪文、逃げる） */
type Command = "FIGHT" | "SPELL" | "RUN";
const commands: Command[] = ["FIGHT", "SPELL", "RUN"];

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
  /** 攻撃対象（配列のインデックス） */
  target: number;
  /** 攻撃力 */
  attack: number;
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
    target: CHARACTER_MONSTER,
    attack: 3,
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
    target: CHARACTER_PLAYER,
    attack: 2,
  },
];

function calculateDamage(attack: number): number {
  return 2;
  // return 1 + Math.floor(Math.random() * attack);
}

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

/** 戦闘中の状態（戦闘開始、コマンド選択中、コマンド選択後、戦闘終了） */
type BattleStatus = "start" | "command" | "command_selected" | "end";

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
  const [commandIndex, setCommandIndex] = useState<number>(0);

  // プレイヤーのステータスを初期化する
  // ↑これstateで持つのかrefで持つのかどっちがいいんだろうね...
  const [characters, setCharacters] = useState<CharacterStatus[]>([
    monsters[MONSTER_PLAYER],
    monsters[MONSTER_SLIME],
  ]);

  const [messages, setMessages] = useState<string[]>([
    `${characters[CHARACTER_MONSTER].name}が　あらわれた！`,
  ]);

  /** コマンドを実行する */
  const handleCommand = useCallback(async () => {
    for (const character of characters) {
      if (character.command === "FIGHT") {
        // 攻撃する
        setMessages([`${character.name}の　こうげき！`]);
        await waitForEnter();

        const damage = calculateDamage(character.attack);
        const target: CharacterStatus = {
          ...characters[character.target],
          hp: Math.max(characters[character.target].hp - damage, 0),
        };
        setCharacters((prev) =>
          prev.map((char, index) =>
            index === character.target ? target : char
          )
        );

        setMessages([`${target.name}に${damage}の　ダメージ！`]);
        await waitForEnter();

        // 倒れた場合の処理
        if (target.hp === 0) {
          if (character.target === CHARACTER_PLAYER) {
            // プレイヤーが倒された場合
            console.log("プレイヤーが倒された");
            return;
          } else {
            // モンスターを倒した場合
            setMessages([`${target.name}を　たおした！`]);

            // モンスターのアスキーアートを消す
            setCharacters(([player, monster]) => [
              player,
              { ...monster, aa: "\n" },
            ]);

            await waitForEnter();
            return;
          }
        }
      } else if (character.command === "SPELL") {
        // 呪文
        setMessages([`じゅもんはまだ使えない！`]);
        await waitForEnter();
        setBattleStatus("command");
        setMessages([]);
        return;
      } else {
        // 逃げる
        setMessages([`にげるはまだ使えない！`]);
        await waitForEnter();
        setBattleStatus("command");
        setMessages([]);
        return;
      }
    }

    // 戦闘が継続する場合、コマンド選択に戻る
    setBattleStatus("command");
  }, [characters]);

  // キーボード入力の処理をする
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (battleStatus === "start") {
        // プレイヤーがEnterを押したら、"start"→"command"にする
        if (e.key === "Enter") {
          setBattleStatus("command");
        }
      } else if (battleStatus === "command") {
        // カーソルキーでコマンドの選択を切り替える
        let newCommandIndex = commandIndex;
        if (e.key === "ArrowDown") {
          newCommandIndex = (commandIndex + 1) % commands.length;
          setCharacters(([player, monster]) => [
            { ...player, command: commands[newCommandIndex] },
            monster,
          ]);
          setCommandIndex(newCommandIndex);
        } else if (e.key === "ArrowUp") {
          newCommandIndex =
            (commandIndex - 1 + commands.length) % commands.length;
          setCharacters(([player, monster]) => [
            { ...player, command: commands[newCommandIndex] },
            monster,
          ]);
          setCommandIndex(newCommandIndex);
        }

        // エンターキーを押すと、現在選択しているコマンドを実行する
        if (e.key === "Enter") {
          setBattleStatus("command_selected");
          handleCommand();
        }
      }
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);

    // TODO: commandIndex, handleCommandは除外する
  }, [battleStatus, handleCommand, commandIndex]);

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

          {battleStatus === "command" && (
            <div>
              <CommandUI
                selectedCommand={commands[commandIndex]}
                onEnter={() =>
                  console.log(commands[commandIndex], "が選ばれました")
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
