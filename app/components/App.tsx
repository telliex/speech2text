'use client';

import { useEffect, useRef, useState } from 'react';
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from '../context/DeepgramContextProvider';
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from '../context/MicrophoneContextProvider';
import Visualizer from './Visualizer';
import TranscriptHistory from './TranscriptHistory';
import VoiceCommandHandler from './VoiceCommandHandler';
import UserInstructions from './UserInstructions';

interface TranscriptItem {
  speaker: string;
  text: string;
  timestamp: number;
}

interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
  speaker?: number;
}

const App: () => JSX.Element = () => {
  const [caption, setCaption] = useState<string | undefined>(
    'Powered by Deepgram'
  );
  const [speakerId, setSpeakerId] = useState<string | undefined>(undefined);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [isTranscriptFinal, setIsTranscriptFinal] = useState<boolean>(false);
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const {
    setupMicrophone,
    microphone,
    startMicrophone,
    stopMicrophone,
    microphoneState,
  } = useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: 'nova-2',
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
        diarize: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      // 更新當前轉錄和最終狀態
      setCurrentTranscript(thisCaption);
      setIsTranscriptFinal(isFinal === true);

      // 獲取講者 ID - 從單詞中獲取
      const words = data.channel.alternatives[0].words as Word[];
      let currentSpeaker: string | undefined = undefined;
      if (words && words.length > 0 && words[0].speaker !== undefined) {
        currentSpeaker = words[0].speaker.toString();
        setSpeakerId(currentSpeaker);
      }

      console.log('thisCaption', thisCaption);
      if (thisCaption !== '') {
        console.log('thisCaption !== ""', thisCaption);
        setCaption(thisCaption);

        // 如果是最終結果且有講者 ID，添加到轉錄歷史
        if (isFinal && currentSpeaker) {
          const newTranscript: TranscriptItem = {
            speaker: currentSpeaker,
            text: thisCaption,
            timestamp: Date.now(),
          };
          setTranscripts((prev) => [...prev, newTranscript]);
        }
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
          setSpeakerId(undefined);
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

  // 處理語音命令的函數
  const handleStartRecording = () => {
    setIsRecording(true);
    if (microphone && microphoneState === MicrophoneState.Ready) {
      startMicrophone();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (microphone && microphoneState === MicrophoneState.Open) {
      stopMicrophone();
    }
  };

  const handleSaveTranscript = () => {
    if (transcripts.length > 0) {
      // 創建一個包含所有轉錄的文本
      const transcriptText = transcripts
        .map((item) => `講者 ${item.speaker}: ${item.text}`)
        .join('\n\n');

      // 創建一個 Blob 對象
      const blob = new Blob([transcriptText], { type: 'text/plain' });

      // 創建一個下載連結
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, '-')}.txt`;

      // 觸發下載
      document.body.appendChild(a);
      a.click();

      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClearTranscript = () => {
    setTranscripts([]);
  };

  return (
    <>
      <div className="flex h-full antialiased">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full">
            {/* height 100% minus 8rem */}
            <div className="relative w-full h-full">
              {microphone && <Visualizer microphone={microphone} />}
              <div className="absolute bottom-[8rem] inset-x-0 max-w-4xl mx-auto text-center">
                {caption && (
                  <div className="bg-black/70 p-8">
                    {speakerId && (
                      <div className="text-sm text-blue-400 mb-2">
                        講者 {speakerId}
                      </div>
                    )}
                    <span>{caption}</span>
                  </div>
                )}
              </div>

              {/* 轉錄歷史 */}
              <div className="absolute top-4 right-4 w-80">
                <TranscriptHistory transcripts={transcripts} />
              </div>

              {/* 使用說明 */}
              <UserInstructions />

              {/* 語音命令處理器 */}
              <VoiceCommandHandler
                transcript={currentTranscript}
                isFinal={isTranscriptFinal}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onSaveTranscript={handleSaveTranscript}
                onClearTranscript={handleClearTranscript}
              />

              {/* 錄音狀態指示器 */}
              <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-lg">
                <div
                  className={`text-sm ${
                    isRecording ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {isRecording ? '錄音中...' : '未錄音'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
