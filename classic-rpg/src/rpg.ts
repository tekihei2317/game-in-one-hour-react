/** プレイヤーが選択するコマンド（戦う、呪文、逃げる） */
export type Command = "FIGHT" | "SPELL" | "RUN";
export const commands: Command[] = ["FIGHT", "SPELL", "RUN"];

/** 呪文の消費MP */
export const SPELL_COST = 3;

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
export const MONSTER_BOSS = 2;
export const MONSTER_MAX = 3;

export const CHARACTER_PLAYER = 0;
export const CHARACTER_MONSTER = 1;
export const CHARACTER_MAX = 2;

/**
 * モンスターのステータスの配列
 */
export const monsters: CharacterStatus[] = [
  {
    hp: 100,
    maxHp: 100,
    mp: 100,
    maxMp: 15,
    name: "ゆうしゃ",
    aa: "",
    command: "FIGHT",
    target: CHARACTER_MONSTER,
    attack: 200,
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
  {
    hp: 255,
    maxHp: 255,
    mp: 0,
    maxMp: 3,
    name: "まおう",
    aa: `　　Ａ＠Ａ
ψ（▼皿▼）ψ`,
    command: "FIGHT",
    target: CHARACTER_PLAYER,
    attack: 50,
  },
];

export function calculateDamage(attack: number): number {
  return 1 + Math.floor(Math.random() * attack);
}

/** 戦闘中の状態（戦闘開始、コマンド選択中、コマンド選択後、戦闘終了） */
export type BattleStatus = "start" | "command" | "command_selected" | "end";
