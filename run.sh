#!/bin/bash

# 垃圾分類應用 - 快速部署腳本

set -e

echo "======================================================"
echo "♻️  垃圾分類辨識系統 - 部署腳本"
echo "======================================================"

# 檢查環境
check_env() {
    echo "🔍 檢查環境..."
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ 未找到 Python 3"
        echo "💡 請安裝 Python 3.6+"
        exit 1
    fi
    
    echo "✅ Python 3 已安裝: $(python3 --version)"
}

# 驗證文件
verify_files() {
    echo "🔍 驗證文件..."
    
    local required_files=(
        "index.html"
        "styles.css"
        "app.js"
        "server.py"
        "garbage/model.json"
        "garbage/metadata.json"
        "garbage/weights.bin"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            size=$(du -h "$file" | cut -f1)
            echo "  ✅ $file ($size)"
        else
            echo "  ❌ 缺少 $file"
            exit 1
        fi
    done
    
    echo "✅ 所有文件完整"
}

# 顯示應用信息
show_info() {
    echo ""
    echo "======================================================"
    echo "📱 應用信息"
    echo "======================================================"
    
    echo "🎯 分類目標："
    echo "   • Trash (垃圾) - 紙巾、包裝紙"
    echo "   • Shoes (鞋類) - 破舊鞋子"
    echo "   • Plastic (塑膠) - 塑膠瓶、塑膠袋"
    echo "   • Glass (玻璃) - 玻璃瓶、杯子"
    echo ""
    echo "⚙️  技術棧："
    echo "   • Frontend: HTML5 + CSS3 + Vanilla JS"
    echo "   • ML: TensorFlow.js + Teachable Machine"
    echo "   • Model: MobileNet v2 (~92KB model + 2.1MB weights)"
    echo ""
    echo "📊 性能："
    echo "   • 推理時間: 200-500ms"
    echo "   • 首次加載: 2-5秒"
    echo "   • 內存占用: 100-200MB"
}

# 啟動服務器
start_server() {
    echo ""
    echo "======================================================"
    echo "🚀 啟動服務器"
    echo "======================================================"
    echo ""
    echo "📍 訪問地址："
    echo "   • 本地: http://localhost:8000"
    echo "   • 遠端: http://<你的IP>:8000"
    echo ""
    echo "💡 提示："
    echo "   • 攝像頭 API 需要 HTTPS 或 localhost"
    echo "   • 首次訪問需要加載 ~2MB 模型"
    echo "   • 按 Ctrl+C 停止服務器"
    echo ""
    echo "======================================================"
    echo ""
    
    python3 server.py
}

# 主函數
main() {
    check_env
    verify_files
    show_info
    start_server
}

# 執行
main
