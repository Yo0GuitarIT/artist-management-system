# 藝人經紀管理系統

一個使用 React + Vite 前端和 Express 後端的全端 TypeScript 專案，專注於藝人基本檔資料管理功能。

## 功能特色

- **藝人基本檔查詢**：根據藝人編號查詢藝人基本資料
- **藝人詳細資料管理**：編輯藝人詳細資訊，包含藝名、本名、出生日期等
- **多重資料管理**：支援國籍、語言、宗教、身分證件等多重資料設定
- **即時通知系統**：使用 Toast 通知提供友善的操作回饋
- **響應式設計**：支援桌面和行動裝置
- **即時狀態檢查**：顯示後端連接狀態
- **資料驗證**：完整的前後端資料驗證機制

## 技術棧

### 前端

- React 19
- Vite 6
- TypeScript
- Axios (HTTP 客戶端)
- Tailwind CSS (UI 樣式)
- TanStack Query (狀態管理與快取)
- React Hot Toast (通知系統)

### 後端

- Express 5
- TypeScript
- Prisma (資料庫 ORM)
- PostgreSQL (資料庫)
- CORS 支援

### 工具

- pnpm (包管理器)
- ESLint (程式碼檢查)
- Nodemon (開發模式熱重載)

## 專案結構

```
artist-management-system/
├── .gitignore         # 統一的 Git 忽略文件
├── package.json       # 根目錄腳本管理
├── README.md          # 專案說明
├── frontend/          # React + Vite 前端
│   ├── src/
│   │   ├── components/    # React 元件
│   │   │   ├── ArtistInfoCard.tsx
│   │   │   ├── ArtistManagement.tsx
│   │   │   ├── BasicInfoCard.tsx
│   │   │   ├── IdDocumentCard.tsx
│   │   │   ├── LanguageCard.tsx
│   │   │   ├── NationalityCard.tsx
│   │   │   ├── ReligionCard.tsx
│   │   │   ├── SearchGroup.tsx
│   │   │   └── SystemStatus.tsx
│   │   ├── context/       # React Context 狀態管理
│   │   │   ├── ArtistManagementContext.tsx
│   │   │   ├── ArtistManagementProvider.tsx
│   │   │   ├── index.ts
│   │   │   └── useArtistManagement.ts
│   │   ├── hooks/         # 自定義 React Hooks
│   │   │   ├── useArtistMutations.ts
│   │   │   └── useArtistQueries.ts
│   │   ├── services/      # API 服務
│   │   │   └── api.ts
│   │   ├── types/         # TypeScript 型別定義
│   │   │   └── artistBasicInfo.ts
│   │   ├── App.tsx        # 主應用程式元件
│   │   ├── main.tsx       # 應用程式入口點
│   │   └── index.css      # 全域樣式
│   └── package.json
└── backend/           # Express 後端
    ├── prisma/
    │   ├── schema.prisma  # Prisma 資料庫綱要
    │   └── migrations/    # 資料庫遷移檔案
    ├── src/
    │   ├── index.ts       # 主伺服器文件
    │   └── seed.ts        # 資料庫種子資料
    └── package.json
```

## 快速開始

### 首次設置

```bash
# 安裝所有依賴
pnpm run install:all
```

### 方法一：使用根目錄腳本（推薦）

```bash
# 同時啟動前後端
pnpm dev
```

### 方法二：使用啟動腳本

```bash
./start-dev.sh
```

### 方法三：手動啟動

1. 啟動後端伺服器：

```bash
pnpm run dev:backend
```

2. 在新終端啟動前端：

```bash
pnpm run dev:frontend
```

## 專案管理腳本

### 開發

- `pnpm dev` - 同時啟動前後端開發伺服器
- `pnpm run dev:frontend` - 只啟動前端
- `pnpm run dev:backend` - 只啟動後端

### 建置

- `pnpm build` - 建置整個專案
- `pnpm run build:frontend` - 只建置前端
- `pnpm run build:backend` - 只建置後端

### 其他

- `pnpm run install:all` - 安裝所有依賴
- `pnpm clean` - 清理所有 node_modules 和 build 檔案
- `pnpm start` - 啟動生產環境後端

## 服務地址

- 前端：http://localhost:5173
- 後端：http://localhost:3001

## API 端點

### 基本 API

- `GET /` - 基本訊息
- `GET /health` - 健康檢查

### 藝人資料 API

- `GET /api/artist-basic-info/:artistId` - 根據藝人 ID 查詢藝人基本資料（包含完整的詳細資料）
- `POST /api/artist-detail` - 新增或更新藝人詳細資料

### 代號選項 API

- `GET /api/code-options/:category` - 取得特定分類的代號選項
  - 支援的分類：`biological_gender`, `marital_status`, `blood_type_abo`, `blood_type_rh`, `education_level`, `income_level`, `nationality`, `language`, `religion`, `id_type`

### 藝人國籍 API

- `DELETE /api/artist-nationality/:id` - 刪除指定的藝人國籍資料

### 藝人語言 API

- `DELETE /api/artist-language/:id` - 刪除指定的藝人語言資料

### 藝人宗教 API

- `DELETE /api/artist-religion/:id` - 刪除指定的藝人宗教資料

### 藝人身分證件 API

- `DELETE /api/artist-id-document/:id` - 刪除指定的藝人身分證件資料

## 資料庫結構

本專案使用 Prisma ORM 管理 PostgreSQL 資料庫，主要包含以下資料表：

### 核心資料表

#### ArtistBasicInfo 藝人基本資料表
- 儲存藝人的基本檔資料
- 包含藝人編號、藝名、本名、出生日期等基本資訊

#### ArtistDetail 藝人詳細資料表
- 儲存藝人的詳細資料
- 包含生理性別、婚姻狀況、血型、教育程度、收入水準等

#### ArtistNationality 藝人國籍資料表
- 支援多重國籍設定
- 可設定主要國籍

#### ArtistLanguage 藝人語言資料表
- 支援多語言設定
- 可設定主要語言

#### ArtistReligion 藝人宗教資料表
- 支援多宗教設定
- 可設定主要宗教

#### ArtistIdDocument 藝人身分證件資料表
- 支援多種身分證件
- 可設定主要證件

#### CodeOption 代號選項對照表
- 統一管理各種代號選項
- 支援分類管理和顯示順序設定

### 資料表關聯

```
ArtistBasicInfo (1) ←→ (1) ArtistDetail
                              ↓
                     ┌────────┴────────┐
                     ↓                 ↓
            ArtistNationality    ArtistLanguage
                     ↓                 ↓
            ArtistReligion     ArtistIdDocument
```

### 主要特色

- **關聯式設計**：使用外鍵確保資料完整性
- **多重資料支援**：國籍、語言、宗教、證件都支援多筆資料
- **主要標記**：各類資料都可設定主要項目
- **代號統一管理**：所有選項代號集中在 CodeOption 表管理
- **時間戳記**：所有表都包含建立時間和更新時間

## 開發說明

### 前端開發

- **技術架構**：使用 React 19 + TypeScript + Vite 6
- **狀態管理**：採用 TanStack Query 進行伺服器狀態管理，React Context 進行本地狀態管理
- **UI 框架**：使用 Tailwind CSS 4 提供響應式設計
- **通知系統**：整合 React Hot Toast 提供用戶友善的操作回饋
- **API 通訊**：使用 Axios 進行 HTTP 請求，支援自動重試和錯誤處理
- **代理設定**：前端開發伺服器會將 `/api/*` 請求轉發到後端

#### 主要功能模組

- **搜尋模組**：藝人編號搜尋功能
- **基本資料卡**：顯示和編輯藝人基本資訊
- **國籍管理卡**：多重國籍的新增、編輯、刪除
- **語言管理卡**：多語言的新增、編輯、刪除
- **宗教管理卡**：多宗教的新增、編輯、刪除
- **證件管理卡**：多證件的新增、編輯、刪除
- **系統狀態**：即時顯示後端連接狀態

### 後端開發

- **技術架構**：使用 Express 5 + TypeScript + Prisma ORM
- **資料庫**：PostgreSQL，使用 Prisma 進行資料庫管理和遷移
- **API 設計**：RESTful API，支援 CORS 跨域請求
- **錯誤處理**：統一的錯誤處理機制和回應格式
- **開發工具**：使用 nodemon 實現開發模式自動重啟

#### 開發模式啟動

1. 後端使用 nodemon 監控檔案變更並自動重啟
2. 前端使用 Vite 的 HMR (Hot Module Replacement) 快速更新
3. 資料庫變更可透過 Prisma Migrate 進行版本控制

### 資料庫設定

確保您已設定 PostgreSQL 資料庫並在 `.env` 檔案中配置 `DATABASE_URL`：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

執行資料庫遷移：

```bash
cd backend && npx prisma migrate dev
```

## 安裝依賴

如果需要重新安裝依賴：

```bash
# 前端
cd frontend && pnpm install

# 後端
cd backend && pnpm install
```

## 建置產品版本

```bash
# 前端建置
cd frontend && pnpm build

# 後端建置
cd backend && pnpm build
```

## 使用說明

### 基本操作流程

1. **搜尋藝人**：在搜尋框輸入藝人編號並點擊搜尋
2. **檢視資料**：搜尋成功後會顯示藝人的完整資料
3. **編輯資料**：點擊各區塊的編輯按鈕進行資料修改
4. **新增多重資料**：在國籍、語言、宗教、證件區塊點擊「新增」按鈕
5. **刪除資料**：點擊各項目的刪除按鈕移除不需要的資料
6. **儲存變更**：完成編輯後點擊「儲存」按鈕

### 功能特色

- **即時回饋**：所有操作都會顯示 Toast 通知
- **資料驗證**：前後端都有完整的資料驗證機制
- **響應式設計**：支援桌面和行動裝置瀏覽
- **狀態管理**：使用 TanStack Query 提供快取和自動重新載入

## 注意事項

- 確保 PostgreSQL 資料庫服務正在運行
- 首次使用前請執行資料庫遷移
- 開發模式下前後端需要同時啟動
- 生產環境部署時請設定適當的環境變數

## 貢獻指南

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/新功能`)
3. 提交變更 (`git commit -am '新增某功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 建立 Pull Request

## 授權

此專案採用 MIT 授權條款。
