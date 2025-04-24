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

async function handleAttack({
  setMessages,
  character,
  target,
}: Pick<UseBattleInput, "setMessages"> & {
  character: CharacterStatus;
  target: CharacterStatus;
}): Promise<CharacterStatus> {
  setMessages([`${character.name}の　こうげき！`]);
  await waitForEnter();

  const damage = calculateDamage(character.attack);
  const newTarget: CharacterStatus = {
    ...target,
    hp: Math.max(target.hp - damage, 0),
  };
  setMessages([`${target.name}に${damage}の　ダメージ！`]);

  return newTarget;
}

type TurnResult = {
  status: "nextTurn" | "retry" | "finish";
  characters: CharacterStatus[];
};

/**
 * プレイヤーのターンの処理
 */
async function handlePlayerTurn({
  characters,
  setMessages,
  setCharacters,
}: UseBattleInput): Promise<TurnResult> {
  const [player, monster] = characters;

  if (player.command === "FIGHT") {
    // 攻撃する
    const target = await handleAttack({
      setMessages,
      character: player,
      target: monster,
    });
    setCharacters([player, target]);
    await waitForEnter();

    // 倒れた場合の処理
    if (target.hp === 0) {
      setMessages([`${target.name}を　たおした！`]);

      // モンスターのアスキーアートを消す
      setCharacters(([player, monster]) => [player, { ...monster, aa: "\n" }]);

      await waitForEnter();
      return { status: "finish", characters: [] };
    }
    return { status: "nextTurn", characters: [player, target] };
  } else if (player.command === "SPELL") {
    // 呪文（回復する）
    if (characters[CHARACTER_PLAYER].mp < SPELL_COST) {
      setMessages([`MPが　たりない！`]);
      await waitForEnter();

      setMessages([]);
      return { status: "retry", characters: [] };
    }

    setMessages([`${player.name}は　ヒールを　となえた！`]);
    await waitForEnter();

    const newPlayer = {
      ...player,
      hp: player.maxHp,
      mp: player.mp - SPELL_COST,
    };
    setCharacters([newPlayer, monster]);
    setMessages([`${player.name}のきずが　かいふくした！`]);
    await waitForEnter();

    return { status: "nextTurn", characters: [newPlayer, monster] };
  } else {
    // 逃げる
    setMessages([`${player.name}は　にげだした！`]);
    await waitForEnter();
    setMessages([]);

    return { status: "finish", characters: [] };
  }
}

type MonsterTurnResult = {
  status: "nextTurn" | "finish";
};

/** モンスターのターンの処理 */
async function handleMonsterTurn({
  characters,
  setMessages,
  setCharacters,
}: Pick<
  UseBattleInput,
  "characters" | "setMessages" | "setCharacters"
>): Promise<MonsterTurnResult> {
  const [player, monster] = characters;

  if (monster.command !== "FIGHT") {
    console.log("モンスターはこうげき以外できません");
    return { status: "finish" };
  }

  // 攻撃する
  const newPlayer = await handleAttack({
    setMessages,
    character: monster,
    target: player,
  });
  setCharacters([newPlayer, monster]);
  await waitForEnter();

  // プレイヤー倒れた場合の処理
  if (newPlayer.hp === 0) {
    setMessages(["あなたは　しにました"]);
    return { status: "finish" };
  }

  return { status: "nextTurn" };
}

export function useBattle({
  characters,
  setMessages,
  setCharacters,
  setBattleStatus,
}: UseBattleInput): UseBattleReturn {
  const handleCommand = useCallback(async () => {
    const playerTurnResult = await handlePlayerTurn({
      characters,
      setMessages,
      setCharacters,
      setBattleStatus,
    });
    if (playerTurnResult.status === "finish") {
      return;
    } else if (playerTurnResult.status === "retry") {
      setBattleStatus("command");
      return;
    }

    const monsterTurnResult = await handleMonsterTurn({
      characters: playerTurnResult.characters,
      setMessages,
      setCharacters,
    });
    if (monsterTurnResult.status === "finish") {
      setBattleStatus("end");
    } else {
      setBattleStatus("command");
    }
  }, [characters, setBattleStatus, setCharacters, setMessages]);

  return { handleCommand };
}
