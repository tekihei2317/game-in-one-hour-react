import { useCallback } from "react";
import {
  BattleStatus,
  calculateDamage,
  CHARACTER_PLAYER,
  CharacterStatus,
  SPELL_COST,
} from "./rpg";

type UseBattleInput = {
  characters: CharacterStatus[];
  setCharacters: React.Dispatch<React.SetStateAction<CharacterStatus[]>>;
  setMessages: (messages: string[]) => void;
  setBattleStatus: (status: BattleStatus) => void;
};

type UseBattleReturn = {
  handleCommand: () => void;
};

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

export function useBattle({
  characters,
  setMessages,
  setCharacters,
  setBattleStatus,
}: UseBattleInput): UseBattleReturn {
  const handleCommand = useCallback(async () => {
    let newCharacters: CharacterStatus[] = characters;

    for (const character of characters) {
      if (character.command === "FIGHT") {
        // 攻撃する
        setMessages([`${character.name}の　こうげき！`]);
        await waitForEnter();

        const damage = calculateDamage(character.attack);
        const target: CharacterStatus = {
          ...newCharacters[character.target],
          hp: Math.max(newCharacters[character.target].hp - damage, 0),
        };
        newCharacters = newCharacters.map((char, index) =>
          index === character.target ? target : char
        );
        setCharacters(newCharacters);

        setMessages([`${target.name}に${damage}の　ダメージ！`]);
        await waitForEnter();

        // 倒れた場合の処理
        if (target.hp === 0) {
          if (character.target === CHARACTER_PLAYER) {
            // プレイヤーが倒された場合
            setMessages(["あなたは　しにました"]);
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
        // 呪文（回復する）
        if (characters[CHARACTER_PLAYER].mp < SPELL_COST) {
          setMessages([`MPが　たりない！`]);
          await waitForEnter();

          setBattleStatus("command");
          setMessages([]);
          return;
        }

        setMessages([`${character.name}は　ヒールを　となえた！`]);
        await waitForEnter();

        newCharacters = [
          {
            ...newCharacters[0],
            hp: newCharacters[0].maxHp,
            mp: newCharacters[0].mp - SPELL_COST,
          },
          newCharacters[1],
        ];
        setCharacters(newCharacters);
        setMessages([`${character.name}のきずが　かいふくした！`]);
        await waitForEnter();
      } else {
        // 逃げる
        setMessages([`${character.name}は　にげだした！`]);
        await waitForEnter();
        setMessages([]);
        return;
      }
    }

    // 戦闘が継続する場合、コマンド選択に戻る
    setBattleStatus("command");
  }, [characters, setBattleStatus, setCharacters, setMessages]);

  return { handleCommand };
}
