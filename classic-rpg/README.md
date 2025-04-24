# Classic RPG

## メモ

キャラクターのステータスを表示する

```cpp
enum
{
  CHARACTER_PLAYER,
  CHARACTER_MONSTER,
  CHARACTER_MAX
};

CHARACTER characters[CHARACTER_MAX];
```
これは、CHARACTER_PLAYERから順番に0,1,2が入っている。つまり、CHARCTER_PLAYERとCHARACTER_MONSTERは配列のインデックスとして使う。CHARACTER_MAXは配列のサイズを表す。

## リファクタリング

- [x] ESLintの全角文字を使えないルールをオフにする
- [ ] useEffectEventを使ってイベントハンドラを綺麗に書く（experimentalなので、代用する）
- [ ] ループでステートを更新する部分が汚いのでなんとかしたい
- その他気付いたところがあったら直す
