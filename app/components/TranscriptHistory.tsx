import React, { useState, useEffect } from 'react';

interface TranscriptItem {
  speaker: string;
  text: string;
  timestamp: number;
}

interface TranscriptHistoryProps {
  transcripts: TranscriptItem[];
}

const TranscriptHistory: React.FC<TranscriptHistoryProps> = ({
  transcripts,
}) => {
  return (
    <div className="bg-black/50 p-4 rounded-lg max-h-60 overflow-y-auto">
      <h3 className="text-white text-lg mb-2">轉錄歷史</h3>
      <div className="space-y-2">
        {transcripts.map((item, index) => (
          <div key={index} className="bg-black/30 p-2 rounded">
            <div className="text-blue-400 text-sm">講者 {item.speaker}</div>
            <div className="text-white">{item.text}</div>
            <div className="text-gray-400 text-xs">
              {new Date(item.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptHistory;
