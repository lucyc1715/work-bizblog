# Recruiter-first rewrite 改動紀錄

工作日誌，給 Lucy review 用。隨改版一起 commit（/wrap 指示），review 完可以直接刪。

驗證方式說明：每頁做完都跑 `npm run build`，版面類改動另外用 Playwright
實際量測像素（不靠眼睛看），關鍵頁再派 fresh-context subagent 獨立驗收。
`npm run check` 跑不了（`@astrojs/check` 沒裝，NOTES.md 已記錄），
所以 `npm run build` 是唯一能跑的 gate。

---

## 決策紀錄（跟原始 prompt 不一致的地方，都是你拍板的）

| 項目 | 決定 | 誰決定 |
|---|---|---|
| 首頁 H1 | 不用 prompt 的 "Lucy Chen"，改用 Maximilian 口吻的平鋪句 | 你選 A |
| About 版面 | 保留現有 dual-matrix，不改成 8 條 role 時間軸 | 我建議、你採納 |
| 到職時間 | 維持 4 weeks，不改成 prompt 寫的 8–12 weeks | 你 |
| CV 內容 | 加一行量化重點，原 bullet 全部保留（不砍成一行） | 你 |
| Course Kit 迭代數 | 8 → 13 releases in 8 months | 你 |
| `agent-engineering.astro` | 完全不碰 | 你 |
| commit | 不 commit，等你 review | 你 |

---

## 1. 首頁 `src/pages/index.astro`

**H1**
- 舊：`I have led nine engineers, and shipped a product with no team at all`
- 新：`I have built software inside a bank. And I have built a product on my own.`
- 換掉的原因（你說「這句怪怪的」，我拆出三點）：
  1. 框架是「矛盾式自誇」，要讀者欣賞反差，不是 Maximilian 的路子
  2. `with no team at all` 講的是「缺少」不是「能力」，而且文法上最近的名詞是
     `a product`，第一眼會讀成「這個產品沒有團隊」
  3. `at all` 是純情緒強調詞，沒帶資訊
- 兩處微調（我做的，不是你選的 A 原文）：
  - `I've` → `I have`。全站 grep 過零縮寫（`I have led`／`I have been`／`I have sat`），
    只有首頁縮寫會破一致性
  - `built one` → `built a product`。`software` 不可數，後面接 `one` 沒有可數先行詞

**Standfirst**：`Ten years in software. Three inside a licensed bank. One product, zero to paying users, alone.`

**KPI band**（新，`.nums` 重做）
- 位置搬到 hero 正下方，招募者先撞到數字
- 四格：`10` yrs in software／`3` yrs in a licensed bank／`350+` paying users, shipped solo／`9+5` engineers and vendors led
- 樣式：4 欄、格間直向髮絲線、上下橫線、數字改 accent 色
- RWD：4 欄 → 2 欄（900px）→ 1 欄（460px），每排第一格的左側線要拿掉

**刪掉的舊 stat**：原 `.nums` 的 `350+ users` / `100+ monthly actives` / `3 payment rails`。
後兩個跟 Course Kit 案例頁重複（prompt 要求移除跟 Work 頁重複的數字）。

**狀態圓點**：Now, August 2026 三張卡的標籤前加圓點。
Shipping = 琥珀（即將）、Current Role / Availability = 綠（進行中）。

**順手修的既有 bug（不是我這次弄出來的）**
1. `--rail-past` 漏寫在 `:root[data-theme="dark"]`，手動切暗色時 About 頁時間軸軌道會停在亮色。三處補齊
2. 頁面裡一行 HTML 註解會被 Astro 原樣送上線（AGENTS.md 禁止），清掉

**驗證**：subagent 8 項全 PASS。含 `9+5` 兩個 `.cnt` 各自跑數字動畫、
reduced-motion 走 `finishAll()` 仍看得到、RWD 兩斷點直線正確換邊。

---

## 2. About `src/pages/about.astro`

**開場前先講一個發現**：`.vtl` 縱向時間軸和箭頭圖**本來就存在**
（`about.astro:114` 和 `:229`），所以 prompt 說「要做」的東西有一半已經在了，
實際範圍比原估小很多。

**H1**：`Two industries, one lesson.`
**Standfirst**：`Music taught me how people get paid for their work. Banking taught me how to build the rails. Both taught me to answer for what I ship.`

**Pull-quote**（新共用元件 `.pullquote`）
- 舊的 `.dual-synthesis` 是藍底圓角卡片加一個箭頭圖示方塊
- 新的是左側一條 accent 直線加放大字，**沒有卡片沒有陰影**（版面分段一律交給髮絲線）
- 文字換成 prompt 指定的 "Why this mix matters..." 那段
- 這個元件 Vibe Code Home 頁會再用一次（一開始就設計成共用）

**概念對映**（`.concept-bridge` → 新的 `.xwalk`）
- 舊：三格橫排，每格塞一坨概念
- 新：兩欄逐列配對，左音樂右金融，中間 CSS 畫的髮絲箭頭
  - Copyright splits → Multi-party rights verification
  - Mechanical licensing → Distribution pipelines
  - Royalty accounting → Stripe, Apple and Google entitlement schema

**時間軸**：Rakuten 2021–2024 節點加 accent 色。原本是灰的，
全站最強的證據卻最不顯眼。

**狀態圓點**：Right now 三張卡補上，跟首頁一致。

**不動的**：dual-matrix（銀行 vs 個人接案兩欄卡）、招募者對照表。

**刪掉的死 CSS**：`.dual-synthesis`／`.syn-icon`／`.concept-bridge`／`.bridge-node`／
`.bridge-arrow` 五個 class 只有這頁在用，一併移除，驗過 css 與 pages 都 0 命中。

**subagent 抓到一個真 bug，已修**
手機版箭頭原本用 `transform: rotate(90deg)`。`transform` 不佔 layout box，
格子只留 19px 高、旋轉後的線往下畫 26px，會壓到下一列文字（該列換行時更慘）。
改成直接畫真的直線加朝下三角形，layout box 誠實，結構上不可能重疊。

**內容修正**：`13 releases in 8 months`（原 8）、FintechLife 那行補上 monorepo。

---

## 3. CV `src/pages/cv.astro`

**H1**：`Ten years, in timeline form.`
**Standfirst**：`Every line below shipped to production. Ten years of it, three of them inside a licensed bank, then one product taken from zero to paying users alone.`

**經歷改成時間軸**（新 `.cvtl`）
- 7 個各自獨立的 `<div>` → 一條 `<ol class="cvtl">`，左欄日期加軌道加節點
- Rakuten 與兩份現職的節點上 accent 色
- 每個職位加一條 `.cvtl-impact` 一行量化重點，**原 bullet 一條都沒刪**

七條一行重點：
| 職位 | 重點句 |
|---|---|
| LZpreneur | Shipped Course Kit alone to 350+ users on iOS, Android and web, with three payment rails live in production. |
| FintechLife | Cut feature delivery from 3 days to 1 day, on a platform that passed its external PCI DSS assessment. |
| London | Built real-time interfaces for a London gaming platform in React, TypeScript, Redux and WebSocket. |
| Rakuten | Led 9 engineers and 5 vendors to 100% on-time quarterly delivery, and closed 15 of 15 PwC audit findings. |
| Shengsen | Cut manual team coordination by 40% with a DHL-integrated logistics system in React and TypeScript. |
| Wistron | Lifted system test coverage by 30% with 200+ manual and automated test cases. |
| Smart Catch | Built the back end, front end and shared modules of a parking payment system for New Taipei City. |

**新增 bullet**：FintechLife 加 Monorepo Consolidation
（兩個大型 Vue admin、500+ 元件併成一個 monorepo，共用元件與 build config 只要改一次）。
放在 PCI DSS 之後、AI 工作流之前。

**一行重點句沒換成 monorepo**：現在那句有兩個硬數字加一個合規背書，
對 FDE 職缺比 monorepo 有力。monorepo 當支撐 bullet。你覺得該換再說。

**到職時間**：維持 4 weeks，走 `data-site="open"` 插槽，沒有手打（AGENTS.md 鐵律 2）。

**列印 CSS**（招募者會印 CV）
- 強制展開捲動才現身的區塊，否則整頁下半段印出來是空白
- 去底色去陰影、連結轉黑、徽章轉白底黑字
- 表格從窄視窗的橫向捲動容器收回 `display:table`，紙上沒有捲動這回事
- `@page{margin:14mm}`、標題不與內文分頁
- 只擋比一頁小的區塊分頁，整段經歷不擋（長的那段會擠出一整頁空白）

**emoji 換 inline SVG**：技能矩陣四個分類圖示（原本是 emoji）。
`.pill-i` 那段 CSS 的註解本來就寫著「emoji 不吃主題色」，這四個是漏網的。
全站已無 emoji。

**subagent 抓到兩個真 bug，已修**
1. 內容遺失：倫敦那段 bullet 收成一行時把 **Redux** 弄丟，全頁再無他處出現。補回
2. 列印會印白紙：`.route` 預設 `display:none` 靠 JS 加 `.active`，
   原本列印 CSS 也照抄這個條件，JS 沒跑完按列印等於一整張空白。
   改成列印時無條件 `display:block`

**HTML 結構驗證**：手改上百行巢狀標籤最容易在這裡爆，所以要求機器驗不准用眼睛看。
subagent 用 `HTMLParser` 實際解析 build 出來的 `dist/cv/index.html`：
0 個未閉合、0 個錯配（`ol` 1/1、`li` 20/20、`div` 43/43）。

---

## 4. 時間軸圓點對齊（你回報「還是沒對齊」之後的修正）

**我第一次量錯了，先講這個。**
`getComputedStyle().width` 在 content-box 下不含邊框，我的公式沒加回去，
算出假的「對齊」。用錯的尺量，量幾次都對。

**真正的根因**：`*{box-sizing:border-box}` **選不到虛擬元素** ，
CSS 的 `*` 不匹配 `::before`／`::after`。那兩個圓點一直是 content-box：
寫 `width:12px` 加 `border:2px`，實際渲染 16px，圓心右偏 2px。
軌道是純色細條沒有邊框，不受影響，所以只有圓點跑掉。
外層的點是真的 `<span>`，`*` 選得到，所以外層一直是對的。

**三處改**
1. `site.css:86` `*` → `*,*::before,*::after`（漏掉的標準 reset）
2. `.emp-role::before` 改 10px、`left:-26px`
3. `.vtl-roles::before` 軌道 `left:3px` → `3.5px`

**另外拿掉**：`.cvtl-impact` 的左側 accent 邊框。
它在 x=209、內層軌道在 x=213，**差 4px**，近到會被讀成同一條軌道畫歪了。
這條線本來就不該存在（prompt 規則：accent 只用在 KPI 數字、時間軸節點、連結、狀態點）。
改用字級與字重做強調。

**重量結果（小數點後兩位零誤差）**

| CV | 中心 x |
|---|---|
| 外層軌道 / 圓點 | 174.00 / 174.00 |
| 內層軌道 / 兩個圓點 | 213.00 / 213.00 / 213.00 |

| About | 中心 x |
|---|---|
| 主時間軸軌道 / 9 個圓點 | 146.00 / 全部 146.00 |
| 內層軌道 / 兩個圓點 | 180.50 / 180.50 / 180.50 |

About 頁那條有同樣的 bug，只是偏 2.5px 比較不明顯，一併修好。

---

## 5. Work index `src/pages/work/index.astro`

**H1**：`Both sides of the table.`
**Standfirst**：`I ran vendor delivery inside a licensed bank, where the requirements belonged to someone else and the deadline belonged to a regulator. Then I built my own product, where every consequence was mine.`
（原本開頭那句 `I have sat on both sides of a deployed engineering engagement.`
跟新 H1 重複，刪掉。）

**卡片圖片：先做了，後來依你的指示全部移除。最終狀態見第 11 節。**
下面這段留著只是紀錄過程，**已經不是現況**。

原本照 prompt 給三張卡各加了一張圖與圖說（Course Kit 用 `shot-self-list.png`、
VCH 用 `vch-site.png`、銀行因為沒有可公開的畫面所以放事實面板）。
你回報「太滿」之後全部拿掉，`.dcard-fig` 相關 CSS 也一併刪乾淨。

過程中量測抓到一個 bug 值得記著，因為同樣的陷阱以後還會遇到：
三張圖高度量出來是 **700 / 1600 / 189.6**，完全沒對齊。
原因是 `aspect-ratio:16/10` 被 `<img>` 的 `height` 屬性擋掉了。
`height` 屬性會變成 presentational hint，寬高都確定時 `aspect-ratio` 直接失效，
要補 `height:auto` 才會生效。

**命名**：平台卡的內文改成 `The ecosystem layer Course Kit plugs into.`
（照 prompt 指定的說法）。全站 "Course Kit" 兩個字的寫法已經一致，grep 過沒有 CourseKit 單字版。

---

## 6. 銀行案例 `src/pages/work/licensed-bank-delivery.astro`

**H1**：`Three years inside a licensed bank.`
**Standfirst**：`Regulator-set rules, five vendors I could not manage, and an audit at the end. Here is what my team shipped anyway.`
（prompt 原文寫 `couldn't`／`Here's`，改成不縮寫，跟全站一致。）

**開場段縮到兩句**，三個限制條件抽成卡片：
| | |
|---|---|
| Constraint 1 · The regulator | Taiwan's FSC sets what the system has to do. Not how, and not on a timetable that suits you. |
| Constraint 2 · The operations department | Operations owns the requirements, and hands them over in the language of regulation rather than features. |
| Constraint 3 · Five vendors, one of them IBM | They deliver pieces you depend on and do not manage. You carry the deadline either way. |

**這一步同時解決了 prompt 要求的「不要重複講述」。** 原本那個位置是
`.step-pipeline` 三格（FSC Regulations & Ops／Team Lead & 5 Vendors／PwC Audit & Production），
內容跟頁尾 FDE 表格的三列逐句重複。換成限制條件卡之後內文不再與表格重複。

**KYC 段落改寫**（照 prompt，另加半句白話解釋 KYC 是什麼，這是 prompt 自己的用語規則）：
> My main job was KYC re-verification, the check a bank has to repeat on customers it onboarded years ago.
> When I joined, staff still chased those customers by hand. I built the system that sorts them into
> 1, 3, or 5-year cycles based on their money-laundering risk score, and it passed Taiwan's FSC review
> and went live. That "accepted into production" line sounds boring until you have tried to get there.

**量化徽章**：三張卡各自的第一顆徽章改成 prompt 指定的量化說法 ：
`FSC accepted`／`Reused across 4 modules`／`15/15 PwC findings closed`。

**before/after 元件**：這頁本來就在用共用的 `.before-after-grid`，不用改。

**hero 事實清單移除一列**：`Time to first PR 3 weeks → 2 days` 跟下面的 before/after 元件重複。

**CSS 重用**：限制條件卡沿用現成的 `.step-pipeline`／`.step-item`／`.step-title`／`.step-desc`，
只新增一個 `.constraint-k` 標籤 class（它們之間沒有先後關係，所以不用編號圓圈）。

---

## 7. Course Kit 案例 `src/pages/work/coursekit.astro`

**H1**：`Zero to 350+ paying users, alone.`
**Standfirst**：`A coach sells lessons in blocks of sessions. What happens next is everything I designed, built — and got wrong once.`

**產能決策改寫**（照 prompt）：
> Two native apps plus a custom backend is three full-time jobs, and there was only one of me.
> So I cheated smart: one Flutter codebase for both app stores, and managed GCP services that
> keep the lights on while I sleep.

**失誤段改寫**（照 prompt）：
> Here is where I got it wrong the first time: I drew my data boundaries by feature, not by plan.
> Then self-recording users asked for multi-device sync, and that one decision cost me a 2.5-week
> migration. An expensive lesson — but you only need to learn it once.

**架構圖：擴充既有的，不新增第二張。** prompt 要一張
「phones + web storefront + 3 payment rails → Cloud Functions → Firestore」的圖，
但這頁本來就有一張 `.railfig` SVG 在畫「三條金流 → 一個 schema」。
再加一張會是同一條流程講兩次，所以把既有那張擴充成完整版：
左邊三格各標「金流 + 對應的客戶端」（Apple IAP / iOS app、Google Play / Android app、
Stripe / Web store），中間加一個 **Cloud Functions** 節點，右邊 Firestore entitlement。
動畫 class（`.flowline.draw`）原樣保留，捲動描線仍然會動。
圖說：`Every purchase lands in the same schema, whichever rail it came through.`

**量測抓到一個 bug，已修**：兩個左側標籤超出 viewBox 被裁掉
（`Web storefront` 被切掉 33 個單位）。擴大 viewBox 並把最長的標籤縮短成 `Web store`。
修正後重量：**零溢出**，最小字級 9.7px（sub 標籤是全大寫，可讀）。

**V1/V2 架構表**：不動。

---

## 8. Vibe Code Home `src/pages/work/vibe-code-home.astro`

**H1**：`The layer that lets makers get paid.`
**Standfirst**：`Course Kit runs on it with real users and real money in production. Now opening to the first ten seed creators.`

**開場改寫**（照 prompt）：
> Plenty of people can build a side project. Very few can take money for it safely.
> Vibe Code Home is the layer that closes that gap — and Course Kit runs on it,
> with real users and real money, so I know it holds.

**兩格邊界圖**（新 `.boundary`，純 CSS 不畫 SVG）：
左格 Course Kit project（Apple／Google 收據在自己的 Firebase 後端驗證），
右格 Platform project（Stripe checkout 在平台端），中間一條虛線就是專案分界。
圖說：`Two projects on purpose. Neither one can quietly overwrite the other's receipts.`
手機版虛線轉成橫的。

**收尾段改 pull-quote**：重用 About 頁建立的 `.pullquote` 元件（這就是當初設計成共用的原因）。

**Highest Tier Wins vs Last Write 表**：不動。

**順手修的既有 bug**：步驟卡的圓圈編號跟標題文字的「1.」「2.」「3.」重複，
等於同一個號碼印兩次。標題的數字前綴拿掉。

---

## 9. Writing 索引 `src/pages/writing/index.astro`

**H1**：`How things get built — and how people get paid.`
**Standfirst**：`Software engineering and the music business look unrelated. They are both stories about distribution and rights.`
**iThome 鐵人賽徽章**：加 `30 posts · 30 days` 綠色徽章。
三張音樂文章卡：不動。

---

## 10. 長文三篇

**錨點目錄**：三篇都加了 `.toc`（純文字、上下髮絲線、不做成卡片）。
prompt 只點名第一篇，但全域設計規則寫「長文都要有目錄」，
第三篇（海外巡演）也有四個 H2，所以一併補上。
錨點會避開固定頁首（`scroll-margin-top:96px`，數值跟既有 `.glance` sticky 對齊）。
**驗證：13 個錨點全部有對應的 id，零斷連。**

**`music-industry-structure-and-careers.astro` 每節開頭的粗體結論句**
⚠️ **這五句是我寫的，不是你的原文，請重點 review。**
寫法是把該節既有的論點濃縮前置，沒有引入新事實：
| 節 | 結論句 |
|---|---|
| Introduction | I came at this industry from two directions, a record shop counter and an engineering desk, and this guide is what both of them taught me. |
| Overview | The recorded music business did not simply shrink. It broke into pieces, and those pieces are where most of the jobs now are. |
| Roles | Every role below runs on the same three things: judgment about music, contracts you can read, and projects you can finish. |
| FAQ | In Taiwan the first job comes through someone who already knows you. Abroad it comes through what you can show. |
| Conclusion | Every opening is a gap that already hurts someone. Arrive able to close it. |

**`music-copyright-royalty-streams-for-songwriters.astro` 的 NT$450 算式改成步驟條**
底色隨步驟漸深，最後一行是結果：
1. Wholesale price per album (PPD) — NT$200
2. Times the statutory royalty rate in Taiwan — × 5.4%
3. Times copies sold — × 1,000
4. Split across 12 tracks and 2 writers per track — ÷ 24 = NT$450
5. Songwriter keeps 60%, publisher takes 40% — NT$270 · NT$180

**算式我驗算過**：200 × 5.4% × 1000 ÷ (12 × 2) = 450 ✓，跟你原文的數字一致。
所有表格不動。

---

## 11. 卡片重排（你中途交代的）

**Work index**
- 圖片**全部移除**（你說太滿）。`.dcard-fig` 相關 CSS 一併刪乾淨，沒有留死規則。
- 順序改成：**Agent Engineering → Course Kit → Vibe Code Home → Licensed bank**
- 版面從「3 欄 + 下面一張獨立全寬卡」改成 **2×2 四張等寬卡**
- 側欄 `.glance` 的四條說明也跟著重排成同樣順序
- subgrid 軌道跟著改：移除圖片那一列回到 6 格，兩欄兩排所以 `repeat(2, ...)` 共 12 格。
  **這一步少改就會壞**：第二排會掉到 auto 的隱式軌道，段落那格失去 `1fr`，底部連結對不齊。
  已量測：兩排各自的 head／h3／pills／links／卡片底部**全部對齊**。

**首頁**
- `.stack` 加一張 Agent Engineering 卡，放**第一張**，Course Kit 第二
- 媒體區用現成的 `.ledgerbox` + `.minilist` 事實面板（doctrine 617 lines／memory docs 136／
  attempt ceiling 5，大數字 13 releases in 8 months），不需要圖
- 後面三張卡的 `--i` 進場延遲順延成 1／2／3，否則動畫會撞在一起
- 已量測：四張卡順序正確、媒體區高度一致 408px、無溢出

**icon 還沒做，缺素材**（見下方待你處理）

---

## 12. 全域檢查結果

| 檢查 | 結果 |
|---|---|
| 每頁剛好一個 `.route` | 12 頁全 ok |
| 頁面裡的 HTML 註解 | 0（原本散落 14 個，全清） |
| emoji | 0 |
| 城市／到職週數手打 | 0，全部走 `data-site` 插槽 |
| 數字一致性（350+／9+5／15/15／100%／13 releases／4 weeks） | 全站一致 |
| 錨點斷連 | 0 / 13 |
| 手機橫向溢出 | 11 頁 × 390px 與 768px 兩個寬度，**零溢出** |
| `npm run build` | PASS（12 頁） |
| `npm run check` | 跑不了（`@astrojs/check` 未裝，NOTES.md 已記錄） |

**順手修的一個鐵律違規**：`cv.astro` 招募表裡的
`Dublin / Amsterdam / Tallinn` 是手打的，違反 AGENTS.md 鐵律 2。改成 `data-site="cities"` 插槽。

---

## 13. 第二輪 CSS 稽核與你的截圖回報（收尾輪）

**你截圖的排距問題，已修。**
根因：`.rowsync` 的 `row-gap:0` 是為了卡內 subgrid 對齊，原本單排沒事，
改成 2×2 後排與排之間也變 0，兩排貼死。
修法：`row-gap` 維持 0（動它卡內就歪），排距改用
`.dcards.cols2.rowsync > .dcard:nth-child(n+3){margin-top:20px}` 給回來。
手機版另外壓回（cols2 三個 class 特異度較高，media query 裡要逐條 override，
不然手機會殘留 12 條軌道跟多餘 margin）。
量測：桌機排距 20px、欄距 20px、手機三個間距 20/20/20、
手機軌道正確剩 4 條、第二排底部連結仍對齊。

**fresh-context CSS 稽核（第二位 subagent）結果：2 紅 5 黃 2 藍**

紅色兩個都修了，同一型的既有 bug（不是這次改出來的）：
- `.badge-pill.success/.warning` 和 `.ba-card .ba-tag` 的暗色版
  只寫在 `:root[data-theme="dark"]`，少了 `prefers-color-scheme: dark` 那組。
  OS 暗色但沒按過主題切換鈕的訪客，會在暗色頁面上拿到亮色版徽章。
  跟先前修的 `--rail-past` 是同一類漏洞，補齊。

黃色一個修了：
- 列印強制展開清單漏了 org 圖節點、`.split-line` 標題行、金流描線、
  ledger 打勾、時間軸填充條。捲動觸發前列印，這些會印成空白。
  全部補進 `@media print` 鎖末狀態。

黃色四個不修、記進 NOTES.md：
- `.diagram-box`／`.rlist`／`.sublist`／`.placeholder` 四組死 CSS。
  查過 git HEAD：**改版之前就沒人用**，不是這次弄出來的。
  照專案規矩不順手掃不相關的東西，NOTES.md 留了一條，下次動 site.css 再清。

藍色兩個 nit 不修（既有、低風險）：
- hero 光暈與 scard 陰影用寫死的 rgba 沒走 token。是 prototype 移植的刻意值，動它風險大於收益。

**稽核其餘全 PASS**：token 三處覆蓋（含新的 `--ok`／`--warn`）、
motion 兩條路徑對等、無選擇器互撞、六個新元件手機版全有單欄規則、
兩個虛擬元素圓點的 border-box 數學驗算正確、列印表格復原正確。

---

## 待你處理

### 1. 卡片 icon ： 卡在缺素材，這是唯一沒做完的項目

你說「只要放 icon 就好」，並指定：AI 用 Claude／Perplexity／Gemini 的 icon 組合、
Course Kit 和 VCH 各有自己的 icon、Rakuten Bank 用 `ricb.png`。

**現況：四組只有一組拿得到。**

| 卡 | icon | 狀態 |
|---|---|---|
| Agent Engineering | Claude + Perplexity + Gemini | ❌ 沒有檔案 |
| Course Kit | 自有 icon | ❌ 不在 `public/assets/` |
| Vibe Code Home | 自有 icon | ❌ 不在 `public/assets/` |
| Licensed bank | `ricb.png` | ✅ 已移到 `public/assets/ricb.png` |

**我的決定：先全部不放 icon，四張卡一致。**
理由：四張裡只有一張有 icon 會比完全沒有更難看，跟你嫌圖片「太滿」是同一個道理。

**另外，Claude／Perplexity／Gemini 三個 logo 我不會自己手畫。**
那是別家公司的商標，憑印象畫出來的形狀幾乎一定不準，等於在你的作品集頁面上
放三個畫錯的商標。這種錯誤正是你說不想要的那種。

需要你做的：把三個檔丟進 `public/assets/`（Course Kit icon、VCH icon、AI 那組），
或者直接說「AI 那張就不要 icon」。我拿到就補上，版位 CSS 很快。

### 2. `src/pages/work/agent-engineering.astro`（未進版控，我完全沒碰）

你已經自己把 `:12` 的 `eight releases` 改成 `thirteen releases` 了。
**還剩一處**：`:148` 的 `<span class="cnt" data-to="8">8</span>` releases 那格，
數字動畫仍然跑到 8。旁邊那格 `8 months` 是對的不用動。

### 3. 兩句一行重點沒有數字

CV 的倫敦和 Smart Catch 兩段，原始資料裡就沒有可量化的數字，我沒有編造，
用了可查證的事實句。有數字的話給我，我補上去。

### 4. 長文那五句粗體結論是我寫的

見上面第 10 節的表。是把你原本的論點濃縮前置，沒有加新事實，
但畢竟是我的句子放進你的文章裡，請確認語氣是你要的。

### 5. NOTES.md 新增了一條（關掉 JS 全站空白）

`.route` 預設 `display:none`，靠 `site.js:308` 加 `.active` 才顯示。
這是單檔 prototype hash router 的遺留物，Astro 一頁一路由之後這條規則已經沒工作了。
牽動每一頁又跟現身動畫共用同一個 class，我沒動，留給你決定。
列印那條路徑我已經繞過去了（列印時無條件 `display:block`）。
