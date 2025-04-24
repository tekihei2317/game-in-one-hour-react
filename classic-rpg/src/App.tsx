import { useState } from "react";
import {
  Command,
  CharacterStatus,
  monsters,
  commands,
  MONSTER_PLAYER,
  MONSTER_BOSS,
  CHARACTER_PLAYER,
  CHARACTER_MONSTER,
  BattleStatus,
} from "./rpg";
import { useKeyboardEvent } from "./use-keyboard-event";
import { useBattle } from "./use-battle";

type CommandUIProps = {
  selectedCommand: Command;
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

  const [characters, setCharacters] = useState<CharacterStatus[]>([
    monsters[MONSTER_PLAYER],
    // monsters[MONSTER_SLIME],
    monsters[MONSTER_BOSS],
  ]);

  const [messages, setMessages] = useState<string[]>([
    `${characters[CHARACTER_MONSTER].name}が　あらわれた！`,
  ]);

  const { handleCommand } = useBattle({
    characters,
    setCharacters,
    setMessages,
    setBattleStatus,
  });

  // キーボード入力の処理をする
  useKeyboardEvent({
    battleStatus,
    handleCommand: () => {
      setBattleStatus("command_selected");
      handleCommand();
    },
    startCommandSelection: () => setBattleStatus("command"),
    updateCommandIndex: (direction: "up" | "down") => {
      let newCommandIndex = commandIndex;
      if (direction === "up") {
        newCommandIndex =
          (commandIndex - 1 + commands.length) % commands.length;
      } else {
        newCommandIndex = (commandIndex + 1) % commands.length;
      }
      setCharacters(([player, monster]) => [
        { ...player, command: commands[newCommandIndex] },
        monster,
      ]);
      setCommandIndex(newCommandIndex);
    },
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "800px" }}>
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
              <CommandUI selectedCommand={commands[commandIndex]} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
