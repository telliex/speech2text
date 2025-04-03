import React from 'react';

const UserInstructions: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 w-80 bg-black/70 p-4 rounded-lg text-white">
      <h3 className="text-lg font-bold mb-2 text-blue-400">使用說明</h3>
      <p className="text-sm mb-2">現在，使用者可以通過以下語音命令控制應用：</p>
      <p className="text-sm mb-2 text-yellow-400">
        首先說「Hey! Summer」喚醒助手，然後說出以下命令：
      </p>
      <ul className="text-sm space-y-1">
        <li>
          <span className="font-semibold">開始錄音</span>
          ：說「開始錄音」或「start recording」來開始錄音
        </li>
        <li>
          <span className="font-semibold">停止錄音</span>
          ：說「停止」或「stop」來停止錄音
        </li>
        <li>
          <span className="font-semibold">儲存轉錄</span>
          ：說「儲存」或「save」來將轉錄歷史下載為文本文件
        </li>
        <li>
          <span className="font-semibold">清除轉錄</span>
          ：說「清除」或「clear」來清除轉錄歷史
        </li>
      </ul>
    </div>
  );
};

export default UserInstructions;
