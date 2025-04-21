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
