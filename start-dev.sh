#!/bin/bash

# 啟動前後端開發伺服器
echo "正在啟動醫療記錄系統..."

# 使用 concurrently 同時啟動前後端
pnpm dev
