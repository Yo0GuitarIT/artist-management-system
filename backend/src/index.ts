import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(cors());
app.use(express.json());

// 基本路由
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "醫療記錄系統 API 伺服器運行中" });
});

// 健康檢查
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API 路由
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "這是測試 API 端點", success: true });
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
