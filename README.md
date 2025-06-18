# 醫療記錄系統

一個使用 React + Vite 前端和 Express 後端的全端 TypeScript 專案。

## 技術棧

### 前端

- React 19
- Vite 6
- TypeScript
- Axios (HTTP 客戶端)

### 後端

- Express 5
- TypeScript
- CORS 支援
- Node.js

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

- `GET /` - 基本訊息
- `GET /health` - 健康檢查
- `GET /api/test` - 測試 API

## 開發說明

### 前端開發

- 前端代理設定會將 `/api/*` 請求轉發到後端
- API 服務位於 `frontend/src/services/api.ts`
- 使用 Axios 進行 HTTP 請求

### 後端開發

- 使用 TypeScript 開發
- 支援 CORS 跨域請求
- 開發模式使用 nodemon 自動重啟

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
