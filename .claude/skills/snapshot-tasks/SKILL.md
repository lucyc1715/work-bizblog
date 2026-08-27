---
name: snapshot-tasks
description: 掃描 .claude/snapshots/ 目錄中的 snapshot 文件，列出所有待實作與待測任務。當用戶說「列出待實作任務」、「查看 snapshot 任務」、「有哪些待測項目」、或輸入 /snapshot-tasks 時觸發。(project)
---

# Snapshot Tasks

根據 `.claude/snapshots/` 目錄中的 snapshot 文件，彙整所有待辦任務。

## 工作流程

1. **讀取所有 snapshot 文件**
   ```
   Glob: .claude/snapshots/*.md
   ```

2. **解析每個文件，提取以下類型的待辦項目**：

   | 類型 | 識別方式 | 範例 |
   |------|----------|------|
   | 待實作 | `- [ ]` 未勾選的 checkbox | `- [ ] 架構: VCH ↔ CourseKit UID Mapping` |
   | 待測 | 表格中含「待測」的行 | `\| 2-1 \| IAP flag ON → Hot Restart \| ... \| 待測 \|` |
   | Next Steps | `## Next Steps` 區塊內的項目 | 編號列表或子標題下的任務 |
   | Debug 項目 | `待確認`、`待 Debug` 區塊 | VCH Firestore 欄位檢查 |

3. **輸出格式**

   按 snapshot 文件分組，顯示：
   - 文件名稱（含日期）
   - 該文件的 Status（如果有）
   - 待實作任務列表
   - 待測任務列表

## 輸出範例

```markdown
## 待辦任務總覽

### 20260212_vch-entitlement-gating.md
**Status**: 功能驗證通過，VCH Firestore 欄位待確認

**待測項目** (8 項)
- 案例 2：已買斷裝置
  - [ ] IAP flag ON → Hot Restart
  - [ ] 啟動即 isPremium=true
  - [ ] VCH 查詢結果不影響（OR 邏輯）
  - [ ] 統計頁正常顯示
  - [ ] 設定頁「您的方案」顯示「專業版」
- 案例 3：未購買用戶
  - [ ] IAP OFF + VCH 無購買
  - [ ] Profile 頁升級提示卡片
  - [ ] 點擊「立即升級」導向 UnifiedPurchaseScreen

**待確認/Debug** (1 項)
- [ ] VCH Firestore 欄位缺少（productId 命名一致性）

### 20260209_1600_usage-record-edit-delete.md
**待實作** (3 項)
- [ ] CourseKit users collection（Model, Service, Provider）
- [ ] VCH 產品 mapping（Cloud Function: linkProduct）
- [ ] 日語翻譯（147 untranslated keys）
```

## 注意事項

- 優先顯示最新的 snapshot 文件（按文件名日期排序）
- 已完成的項目 `[x]` 不列出
- 如果某文件沒有待辦項目，可以略過或標註「無待辦」
