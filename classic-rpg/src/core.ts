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
export const monsters: CharacterStatus[] = [
  {
    hp: 15,
    maxHp: 15,
    mp: 15,
    maxMp: 15,
    name: "ゆうしゃ",
    aa: "",
  },
  {
    hp: 3,
    maxHp: 3,
    mp: 0,
    maxMp: 3,
    name: "スライム",
    aa: `／・Д・＼
～～～～～`,
  },
];
