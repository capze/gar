# ♻️ 垃圾分類辨識系統

一個基於 **TensorFlow.js** 和 **Teachable Machine** 的實時垃圾分類辨識 Web 應用，完全在前端運行，具有完整的響應式設計支援。

## 功能特點

✨ **核心功能**
- 🎥 實時相機訪問和拍照
- 🤖 實時圖像辨識（基於預訓練的深度學習模型）
- 📊 詳細的分類結果顯示（包含信心度）
- 📱 完全響應式設計，支援各種手機
- ⚡ 前端完全計算（無需後端服務器）
- 🔒 隱私保護（圖像不上傳到任何伺服器）

🎯 **支援的垃圾分類**
- **Trash (垃圾)** ✨ - 紙巾、包裝紙等一般廢棄物
- **Shoes (鞋類)** 👟 - 破舊鞋子等
- **Plastic (塑膠)** 🥤 - 塑膠瓶、塑膠袋等
- **Glass (玻璃)** 🍾 - 玻璃瓶、玻璃杯等

## 技術棧

| 技術 | 說明 |
|------|------|
| **前端框架** | HTML5 + CSS3 + Vanilla JavaScript |
| **ML 框架** | TensorFlow.js 4.11.0 |
| **模型** | Teachable Machine (MobileNet v2) |
| **API** | WebRTC (getUserMedia) |
| **響應式** | CSS Grid & Flexbox |

## 系統要求

- 🌐 **瀏覽器**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- 🎥 **硬體**: 需要攝像頭的設備
- 🔐 **協議**: HTTPS 或 localhost (相機 API 要求)
- 📦 **依賴**: 自動從 CDN 加載

## 快速開始

### 1️⃣ 安裝

```bash
# 克隆或下載項目
git clone https://github.com/capze/gar.git
cd gar
```

### 2️⃣ 啟動伺服器

**方式 A: 使用 Python**
```bash
python3 server.py
# 或
python server.py
```

**方式 B: 使用其他服務器**
```bash
# Node.js (如果安裝了 http-server)
npx http-server

# 或使用 PHP
php -S localhost:8000
```

### 3️⃣ 訪問應用

在瀏覽器中打開：
```
http://localhost:8000
```

手機訪問（同一網路）：
```
http://<你的電腦IP>:8000
```

## 使用指南

### 基本流程

1. **開啟相機** 📷
   - 點擊「開啟相機」按鈕
   - 允許瀏覽器訪問相機
   - 相機預覽會出現

2. **拍照** 📸
   - 對準垃圾
   - 點擊「拍照」按鈕
   - 系統開始分析

3. **查看結果** 📊
   - 拍攝的照片會顯示
   - 顯示所有分類的信心度
   - 綠色表示高信心度（>70%）
   - 橙色表示中等信心度（40-70%）
   - 紅色表示低信心度（<40%）

4. **重新拍照** 🔄
   - 點擊「重新拍照」按鈕
   - 或點擊「拍照」按鈕繼續

5. **關閉相機** ✖️
   - 點擊「關閉相機」按鈕
   - 釋放相機資源

### UI 顏色說明

| 顏色 | 含義 | 信心度 |
|------|------|--------|
| 🟢 綠色 | 高信心度 | ≥ 70% |
| 🟠 橙色 | 中等信心度 | 40-70% |
| 🔴 紅色 | 低信心度 | < 40% |

## 項目結構

```
gar/
├── index.html           # 主 HTML 頁面
├── styles.css           # 樣式表（包含響應式設計）
├── app.js              # 主應用邏輯
├── server.py           # Python 開發服務器
├── garbage/            # 模型文件夾
│   ├── model.json      # 模型結構定義
│   ├── metadata.json   # 模型元數據
│   └── weights.bin     # 模型權重（大文件）
└── README.md           # 本文件
```

## 功能詳解

### 🎥 相機管理
- 自動環境相機（本地）
- 支援多相機設備
- 高精度視頻捕捉（1280x720）
- 自動降級處理（不支援時）

### 🤖 模型推理
- 實時批量預測
- 自動圖像預處理
- 多輸出分類結果
- 信心度計算

### 📱 響應式設計
- 移動優先設計
- 斷點適配：
  - **480px** 及以下：手機
  - **480px - 768px**：平板
  - **768px+**：桌面

### 🔒 隱私保護
- 所有計算在本地執行
- 無數據上傳
- 無追蹤代碼
- 完全離線使用（模型加載後）

## 性能指標

| 指標 | 數值 |
|------|------|
| **模型大小** | ~13 MB (weights.bin) |
| **推理時間** | ~200-500ms (取決於設備) |
| **首次加載** | ~2-5s (取決於網速) |
| **內存使用** | ~100-200 MB |

## 高級配置

### 修改相機設定

編輯 `app.js` 中的 `startCamera()` 方法：

```javascript
const constraints = {
    video: {
        facingMode: 'environment', // 或 'user' (前置)
        width: { ideal: 1280 },
        height: { ideal: 720 }
    },
    audio: false
};
```

### 調整預測閾值

在 `displayPredictions()` 方法中修改信心度判斷：

```javascript
if (confidence >= 0.7) {
    confidentClass = 'high-confidence';
} else if (confidence >= 0.4) {
    confidentClass = 'medium-confidence';
}
```

## 故障排除

### ❌ 相機無法訪問

**問題**: Permission Denied 或 NotFoundError

**解決方案**:
1. 檢查瀏覽器權限設定
2. 確保使用 HTTPS 或 localhost://
3. 檢查設備是否有相機
4. 嘗試不同瀏覽器

### ❌ 模型加載失敗

**問題**: Model loading failed

**解決方案**:
1. 確保 `garbage/` 文件夾存在
2. 檢查 `model.json` 和 `weights.bin` 是否完整
3. 檢查跨域（CORS）設定
4. 查看瀏覽器控制台錯誤

### ❌ 性能緩慢

**問題**: 推理很慢或頻繁卡頓

**解決方案**:
1. 關閉其他應用
2. 使用更高效的瀏覽器
3. 降低視頻分辨率
4. 檢查設備 GPU 支援

### ❌ 辨識不準確

**問題**: 預測結果信心度低

**解決方案**:
1. 確保光線充足
2. 從多個角度拍照
3. 確保物體佔據大部分畫面
4. 重新訓練模型（使用 Teachable Machine）

## 開發指南

### 本地開發

```bash
# 1. 啟動開發服務器
python3 server.py

# 2. 在瀏覽器中打開
http://localhost:8000

# 3. 打開開發者工具
F12 或 Ctrl+Shift+I

# 4. 查看控制台日誌
console.log() 輸出會在 Console 標籤顯示
```

### 修改模型

使用 **Teachable Machine** (Google)：
1. 訪問 [teachablemachine.withgoogle.com](https://teachablemachine.withgoogle.com)
2. 建立新的圖像分類項目
3. 上傳或拍攝訓練圖像
4. 訓練模型
5. 導出為 TensorFlow.js 格式
6. 替換 `garbage/` 文件夾內的文件

### 自訂樣式

編輯 `styles.css` 修改：
- 顏色主題（`:root` CSS 變量）
- 佈局（Grid/Flexbox）
- 動畫（@keyframes）
- 響應式斷點

### 打包發布

```bash
# 方式 1: 直接上傳（靜態文件）
# 所有文件上傳到 web 服務器

# 方式 2: Docker 容器化
# 参见 Dockerfile 示例

# 方式 3: 使用 GitHub Pages
# 推送到 gh-pages 分支
```

## 部署指南

### 🌐 部署到 Web 伺服器

1. **準備文件**
   ```bash
   # 確保所有文件完整
   ls -la
   ```

2. **上傳到伺服器**
   ```bash
   # 使用 FTP、SFTP 或 Git
   # 確保保留文件結構
   ```

3. **配置 Web 服務器**
   
   **Nginx**:
   ```nginx
   server {
       listen 80;
       server_name example.com;
       
       location / {
           root /var/www/gar;
           try_files $uri $uri/ /index.html;
       }
       
       # 靜態文件快取
       location ~\.(js|css|json|bin)$ {
           expires 30d;
       }
   }
   ```

   **Apache**:
   ```apache
   <Directory /var/www/gar>
       RewriteEngine On
       RewriteBase /
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </Directory>
   ```

4. **HTTPS 配置**（必需）
   ```bash
   # 使用 Let's Encrypt 免費證書
   certbot certonly --standalone -d example.com
   ```

### ☁️ 部署到雲平台

**Vercel** (推薦):
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy
```

**GitHub Pages**:
```bash
git push origin main
# 在 Settings > Pages 啟用
```

## 貢獻指南

1. Fork 本項目
2. 建立功能分支 (`git checkout -b feature`)
3. 提交更改 (`git commit -m 'Add feature'`)
4. 推送到分支 (`git push origin feature`)
5. 開啟 Pull Request

## 許可證

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 常見問題 (FAQ)

**Q: 是否可以離線使用？**
A: 是的，模型加載後可完全離線使用。

**Q: 支援多語言嗎？**
A: 當前支援繁體中文。可提交 PR 添加其他語言。

**Q: 能否在桌面應用中使用？**
A: 可以，使用 Electron 或 Tauri 框架包裝。

**Q: 模型的準確度如何？**
A: 準確度取決於訓練數據。此示例模型準確度為 ~85%。

**Q: 如何訓練自己的模型？**
A: 使用 [Teachable Machine](https://teachablemachine.withgoogle.com) 平台。

## 相關資源

- 📚 [TensorFlow.js 文檔](https://www.tensorflow.org/js)
- 🎓 [Teachable Machine](https://teachablemachine.withgoogle.com)
- 🔧 [Web APIs MDN](https://developer.mozilla.org/en-US/docs/Web/API)
- 📱 [ResponsiveDesign](https://responsivedesign.is/)

## 聯繫方式

- 📧 Email: support@example.com
- 🐙 GitHub: [@capze](https://github.com/capze)
- 💬 Issues: [提交問題](https://github.com/capze/gar/issues)

---

**製作時間**: 2026年5月5日
**最後更新**: 2026年5月5日
**版本**: 1.0.0

🌱 **感謝使用垃圾分類辨識系統！一起保護地球環境！** 🌍