import { useEffect } from "react";

/** 戦闘中の状態（戦闘開始、コマンド選択中、コマンド選択後、戦闘終了） */
type BattleStatus = "start" | "command" | "command_selected" | "end";

type UseKeyboardEventInput = {
  /** 戦闘フェーズ */
  battleStatus: BattleStatus;
  /** コマンドを決定したときの処理 */
  handleCommand: () => void;
  /** コマンドを選択しているときの処理 */
  updateCommandIndex: (direction: "up" | "down") => void;
  /** コマンドの選択を開始したときの処理 */
  startCommandSelection: () => void;
};

export function useKeyboardEvent({
  battleStatus,
  handleCommand,
  startCommandSelection,
  updateCommandIndex,
}: UseKeyboardEventInput): void {
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (battleStatus === "start") {
        if (e.key === "Enter") {
          startCommandSelection();
        }
      } else if (battleStatus === "command") {
        // カーソルキーでコマンドの選択を切り替える
        if (e.key === "ArrowDown") {
          updateCommandIndex("down");
        } else if (e.key === "ArrowUp") {
          updateCommandIndex("up");
        }

        // エンターキーを押すと、現在選択しているコマンドを実行する
        if (e.key === "Enter") {
          handleCommand();
        }
      }
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);

    // TODO: エフェクトをリアクティブにする必要はないので、依存配列を空にしたい
  }, [battleStatus, handleCommand, startCommandSelection, updateCommandIndex]);
}
