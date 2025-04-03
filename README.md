# 即時語音轉錄與語音命令控制系統
# Real-time Speech Transcription and Voice Command Control System

> 本專案基於 [Next.js Live Transcription Starter](https://vercel.com/templates/next.js/nextjslive-transcription) 開發，加入語音命令控制與多語言支援功能。
>
> This project is developed based on [Next.js Live Transcription Starter](https://vercel.com/templates/next.js/nextjslive-transcription), with additional voice command control and multilingual support features.

這是一個結合即時語音轉錄和智慧語音命令的網頁應用程式。透過整合 Deepgram 的語音識別技術，系統能夠即時將語音轉換為文字，並支援多人對話的說話者辨識。使用者可以透過喚醒詞 "Hey Summer" 啟動語音命令模式，實現無接觸的操作體驗。系統支援中英文雙語指令，並搭配動態視覺回饋，打造直覺且友善的使用者介面。

A web application that combines real-time speech transcription with intelligent voice commands. By integrating Deepgram's speech recognition technology, the system can convert speech to text in real-time and support speaker diarization for multi-person conversations. Users can activate voice command mode using the wake word "Hey Summer", enabling hands-free operation. The system supports bilingual commands in both English and Chinese, coupled with dynamic visual feedback for an intuitive user interface.

## 技術實現 / Technical Implementation

- Frontend: Next.js, React, TypeScript
- UI: Tailwind CSS, Heroicons
- API: Deepgram Speech-to-Text
- State Management: React Hooks
- Animations: CSS Animations, Tailwind

## 快速開始 / Quick Start

### 安裝依賴 / Install Dependencies

```bash
npm install
```

### 環境設定 / Environment Setup

複製 `sample.env.local` 並建立新檔案 `.env.local`：
Copy the code from `sample.env.local` and create a new file called `.env.local`:

```bash
DEEPGRAM_API_KEY=YOUR-DG-API-KEY
```

在 [Deepgram console](https://console.deepgram.com/) 註冊並取得 API 金鑰。
Sign up at Deepgram console and get your API key.

### 執行應用 / Run Application

開發模式 / Development mode:
```bash
npm run dev
```

生產模式 / Production mode:
```bash
npm run build
npm run start
```

應用程式將在 [http://localhost:3000](http://localhost:3000) 運行。
The application will run at [http://localhost:3000](http://localhost:3000).

## 語音命令說明 / Voice Commands Guide

1. 喚醒詞 / Wake Word: "Hey Summer"
2. 可用命令 / Available Commands:
   - 開始錄音 / Start Recording
   - 停止錄音 / Stop Recording
   - 儲存轉錄 / Save Transcript
   - 清除轉錄 / Clear Transcript

## 系統需求 / System Requirements

- Node.js 18.0 或更高版本 / Node.js 18.0 or higher
- 現代網頁瀏覽器（支援 WebSocket 和 MediaRecorder API）
- Modern web browser (with WebSocket and MediaRecorder API support)
- 麥克風權限 / Microphone permission

## 問題回報 / Issue Reporting

如果您發現任何問題或有改進建議，請：
If you find any issues or have suggestions for improvements:

1. 檢查是否有相關的已存在 issue
   Check if there's an existing issue

2. 提供詳細的問題描述：
   Provide detailed information:
   - 問題的具體表現 / Issue description
   - 重現步驟 / Steps to reproduce
   - 預期行為 / Expected behavior
   - 系統環境 / Environment details

## 取得協助 / Getting Help

如需協助，您可以：
For assistance, you can:

1. 查看程式碼註解 / Check code comments
2. 參考 Deepgram API 文件 / Reference Deepgram API documentation
3. 在 GitHub 開啟 issue / Open an issue on GitHub
4. 透過 Pull Request 貢獻程式碼 / Contribute via Pull Requests

## 授權 / License

本專案使用 MIT 授權。詳見 [LICENSE](./LICENSE) 檔案。
This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
