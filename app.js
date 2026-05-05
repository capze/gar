// 垃圾分類應用的主要邏輯
class GarbageClassifier {
    constructor() {
        this.model = null;
        this.stream = null;
        this.isModelLoaded = false;
        this.labels = ['trash', 'shoes', 'plastic', 'glass'];
        this.categoryInfo = {
            'trash': '✨ 一般廢棄物 - 如紙巾、包裝紙等',
            'shoes': '👟 鞋類 - 如破舊鞋子等',
            'plastic': '🥤 塑膠製品 - 如塑膠瓶、塑膠袋等',
            'glass': '🍾 玻璃製品 - 如玻璃瓶、玻璃杯等'
        };
        
        this.elements = {
            camera: document.getElementById('camera'),
            canvas: document.getElementById('canvas'),
            startBtn: document.getElementById('startBtn'),
            captureBtn: document.getElementById('captureBtn'),
            stopBtn: document.getElementById('stopBtn'),
            resultSection: document.getElementById('resultSection'),
            capturedImage: document.getElementById('capturedImage'),
            predictionResults: document.getElementById('predictionResults'),
            retakeBtn: document.getElementById('retakeBtn'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            statusMessage: document.getElementById('statusMessage')
        };

        this.init();
    }

    async init() {
        this.showStatus('正在初始化應用...', 'warning');
        
        try {
            // 檢查瀏覽器支援
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('您的瀏覽器不支援攝像頭功能，請使用 Chrome、Firefox 或 Safari 瀏覽器。');
            }

            // 初始化按鈕事件
            this.setupEventListeners();
            
            // 載入模型
            await this.loadModel();
            
            this.showStatus('应用就绪！請點擊「開啟相機」開始', 'success');
        } catch (error) {
            console.error('初始化失敗:', error);
            this.showStatus(`初始化失敗: ${error.message}`, 'error');
        }
    }

    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startCamera());
        this.elements.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.elements.stopBtn.addEventListener('click', () => this.stopCamera());
        this.elements.retakeBtn.addEventListener('click', () => this.retakPhoto());
    }

    async loadModel() {
        try {
            this.showStatus('正在加載模型...', 'warning');
            
            // 使用 Teachable Machine API 加載模型
            const URL = './garbage/model.json';
            const metadataURL = './garbage/metadata.json';
            
            // 創建模型引用
            this.model = await tmImage.load(URL, metadataURL);
            this.isModelLoaded = true;
            
            console.log('模型加載成功');
            this.showStatus('模型載入完成！', 'success');
        } catch (error) {
            console.error('模型加載失敗:', error);
            throw new Error(`模型加載失敗: ${error.message}`);
        }
    }

    async startCamera() {
        try {
            this.showStatus('正在請求相機權限...', 'warning');
            
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.elements.camera.srcObject = this.stream;

            // 等待視頻加載
            await new Promise(resolve => {
                this.elements.camera.onloadedmetadata = resolve;
            });

            this.elements.startBtn.disabled = true;
            this.elements.captureBtn.disabled = false;
            this.elements.stopBtn.disabled = false;
            this.elements.resultSection.style.display = 'none';

            this.showStatus('相機已開啟', 'success');
        } catch (error) {
            console.error('相機訪問失敗:', error);
            if (error.message.includes('Permission denied')) {
                this.showStatus('✗ 您拒絕了相機訪問權限。請檢查瀏覽器設定。', 'error');
            } else if (error.message.includes('NotFoundError')) {
                this.showStatus('✗ 未找到相機設備。請檢查硬體設定。', 'error');
            } else {
                this.showStatus(`✗ 相機訪問失敗: ${error.message}`, 'error');
            }
        }
    }

    async capturePhoto() {
        if (!this.stream) {
            this.showStatus('相機未開啟', 'error');
            return;
        }

        try {
            // 擷取視頻幀
            const video = this.elements.camera;
            const canvas = this.elements.canvas;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // 繪製視頻幀到 canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 取得圖像數據
            const imageData = canvas.toDataURL('image/jpeg');
            
            // 顯示拍攝的照片
            this.elements.capturedImage.src = imageData;

            // 進行預測
            await this.predict(canvas);

            // 顯示結果
            this.elements.resultSection.style.display = 'block';
            this.elements.resultSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('拍照失敗:', error);
            this.showStatus(`拍照失敗: ${error.message}`, 'error');
        }
    }

    async predict(canvas) {
        if (!this.isModelLoaded || !this.model) {
            this.showStatus('模型未加載', 'error');
            return;
        }

        try {
            // 顯示載入指示器
            this.showLoading(true);

            // 執行預測
            const predictions = await this.model.predict(canvas);

            // 隱藏載入指示器
            this.showLoading(false);

            // 顯示預測結果
            this.displayPredictions(predictions);

        } catch (error) {
            console.error('預測失敗:', error);
            this.showLoading(false);
            this.showStatus(`預測失敗: ${error.message}`, 'error');
        }
    }

    displayPredictions(predictions) {
        // 排序預測結果（從高到低）
        const sortedPredictions = [...predictions].sort((a, b) => b.probability - a.probability);

        const resultsHTML = sortedPredictions.map((pred, index) => {
            const percentage = (pred.probability * 100).toFixed(2);
            const confidence = pred.probability;
            
            // 根據信心度設定樣式
            let confidentClass = 'low-confidence';
            if (confidence >= 0.7) {
                confidentClass = 'high-confidence';
            } else if (confidence >= 0.4) {
                confidentClass = 'medium-confidence';
            }

            // 第一個預測是最有可能的
            const isBestMatch = index === 0;

            return `
                <div class="prediction-item ${confidentClass}">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="prediction-label">
                                ${this.labels[predictions.indexOf(pred)] || pred.className}
                                ${isBestMatch && confidence >= 0.6 ? '<span class="high-confidence-badge">最可能</span>' : ''}
                            </span>
                            <span class="prediction-confidence">${percentage}%</span>
                        </div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 新增類別信息
        const topPrediction = sortedPredictions[0];
        const labelName = this.labels[predictions.indexOf(topPrediction)];
        const categoryDescription = this.categoryInfo[labelName] || '';

        const categoryHTML = categoryDescription ? `
            <div class="category-info">
                <strong>📌 類別說明:</strong> ${categoryDescription}
            </div>
        ` : '';

        this.elements.predictionResults.innerHTML = resultsHTML + categoryHTML;

        // 如果最高信心度 >= 60%，顯示成功提示
        if (topPrediction.probability >= 0.6) {
            this.showStatus(`✓ 辨識成功！最可能是 "${labelName}"`, 'success');
        } else if (topPrediction.probability >= 0.4) {
            this.showStatus(`△ 辨識結果可能不太準確，請重新拍照。`, 'warning');
        } else {
            this.showStatus(`✗ 無法準確辨識，請重新拍照。`, 'error');
        }
    }

    retakPhoto() {
        this.elements.resultSection.style.display = 'none';
        this.elements.statusMessage.textContent = '';
        this.elements.statusMessage.className = 'status-message';
    }

    stopCamera() {
        if (this.stream) {
            // 停止所有軌道
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.elements.camera.srcObject = null;
        this.elements.startBtn.disabled = false;
        this.elements.captureBtn.disabled = true;
        this.elements.stopBtn.disabled = true;
        this.elements.resultSection.style.display = 'none';

        this.showStatus('相機已關閉', 'warning');
    }

    showLoading(show) {
        this.elements.loadingIndicator.style.display = show ? 'flex' : 'none';
    }

    showStatus(message, type = 'info') {
        const statusEl = this.elements.statusMessage;
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;

        // 3 秒後自動清除非錯誤信息
        if (type !== 'error') {
            setTimeout(() => {
                if (statusEl.textContent === message) {
                    statusEl.textContent = '';
                    statusEl.className = 'status-message';
                }
            }, 3000);
        }
    }
}

// 當 DOM 加載完成時初始化
document.addEventListener('DOMContentLoaded', () => {
    new GarbageClassifier();
});
