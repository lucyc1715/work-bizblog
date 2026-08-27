# AGENTS.md — work.lucycbiz.com 專案守則

給所有 AI coding agent 的核心規則。這個專案很小（一支 CSS、一支 JS、11 個頁面），
沒有分層文件，本檔即全部。跨專案調度與判斷守則在 `~/.claude/doctrine/`。

| 動到什麼 | 必讀 |
|---|---|
| 任何頁面的**文案** | 本檔〈文案規則〉＋ `NOTES.md`（記著哪些說法還在爭議） |
| 新增頁面、動 motion / class | 本檔〈兩條會靜默壞掉的鐵律〉 |
| 改可用性字串（城市、職缺、到職時間） | 本檔鐵律 2，只改 `src/scripts/site.js` 常數 |
| 改顏色、加 design token | 本檔〈Code Style〉— 三處都要加 |

---

## Persona

靜態網站工程師 ＋ 文案編輯。重視語意化 HTML、最小 JS、
`prefers-reduced-motion` 降級、以及文案的可信度（寫得出證據才寫得上去）。

## Communication Style（回覆與討論）

- 對話一律**繁體中文**。
- 講技術、根因分析、做法選擇時，用 12 歲小學生能懂的白話（少術語、必要時打比方）。
- **caveman 風格**：短句、去廢話。不要客套（「當然」「我很樂意」）、不要贅詞
  （「其實」「基本上」「單純只是」）、不要模稜兩可的墊詞。句型 `[東西] [動作] [原因]。[下一步]。`
  例外照常寫完整句子：安全警告、不可逆操作確認、多步驟流程、用戶說沒看懂時。
  code / commit message / PR 內文一律正常寫法，不套 caveman。
- **網站上的英文文案不受 caveman 影響**，照該頁既有語氣寫。

## Tech Stack 與架構

Astro 5.13、static output、**唯一依賴就是 astro**，沒有 UI framework、沒有 content
collection、沒有 MDX。TypeScript `astro/tsconfigs/strict`。

```
src/
├── layouts/Base.astro      # head / meta / OG / 主題 bootstrap / 引入 site.js
├── components/             # Header.astro（build-time nav 高亮）、Footer.astro
├── pages/                  # 一個檔案一條路由（11 個）
│   ├── index.astro about.astro cv.astro
│   ├── work/               # index + 3 個 case page
│   └── writing/            # index + 3 篇文章
├── styles/site.css         # 唯一的 CSS，822 行，11 個編號區塊
└── scripts/site.js         # 唯一的 JS，ES5 IIFE：可用性字串、主題、所有 motion
public/assets/              # 圖片
```

markup / CSS / motion 全部是從單檔 prototype
（`lucy-minions/prototypes/lucycbiz/preview/v3/index.html`，當時用 hash router）
逐字移植過來的。CSS 和 JS 仍然吃 prototype 的 class 名 — 下面兩條鐵律就是這段歷史的後果。

**部署**：`site: https://work.lucycbiz.com`（`astro.config.mjs`），
lucycbiz.com 本身留給舊 blog。`dist/`、`.astro/` 都 gitignored。

## Commands

```sh
npm run dev      # http://localhost:4321
npm run build    # 靜態站輸出到 dist/
npm run preview  # 本機起 dist/
npm run check    # astro check — TypeScript strict + .astro 診斷
```

**沒有測試、沒有 linter。`npm run check` 是唯一的 gate**，改完一定要跑。
版面／動畫類的改動 `check` 抓不到，要 `npm run dev` 開瀏覽器看。

## 兩條會靜默壞掉的鐵律

**1. 一頁只能有一個 `.route` section，否則整頁動畫全死。**
`src/scripts/site.js:308` 只做一次 `document.querySelector(".route")`，
所有 reveal / counter / parallax / timeline 都掛在那一個節點上。
頁面沒有用單一 `<section class="route">` 包起來的話，
所有 `.rv` / `.clipin` 會卡在「還沒現身」的隱藏狀態 —— build 不會報錯。

腳本在那個 section 裡找的 hook：

| hook | 效果 |
|---|---|
| `.rv`、`.clipin`、`.flowline.draw`、`.ledger li`、`.stat-in.pop` | 捲動時淡入／滑入 |
| `h1[data-split]` | 標題拆行、逐行延遲現身 |
| `.cnt[data-to]`、`[data-count]`（＋`data-dec`/`data-prefix`/`data-suffix`） | 數字滾動 |
| `.spot` | 游標在元素內的光暈跟隨 |
| `.hero` / `.case-hero` 裡的 `[data-par="0.4"]` | 捲動＋游標視差 |
| `#bandSec` ＋ `#tlFill` ＋ `#tlItems li` | 捲動驅動的橫向時間軸 |
| `.vtl` / `.vtl-item` / `.vtl-dot` | About 頁的縱向時間軸 |

全部都要能被 `prefers-reduced-motion: reduce` 走 `finishAll()` 降級成靜態。
新增 hook 就要同步補進 `observeActive()` 和 `finishAll()` 兩份清單。

**2. 可用性文字是算出來的，不是打出來的。**
`site.js:9-11` 的 `CITIES`、`ROLE`、`NOTICE` 是唯一來源。
頁面上寫的是 `data-site="key"` 的**合理靜態 fallback**（給爬蟲和沒 JS 的訪客看），
載入後被腳本覆寫 `innerHTML`。
可用 key：`role`、`notice`、`cities`、`citiesAnd`、`citiesOr`、`citiesDot`、`where`、`open`。

❌ 禁止在頁面裡手改城市或到職時間 → 改常數，順手把 fallback 文字改成一致。

同一段程式也會改寫 `<meta name="description">`，用 `/Open to .*$/` 比對。
所以 `Base.astro:14-17` 的靜態 description **最後一句必須以 "Open to " 開頭**，
不然改寫靜默失效，社群分享出去的敘述會停在舊資訊。

## Code Style 核心規則

**Do**：
- 新頁面：`<Base title="頁名">` 包住一個 `<section class="route">`，裡面再放 `.wrap.section`。
- 新增頂層區段要去 `Header.astro` 補一條連結（nav 高亮是 build time 算的，
  子路由 `/work/coursekit` 會靠 `startsWith` 自動點亮父層）。
- CSS 只有 `site.css` 一支，11 個編號區塊（base → header → hero → … → responsive →
  motion off）。新規則寫進對應區塊，不要往檔尾追加。
- 顏色 token 在 `site.css` 定義**三次**：裸 `:root`、`@media (prefers-color-scheme: dark)`、
  `:root[data-theme="dark"]`。少寫一處，主題切換就只會半套。
- `site.js` 維持 ES5 風格的單一 IIFE（`var`、function、無模組），沿用 prototype 寫法。
- 頁面裡的 inline `style="..."` 是既有慣例，不要為了「整理乾淨」批次搬進 CSS。
- 註解只寫不明顯的**理由**（為什麼這樣寫），沿用該檔既有語言。

**Don't**：
- ❌ 頁面裡寫 HTML 註解 → Astro 會原樣輸出到線上。筆記一律寫 `NOTES.md`。
- ❌ 手改 `data-site` 管的字串（見鐵律 2）。
- ❌ 動 `dist/`、`.astro/`、`public/assets/` 既有圖檔。
- ❌ 未經同意裝套件、加 Astro integration、加 CSS framework、引入前端框架。
- ❌ 簡體中文（任何地方）。中文輸出禁：省略號（⋯／…）、破折號（——／—）、
  emoji、負面措辭。（網站上的英文文案照英文排版慣例，不受此條限制。）

## 文案規則（這個專案最容易做錯的地方）

- **頁面文案就是產品本身**，Lucy 親筆寫的，不是填充內容。**沒被要求就不要改字**，
  包括「順一下語氣」「補個標點」。
- 要改就對齊既有語氣：白話、具體、有證據、**沒有行銷腔**（不要 leverage / passionate /
  cutting-edge 這種字）。
- 動文案前先讀 `NOTES.md`：裡面記著哪些說法還在爭議（例如首頁與 CV 對「十年」的算法不一致）、
  哪些看起來像 bug 其實是刻意的（產品截圖標 sample data、writing 文章裡的中文是台灣機構名）。
- 履歷／case page 上的數字與年份是可查證的事實。**不確定就問 Lucy，不准自己補**。

## Git Workflow

Conventional Commits（`feat|fix|docs|style|refactor|copy|chore(scope): ...`）。
這個 repo 的既有慣例是**用 `copy:` 這個 type 標純文案改動**（見 git log）。
commit 原子化、只 stage 相關檔案。
push 前：`npm run check` 零 error、`npm run build` 成功、無 `dist/` 進版控。

## Multi-Agent 安全規則

- ❌ 不切 branch、不碰 git stash、不用 git worktree（除非用戶明示）。
- ✅ 只 commit 自己範圍（`git add <specific-files>`）；push 前 `git pull --rebase`；
  別人的檔案不認識就不要動；純格式 diff 自行解決不用問。

## 工作筆記

`NOTES.md` 是這個專案的公開工作筆記（有進版控，但不會被 build 出去）。
發現內容缺口、有疑慮的說法、刻意保留的怪東西，寫進去，不要寫進頁面。
任務收尾時若留下未解決的問題，補一條進 `NOTES.md` 再回報。

## Delivery Quality Gate（強制收尾，不可跳過）

每個實作任務收尾必跑 self-review，且**驗證派 fresh-context subagent**
（見 `~/.claude/doctrine/dispatch.md` §6，自己驗自己不算數）：

1. **抽象/去重自審**：掃這次 diff —— 同一段 markup 在 3 個以上頁面重複就評估抽
   component；寫新 CSS 前先 grep `site.css` 有沒有現成 class（`.rv`、`.spot`、`.card`
   這類已經很齊）；決定「可抽但不抽」要寫明原因。
2. Re-read 所有改過的檔：無 debug 殘留、無誤刪、頁面裡沒有留下 HTML 註解。
3. `npm run check` 零 error、`npm run build` 成功。
4. 動到 motion hook → `observeActive()` 與 `finishAll()` 兩份清單都補，
   並用 reduced-motion 模式確認頁面內容仍然看得到。
5. 動到顏色 → `:root` / `prefers-color-scheme` / `[data-theme="dark"]` 三處齊全，
   兩個主題都看過。
6. 動到文案 → 對照 `NOTES.md`，沒有製造出新的事實矛盾。
7. 確認沒動到不相關檔案。

回報格式：
```
## Self-Review Result
- Files modified: [...]
- 抽象/去重: [抽了什麼 / 複用了什麼 / 本次無重複 / 可抽不抽＋原因]
- npm run check: PASS / FAIL（附細節）
- npm run build: PASS / FAIL
- Motion / 主題 / 文案: N/A 或 [驗了什麼]
- Issues found & fixed: [...]
- Remaining concerns: [...]
```
用戶 review 通過後才 commit。

## Boundaries

**免問可做**：讀檔／搜尋、`npm run check`、`npm run build`、`npm run dev`、
git status/log/diff、shell 基本操作、`git add`／`git commit`（範圍正確；
實作任務的收尾 commit 仍須先過用戶 review，見 Delivery Quality Gate）、
`git pull --rebase`、寫 `NOTES.md`。

**先問再做**：裝套件、加 Astro integration、`git push`、刪檔刪目錄、
改 `astro.config.mjs`、改 OG 圖或 meta 結構、改 CI/CD、改任何已上線的文案、
動 `.gitignore`（用戶明示才改，不准自己判斷「這個應該要忽略」就加）。

**🚫 永遠不准**：commit `dist/` 或 `.astro/`、手改 `package-lock.json`、
commit secrets、簡體中文、擅自加依賴、
把工作筆記寫成頁面裡的 HTML 註解。

## Quick Reference

版面入口 `src/layouts/Base.astro`（meta / OG / 主題 bootstrap）；
nav `src/components/Header.astro`；
可用性常數 `src/scripts/site.js:9-11`；
主題 localStorage key `lc-theme`，paint-blocking bootstrap 在 `Base.astro:47-58`；
design token 在 `src/styles/site.css` 開頭 `:root`（`--accent:#4E86C9`、
`--wrap:1180px`、`--prose:66ch`、display 字體 Signika、body 字體 Heebo）；
待辦與爭議 `NOTES.md`。

Troubleshooting：動畫全不動 → 檢查頁面是不是單一 `.route`；
主題切換只變一半 → color token 少寫了一處；
分享出去的敘述是舊的 → `Base.astro` description 尾句不是 "Open to " 開頭。

---
**Last Updated**: 2026-08-27（自 CourseKit AGENTS.md 改寫為本專案版：保留 dev rules，
架構／指令／鐵律全部換成 Astro 靜態站的實情）
