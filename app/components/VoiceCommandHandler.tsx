import React, { useEffect, useState, useRef } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/solid';

interface VoiceCommandHandlerProps {
  transcript: string;
  isFinal: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSaveTranscript: () => void;
  onClearTranscript: () => void;
}

const VoiceCommandHandler: React.FC<VoiceCommandHandlerProps> = ({
  transcript,
  isFinal,
  onStartRecording,
  onStopRecording,
  onSaveTranscript,
  onClearTranscript,
}) => {
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandDetected, setCommandDetected] = useState<boolean>(false);
  const [wakeWordDetected, setWakeWordDetected] = useState<boolean>(false);
  const wakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 重置喚醒狀態的函數
  const resetWakeState = () => {
    setWakeWordDetected(false);
    if (wakeTimeoutRef.current) {
      clearTimeout(wakeTimeoutRef.current);
      wakeTimeoutRef.current = null;
    }
  };

  // 檢測喚醒詞
  useEffect(() => {
    if (isFinal && transcript) {
      const lowerTranscript = transcript.toLowerCase();

      // 檢測各種可能的喚醒詞變體
      const wakeWords = [
        'hey summer',
        'hey, summer',
        'hey! summer',
        'hey summy',
        'hey, summy',
        'hey! summy',
        'hi summer',
        'hi, summer',
        'hi! summer',
      ];

      if (wakeWords.some((word) => lowerTranscript.includes(word))) {
        setWakeWordDetected(true);
        setLastCommand('喚醒詞已檢測');
        setCommandDetected(true);
        console.log('喚醒詞已檢測:', lowerTranscript);

        // 設定 5 秒後自動解除喚醒狀態
        if (wakeTimeoutRef.current) {
          clearTimeout(wakeTimeoutRef.current);
        }
        wakeTimeoutRef.current = setTimeout(() => {
          resetWakeState();
          console.log('喚醒狀態已超時');
        }, 5000);
      }
    }
  }, [transcript, isFinal]);

  // 檢測語音命令
  useEffect(() => {
    if (isFinal && transcript) {
      const lowerTranscript = transcript.toLowerCase();
      console.log('檢測命令:', lowerTranscript, '喚醒狀態:', wakeWordDetected);

      // 定義命令及其變體
      const commands = {
        startRecording: [
          'start recording',
          'start',
          'start record',
          '開始錄音',
          '開始',
        ],
        stopRecording: [
          'stop recording',
          'stop',
          'stop record',
          '停止錄音',
          '停止',
        ],
        saveTranscript: ['save', 'save transcript', '儲存', '儲存轉錄'],
        clearTranscript: ['clear', 'clear transcript', '清除', '清除轉錄'],
      };

      // 如果已經喚醒或包含喚醒詞，則檢測命令
      if (
        wakeWordDetected ||
        lowerTranscript.includes('hey summer') ||
        lowerTranscript.includes('hey, summer')
      ) {
        // 檢測語音命令
        if (
          commands.startRecording.some((cmd) => lowerTranscript.includes(cmd))
        ) {
          setLastCommand('開始錄音');
          setCommandDetected(true);
          onStartRecording();
          resetWakeState();
          console.log('執行開始錄音命令');
        } else if (
          commands.stopRecording.some((cmd) => lowerTranscript.includes(cmd))
        ) {
          setLastCommand('停止');
          setCommandDetected(true);
          onStopRecording();
          resetWakeState();
        } else if (
          commands.saveTranscript.some((cmd) => lowerTranscript.includes(cmd))
        ) {
          setLastCommand('儲存轉錄');
          setCommandDetected(true);
          onSaveTranscript();
          resetWakeState();
        } else if (
          commands.clearTranscript.some((cmd) => lowerTranscript.includes(cmd))
        ) {
          setLastCommand('清除轉錄');
          setCommandDetected(true);
          onClearTranscript();
          resetWakeState();
        }
      }
    }
  }, [
    transcript,
    isFinal,
    onStartRecording,
    onStopRecording,
    onSaveTranscript,
    onClearTranscript,
    wakeWordDetected,
  ]);

  // 清理定時器
  useEffect(() => {
    return () => {
      if (wakeTimeoutRef.current) {
        clearTimeout(wakeTimeoutRef.current);
      }
    };
  }, []);

  // 重置命令檢測狀態
  useEffect(() => {
    if (commandDetected) {
      const timer = setTimeout(() => {
        setCommandDetected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [commandDetected]);

  return (
    <div className="absolute top-4 left-4">
      <div className="flex items-center space-x-2">
        {/* 喚醒狀態圖示 */}
        {wakeWordDetected && (
          <div className="relative">
            <div className="absolute -inset-1 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="relative bg-black/50 p-2 rounded-full">
              <MicrophoneIcon className="h-6 w-6 text-white animate-bounce" />
            </div>
          </div>
        )}

        {/* 狀態文字 */}
        <div className="bg-black/50 p-2 rounded-lg">
          {commandDetected && (
            <div className="text-sm text-green-400">
              已執行命令: {lastCommand}
            </div>
          )}
          {wakeWordDetected && !commandDetected && (
            <div className="text-sm text-yellow-400">
              喚醒詞已檢測，請說出命令
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceCommandHandler;
