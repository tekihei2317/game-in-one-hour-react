import { useState } from "react";
import {
  CHARACTER_PLAYER,
  CharacterStatus,
  MONSTER_PLAYER,
  monsters,
} from "./core";
import "./App.css";

function App() {
  // プレイヤーのステータスを初期化する
  // ↑これstateで持つのかrefで持つのかどっちがいいんだろうね...
  const [characters, setCharacters] = useState<CharacterStatus[]>([
    monsters[MONSTER_PLAYER],
  ]);

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
        </div>
      </div>
    </>
  );
}

export default App;
