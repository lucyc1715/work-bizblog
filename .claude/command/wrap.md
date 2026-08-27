---
description: Session 收尾 — commit + push 當前分支（加參數 pr 同時開 PR）
argument-hint: [pr]
---

執行 session 結束的收尾流程。

附加參數：`$ARGUMENTS`

## 步驟

1. **先更新 memory**（一定在 commit 前做，memory 改動要跟這次一起進版）
   - 回顧這個 session，有沒有值得留下的：用戶偏好與回饋(feedback)、專案狀態或決策(project)、外部資源(reference)、用戶本人(user)
   - 先讀 `MEMORY.md` 對照。**已有的更新原檔，不要開重複新檔**；被推翻的舊條目要刪檔，並把 `MEMORY.md` 那一行一起刪掉
   - 新增的要在 `MEMORY.md` 補一行指標：`- [標題](檔名.md) — 一句話鉤子`
   - repo 自己記得的不要寫（程式結構、git 歷史、CLAUDE.md / AGENTS.md 已有的規則）。只留「下次會用到、但看 code 看不出來」的
   - 沒有值得留的就明講「memory 無新增」，不要硬湊
   - **確認 memory 在不在這個 repo 裡**：`ls -ld ~/.claude/projects/<專案 slug>/memory`。
     若是 symlink 指進 repo（例如 `.claude/memory/`），那些檔就是一般追蹤檔，下面的 Stage 要一起加進來；
     若不在 repo 裡，就只是本機更新、不會進 commit，回報時要講明

2. **看現況**（並行跑這三個）
   - `git status`（不要用 -uall）
   - `git diff`（含 staged + unstaged）
   - `git log -5 --oneline`（參考這個 repo 的 commit 風格）

3. **草擬 commit message**
   - 用繁體中文，符合這個 repo 既有風格
   - 聚焦「為什麼」而不是「做了什麼」
   - 1-2 句話講完，不要囉嗦
   - 結尾加上 `Co-Authored-By: Claude <noreply@anthropic.com>`（不寫死模型名，模型會換）

4. **Stage + Commit**
   - 逐一加入相關檔案，不要 `git add .` 或 `git add -A`
   - memory 若在 repo 裡（見 step 1），改動的 `.claude/memory/*.md` 和 `MEMORY.md` 要一起 stage
   - 避開可能含密鑰的檔案（.env、credentials.json、google-services.json、GoogleService-Info.plist 等），若有強烈疑慮先問我
   - 用 HEREDOC 傳 commit message 確保格式正確
   - 跑 `git status` 確認 commit 成功

5. **Push**
   - Push 到當前 branch 對應的 remote
   - 沒設 upstream 就用 `git push -u origin <current-branch>`
   - **Push 失敗（需要 pull/rebase 等）停下來問我，不要 force push**

6. **PR（只在 `$ARGUMENTS` 包含 `pr` 時執行）**
   - 跑 `gh pr create`
   - 標題短（< 70 字元），繁體中文
   - Body 用 HEREDOC：
     ```
     ## Summary
     <1-3 個 bullet>

     ## Test plan
     <bullet 清單，如果是文件/設定改動可寫「N/A — docs/config only」>

     🤖 Generated with [Claude Code](https://claude.com/claude-code)
     ```
   - 完成後回傳 PR URL

## 禁忌

- ❌ 不要 `--no-verify` 或 `--no-gpg-sign`
- ❌ 不要 `--amend` 既有 commit（永遠開新的）
- ❌ Push 失敗不要自作主張 force push 或 reset
- ❌ pre-commit hook 失敗時不要 amend，修完問題後開新 commit

## 沒有東西可 commit 時

如果 `git status` 顯示沒有改動，直接回報「沒有可 commit 的改動」就停，不要建立空 commit。
