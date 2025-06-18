# 藝人經紀管理系統

一個使用 React + Vite 前端和 Express 後端的全端 TypeScript 專案，專注於藝人基本檔資料管理功能。

## 功能特色

- **藝人基本檔查詢**：根據藝人編號查詢藝人基本資料
- **藝人詳細資料管理**：編輯藝人詳細資訊，包含藝名、本名、出生日期等
- **國籍資料管理**：支援多重國籍設定
- **響應式設計**：支援桌面和行動裝置
- **即時狀態檢查**：顯示後端連接狀態

## 技術棧

### 前端

- React 19
- Vite 6
- TypeScript
- Axios (HTTP 客戶端)
- Tailwind CSS (UI 樣式)
- TanStack Query (狀態管理)

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
medical-record/
├── .gitignore         # 統一的 Git 忽略文件
├── package.json       # 根目錄腳本管理
├── README.md          # 專案說明
├── start-dev.sh       # 開發環境啟動腳本
├── frontend/          # React + Vite 前端
│   ├── src/
│   │   ├── services/  # API 服務
│   │   └── ...
│   └── package.json
└── backend/           # Express 後端
    ├── src/
    │   └── index.ts   # 主伺服器文件
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
- `GET /api/test` - 測試 API

### 藝人基本檔 API

- `GET /api/artist-basic-info/:artistId` - 根據藝人 ID 查詢藝人基本資料
- `POST /api/artist-basic-info` - 新增藝人基本資料
- `PUT /api/artist-basic-info/:artistId` - 更新藝人基本資料

## 資料庫結構

### ArtistBasicInfo 表格

```sql
CREATE TABLE "artist_basic_info" (
    "id" SERIAL PRIMARY KEY,
    "artistId" TEXT UNIQUE NOT NULL,   -- 藝人ID
    "ptName" TEXT NOT NULL,            -- 藝人姓名
    "ptNameFull" TEXT,                 -- 藝人全名
    "birthDate" TIMESTAMP(3),          -- 出生日期
    "gender" TEXT,                     -- 性別代碼
    "genderName" TEXT,                 -- 性別名稱
    "maritalStatus" TEXT,              -- 婚姻狀況代碼
    "maritalStatusName" TEXT,          -- 婚姻狀況名稱
    "email" TEXT,                      -- 電子郵件
    "educationNo" TEXT,                -- 教育程度代碼
    "educationNoName" TEXT,            -- 教育程度名稱
    "lowIncome" TEXT,                  -- 低收入戶代碼
    "lowIncomeName" TEXT,              -- 低收入戶名稱
    "nationalityCode" TEXT,            -- 國籍代碼
    "nationalityCodeName" TEXT,        -- 國籍名稱
    "mainLang" TEXT,                   -- 主要語言代碼
    "mainLangName" TEXT,               -- 主要語言名稱
    "religion" TEXT,                   -- 宗教代碼
    "religionName" TEXT,               -- 宗教名稱
    "idType" TEXT,                     -- 身份證類型代碼
    "idTypeName" TEXT,                 -- 身份證類型名稱
    "idNo" TEXT,                       -- 身份證號
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);
```

## 開發說明

### 前端開發

- 前端代理設定會將 `/api/*` 請求轉發到後端
- API 服務位於 `frontend/src/services/api.ts`
- 使用 Axios 進行 HTTP 請求
- 主要功能為藝人基本檔查詢介面

### 後端開發

- 使用 TypeScript 開發
- 支援 CORS 跨域請求
- 使用 Prisma ORM 管理資料庫
- 開發模式使用 nodemon 自動重啟

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
