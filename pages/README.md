# 我的留言板

使用 Next.js + Supabase 建立的動態留言板網站

## 功能特色

- ✨ 即時留言功能
- 📱 響應式設計,支援手機/平板/電腦
- 🎨 現代化 UI 設計
- 🚀 快速部署到 Vercel

## 技術架構

- **前端框架**: Next.js 14
- **資料庫**: Supabase (PostgreSQL)
- **部署平台**: Vercel
- **樣式**: Tailwind CSS

## 環境變數設定

在 Vercel 部署時,需要設定以下環境變數:

```
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_Anon_Key
```

## 本地開發

```bash
# 安裝套件
npm install

# 建立 .env.local 檔案並填入環境變數
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 啟動開發伺服器
npm run dev
```

開啟瀏覽器訪問 http://localhost:3000

## 部署到 Vercel

1. 推送程式碼到 GitHub
2. 在 Vercel 導入專案
3. 設定環境變數
4. 點擊部署

## 資料庫結構

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 授權

MIT License
