# 🚀 垃圾分類應用 - 部署指南

## 📦 項目完成情況

✅ **已完成的功能**：

### 前端應用
- ✅ HTML5 結構 (index.html)
- ✅ 響應式 CSS 樣式 (styles.css)
- ✅ JavaScript 邏輯 (app.js)
- ✅ 攝像頭 API 集成
- ✅ TensorFlow.js 模型加載
- ✅ 實時圖像推理
- ✅ 結果可視化

### 深度學習模型
- ✅ Teachable Machine 模型 (垃圾分類)
- ✅ 4 種垃圾分類支援
- ✅ MobileNet v2 架構 (輕量級)
- ✅ model.json (92KB)
- ✅ weights.bin (2.1MB)
- ✅ metadata.json (配置)

### 開發工具
- ✅ 靜態前端資源 (index.html, styles.css, app.js)
- ✅ 完整文檔 (README.md)
- ✅ 快速開始指南 (QUICKSTART.md)
- ✅ 配置指南 (CONFIG.md)

---

## 🌐 本地部署

### 方式 1: Python 內建靜態伺服器

```bash
# 進入項目目錄
cd /workspaces/gar

# 運行 Python 內建伺服器
python3 -m http.server 8000
```

✅ 優點：
- 簡單易用
- 只需靜態資源
- 支援本地 HTTPS/localhost 測試

### 方式 2: Node.js 靜態伺服器

```bash
cd /workspaces/gar
php -S localhost:8000
```

### 方式 3: Node.js 靜態伺服器

```bash
npm install -g http-server
http-server -p 8000
```

### 方式 4: Docker 容器

創建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . /app
EXPOSE 8000
CMD ["python3", "-m", "http.server", "8000"]
```

構建和運行：

```bash
docker build -t garbage-classifier .
docker run -p 8000:8000 garbage-classifier
```

---

## 📱 訪問應用

### 本地訪問
```
http://localhost:8000
```

### 遠程訪問 (同一網絡)
```
http://<電腦IP>:8000
```

#### 獲取電腦 IP:

**Windows**:
```cmd
ipconfig
```
找 IPv4 地址 (例如 192.168.1.100)

**macOS/Linux**:
```bash
ifconfig
# 或
ip addr

# 通常是 192.168.x.x 或 10.0.x.x
```

---

## 🌐 雲平台部署

### 1. Vercel (推薦)

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 進入項目目錄
cd /workspaces/gar

# 部署
vercel
```

✅ 優點：
- 免費方案充足
- 自動 HTTPS
- CDN 全球加速
- GitHub 自動部署

### 2. Netlify

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod
```

✅ 優點：
- 直觀的 UI
- 環境變量支援
- 自動化 CI/CD

### 3. GitHub Pages

```bash
# 1. 創建 gh-pages 分支
git checkout --orphan gh-pages

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Deploy to GitHub Pages"

# 4. 推送
git push origin gh-pages

# 5. 在 GitHub 上啟用 Pages
# Settings -> Pages -> Source: gh-pages
```

✅ 優點：
- 完全免費
- 無伺服器成本
- GitHub 原生支援

### 4. 傳統虛擬主機 (VPS/Shared)

#### Nginx 配置:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/gar;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 快取資源
    location ~\.(js|css|json|bin|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 安全頭部
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
}
```

#### Apache 配置:

```apache
<Directory /var/www/gar>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]

    # 安全設置
    <FilesMatch "\.js$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
</Directory>
```

#### 上傳文件:

```bash
# 使用 SCP
scp -r /workspaces/gar/* user@example.com:/var/www/gar/

# 或使用 FTP/SFTP
sftp user@example.com
put -r /workspaces/gar/*
```

---

## 🔐 HTTPS 配置 (必需)

### 使用 Let's Encrypt (推薦)

```bash
# 安裝 Certbot
apt-get install certbot python3-certbot-nginx

# 獲得證書
certbot certonly --nginx -d example.com

# 自動更新
certbot renew --dry-run
```

### Nginx 配置 HTTPS:

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # 安全設置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/gar;
    # ... 其他配置
}

# 自動重定向 HTTP 到 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 性能優化

### 1. 模型快取

瀏覽器會自動快取模型。優化頭部：

```
Cache-Control: max-age=31536000, immutable
```

### 2. CDN 配置

將 `garbage/` 文件夾配置到 CDN：

```html
<!-- index.html -->
<script>
    // 使用 CDN URL
    const MODEL_URL = 'https://cdn.example.com/models/garbage/model.json';
</script>
```

### 3. 壓縮

啟用 gzip 壓縮：

**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 4. 圖像優化

如果有靜態圖像，使用 WebP 格式：

```html
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="...">
</picture>
```

---

## 🔍 監控和維護

### 1. 錯誤監控

集成 Sentry:

```html
<!-- index.html -->
<script src="https://cdn.ravenjs.com/3.27.0/raven.min.js"></script>
<script>
    Raven.config('YOUR_DSN').install();
</script>
```

### 2. 日誌記錄

```javascript
// app.js
class Analytics {
    static track(event, data) {
        console.log(`[${new Date().toISOString()}] ${event}`, data);
        // 可選：發送到分析服務
    }
}
```

### 3. 性能監測

```javascript
if (window.performance && window.performance.timing) {
    const perf = window.performance.timing;
    const loadTime = perf.loadEventEnd - perf.navigationStart;
    console.log(`頁面加載時間: ${loadTime}ms`);
}
```

---

## 🚨 常見問題

### Q: 攝像頭不工作?

1. 確認 HTTPS 或 localhost
2. 檢查瀏覽器權限
3. 查看控制台錯誤
4. 嘗試其他瀏覽器

### Q: 模型加載慢?

1. 使用 CDN 加速
2. 啟用 gzip 壓縮
3. 優化網絡連接
4. 執行量化（可選）

### Q: 推理結果不準?

1. 改善光線環境
2. 調整物體位置
3. 多角度拍照
4. 重新訓練模型

---

## 📋 檢查清單

### 部署前：
- [ ] 所有文件已上傳
- [ ] 模型文件完整 (model.json + weights.bin)
- [ ] HTTPS 已配置
- [ ] 服務器頭部已設置
- [ ] CORS 已啟用

### 部署後：
- [ ] 在瀏覽器中訪問應用
- [ ] 測試相機功能
- [ ] 拍照後能正常推理
- [ ] 結果顯示正確
- [ ] 移動設備測試
- [ ] 網絡速度測試

---

## 📞 技術支援

如有問題，請：

1. 檢查 [README.md](./README.md)
2. 查看 [CONFIG.md](./CONFIG.md)
3. 提交 [GitHub Issues](https://github.com/capze/gar/issues)
4. 查看瀏覽器控制台日誌 (F12)

---

**版本**: 1.0.0
**最後更新**: 2026年5月5日
**部署難度**: ⭐⭐☆☆☆ (簡單)
