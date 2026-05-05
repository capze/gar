# 🎨 垃圾分類應用 - 配置指南

## 📋 目錄

1. [外觀配置](#外觀配置)
2. [功能配置](#功能配置)
3. [模型配置](#模型配置)
4. [伺服器配置](#伺服器配置)
5. [高級配置](#高級配置)

---

## 🎨 外觀配置

### 修改顏色主題

編輯 `styles.css` 的根變量 (第 1-9 行):

```css
:root {
    --primary-color: #4CAF50;        /* 主色 (綠色) */
    --secondary-color: #2196F3;      /* 副色 (藍色) */
    --danger-color: #f44336;         /* 危險色 (紅色) */
    --warning-color: #ff9800;        /* 警告色 (橙色) */
    --success-color: #4CAF50;        /* 成功色 (綠色) */
    --light-bg: #f5f5f5;             /* 淺色背景 */
    --border-radius: 12px;           /* 邊框圓角 */
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}
```

#### 例子：改為藍色主題

```css
:root {
    --primary-color: #1976D2;        /* 藍色主題 */
    --secondary-color: #00BCD4;      /* 淺藍 */
    /* ... 其他變量 ... */
}
```

### 修改背景

編輯 `styles.css` 第 21 行：

```css
body {
    /* 原來 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    /* 改為純色 */
    background: #f0f0f0;
    
    /* 或其他漸變 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 修改字體

編輯 `styles.css` 第 15-17 行：

```css
body {
    /* 原來 - 系統字體 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;
    
    /* 改為 Google Fonts */
    font-family: 'Noto Sans TC', 'Roboto', sans-serif;
    
    /* 從 CDN 加載 */
    /* 在 index.html <head> 中添加 */
}
```

在 HTML 頭部添加：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap" rel="stylesheet">
```

### 修改按鈕樣式

編輯 `styles.css` 的 `.btn` 相關部分：

```css
.btn {
    /* 原來 */
    padding: 12px 20px;
    border-radius: var(--border-radius);
    
    /* 改為其他樣式 */
    padding: 15px 25px;           /* 更大 */
    border-radius: 25px;          /* 膠囊形 */
    font-weight: 700;             /* 加粗 */
    letter-spacing: 1px;          /* 字符間距 */
}
```

---

## ⚙️ 功能配置

### 修改相機設定

編輯 `app.js` 的 `startCamera()` 方法 (第 86-100 行)：

```javascript
async startCamera() {
    const constraints = {
        video: {
            facingMode: 'environment',  // 後置相機
            // facingMode: 'user',       // 或改為前置相機
            width: { ideal: 1280 },     // 寬度
            height: { ideal: 720 }      // 高度
        },
        audio: false
    };
    
    // ... 其他代碼
}
```

#### 相機選項

```javascript
// 使用特定相機
deviceId: { exact: 'camera-id' },

// 宽高比
aspectRatio: { ideal: 1.777 },  // 16:9

// 幀率
frameRate: { ideal: 30 },       // 每秒幀數
```

### 修改模型路徑

編輯 `app.js` 的 `loadModel()` 方法 (第 63-77 行)：

```javascript
async loadModel() {
    const URL = './garbage/model.json';        // 模型路徑
    const metadataURL = './garbage/metadata.json';  // 元數據路徑
    
    // 或改為 CDN URL
    const URL = 'https://example.com/models/garbage/model.json';
    
    // ... 其他代碼
}
```

### 修改預測閾值

編輯 `app.js` 的 `displayPredictions()` 方法 (第 144-160 行)：

```javascript
displayPredictions(predictions) {
    // 信心度分類
    if (confidence >= 0.7) {      // 高（改為 0.8）
        confidentClass = 'high-confidence';
    } else if (confidence >= 0.4) { // 中（改為 0.5）
        confidentClass = 'medium-confidence';
    } else {                         // 低
        confidentClass = 'low-confidence';
    }
    
    // 最高信心度提示
    if (topPrediction.probability >= 0.6) {  // 改為其他值
        this.showStatus(`✓ 辨識成功！...`, 'success');
    }
}
```

### 修改垃圾分類

編輯 `app.js` 的構造函數 (第 10-21 行)：

```javascript
this.labels = ['trash', 'shoes', 'plastic', 'glass'];  // 標籤

this.categoryInfo = {
    'trash': '✨ 一般廢棄物',     // 類別說明
    'shoes': '👟 鞋類',
    'plastic': '🥤 塑膠製品',
    'glass': '🍾 玻璃製品'
};
```

修改為自訂分類：

```javascript
this.labels = ['可回收', '有害', '廚餘', '其他'];

this.categoryInfo = {
    '可回收': '💚 可回收物品',
    '有害': '⚠️ 有毒有害',
    '廚餘': '🍌 廚房廢棄物',
    '其他': '⚪ 其他垃圾'
};
```

---

## 🤖 模型配置

### 載入自訂模型

1. **訓練新模型** (Google Teachable Machine)

   訪問: https://teachablemachine.withgoogle.com
   
   步驟:
   - 新建「圖像分類」項目
   - 上傳訓練圖像
   - 訓練模型
   - 導出為 TensorFlow.js

2. **替換模型文件**

   ```bash
   # 備份原模型
   cp -r garbage garbage.bak
   
   # 下載新模型後解壓
   unzip model.zip -d garbage/
   ```

3. **更新標籤** (如果分類改變)

   編輯 `app.js` 的標籤部分

### 量化模型 (可選)

降低模型大小以提高加載速度：

```python
# 使用 TensorFlow 量化
import tensorflow as tf

converter = tf.lite.TFLiteConverter.from_saved_model("model")
converter.optimizations = [tf.lite.Optimize.DEFAULT]
quantized_tflite_model = converter.convert()
```

---

## 🌐 伺服器配置

本應用為純前端靜態頁面，推薦使用本地靜態伺服器進行測試。

### 使用 Python 內建靜態伺服器

```bash
python3 -m http.server 8000
```

### 使用 Node.js 靜態伺服器

```bash
npm install -g http-server
http-server -p 8000
```

### 使用 PHP 內建伺服器

```bash
php -S localhost:8000
```

---

## 🔧 高級配置

### 啟用深色模式

`styles.css` 已內建深色模式支援。修改媒體查詢 (第 350+ 行)：

```css
@media (prefers-color-scheme: dark) {
    body {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    }
    /* ... 其他樣式 ... */
}
```

### 新增多語言支援

1. **創建語言文件** (`lang.js`)

```javascript
const translations = {
    'zh-TW': {
        'title': '垃圾分類辨識系統',
        'start': '開啟相機',
        'capture': '拍照'
    },
    'en': {
        'title': 'Garbage Classification',
        'start': 'Start Camera',
        'capture': 'Take Photo'
    }
};
```

2. **在 HTML 中使用**

```html
<h1 data-i18n="title">垃圾分類辨識系統</h1>
<button data-i18n="start">開啟相機</button>
```

3. **JavaScript 翻譯**

```javascript
function translate(key, lang = 'zh-TW') {
    return translations[lang][key] || key;
}
```

### 新增日誌記錄

```javascript
// 在 app.js 中添加
class Logger {
    static log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
        // 可選：發送到伺服器
    }
}

// 使用
Logger.log('Model loaded', 'info');
Logger.log('Failed to access camera', 'error');
```

### 新增分析追蹤 (可選)

```javascript
// 在 index.html 的 <head> 中添加 (例如 Google Analytics)
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 新增離線支援 (Service Worker)

創建 `sw.js`：

```javascript
const CACHE_NAME = 'garbage-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/garbage/model.json',
  '/garbage/metadata.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

在 `app.js` 中註冊：

```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
```

---

## 📝 常見配置場景

### 場景 1: 校園應用

```javascript
// 修改分類為校園廢棄物
this.labels = ['紙類', '塑料', '金屬', '其他'];

// 修改為校園色彩
--primary-color: #1a73e8;  /* Google 藍 */
--secondary-color: #4285f4;
```

### 場景 2: 工業應用

```javascript
// 提高推理精度要求
if (confidence >= 0.85) {  // 嚴格要求
    confidentClass = 'high-confidence';
} else if (confidence >= 0.70) {
    confidentClass = 'medium-confidence';
}

// 新增日誌系統
Logger.log(`Prediction: ${label} (${probability.toFixed(2)})`);
```

### 場景 3: 移動應用

```css
/* 針對小屏幕優化 */
@media (max-width: 320px) {
    .btn {
        padding: 10px 12px;
        font-size: 0.8rem;
    }
    .container {
        max-width: 100%;
    }
}
```

---

## 🔗 其他資源

- [MDN - CSS 變量](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [TensorFlow.js 配置](https://js.tensorflow.org/api/latest/)
- [Teachable Machine 文檔](https://github.com/googlecreativelab/teachablemachine-community)

---

**版本**: 1.0.0
**最後更新**: 2026年5月5日
