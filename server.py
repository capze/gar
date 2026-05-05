#!/usr/bin/env python3
"""
簡單的 HTTP 服務器用於開發測試
在本地開發環境中運行垃圾分類應用
"""

import http.server
import socketserver
import os
from pathlib import Path
import webbrowser
import time

PORT = 8000
HANDLER = http.server.SimpleHTTPRequestHandler

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # 自訂日誌輸出格式
        print(f"[{self.log_date_time_string()}] {format % args}")
    
    def end_headers(self):
        # 新增 CORS 頭部支援
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def start_server():
    """啟動 HTTP 伺服器"""
    # 變更工作目錄到項目根目錄
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("🚀 垃圾分類辨識系統 - 本地開發伺服器")
        print("=" * 60)
        print(f"\n📱 應用已啟動！")
        print(f"🌐 訪問地址: http://localhost:{PORT}")
        print(f"📱 手機測試: http://<你的電腦IP>:{PORT}")
        print(f"\n💡 提示:")
        print(f"   • 相機需要 HTTPS 連接或 localhost")
        print(f"   • 按 Ctrl+C 停止伺服器\n")
        print("=" * 60)
        
        # 嘗試自動打開瀏覽器
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n📛 伺服器已停止")
            print("=" * 60)

if __name__ == "__main__":
    start_server()
