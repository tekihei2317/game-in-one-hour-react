import { useState } from "react";
import {
  CHARACTER_MONSTER,
  CHARACTER_PLAYER,
  CharacterStatus,
  MONSTER_PLAYER,
  MONSTER_SLIME,
  monsters,
} from "./core";
import "./App.css";

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

function App() {
  // プレイヤーのステータスを初期化する
  // ↑これstateで持つのかrefで持つのかどっちがいいんだろうね...
  const [characters, setCharacters] = useState<CharacterStatus[]>([
    monsters[MONSTER_PLAYER],
    monsters[MONSTER_SLIME],
  ]);
  console.log(characters[CHARACTER_MONSTER].aa);

  const [messages, setMessages] = useState<string[]>([]);

  const handleAttack = async () => {
    setMessages(["ゆうしゃ　のこうげき！"]);

    // キー入力を待つ
    await waitForEnter();
    setMessages(["スライム　に3のダメージ！"]);
  };

  return (
    <>
      <div className="container-outer">
        <div className="container">
          <div>{characters[CHARACTER_PLAYER].name}</div>
          <div>
            HP：{characters[CHARACTER_PLAYER].hp}／
            {characters[CHARACTER_PLAYER].maxHp} MP：
            {characters[CHARACTER_PLAYER].mp}／
            {characters[CHARACTER_PLAYER].maxHp}
          </div>

          <div>
            <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
              {characters[CHARACTER_MONSTER].aa}
              （H P：{characters[CHARACTER_MONSTER].hp}／
              {characters[CHARACTER_MONSTER].maxHp}）
            </div>
          </div>
          <div>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
