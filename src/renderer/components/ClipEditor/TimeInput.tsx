import { useState, useEffect } from 'react';

interface TimeInputProps {
  value: number; // 總秒數（包含小數）
  onChange: (seconds: number) => void;
  label: string;
  maxSeconds?: number; // 最大秒數（例如影片長度）
}

/**
 * 將秒數分解為分、秒、毫秒
 */
function parseSeconds(totalSeconds: number): { minutes: number; seconds: number; centiseconds: number } {
  if (!isFinite(totalSeconds) || totalSeconds < 0) {
    return { minutes: 0, seconds: 0, centiseconds: 0 };
  }

  const totalCentiseconds = Math.round(totalSeconds * 100);
  const minutes = Math.floor(totalCentiseconds / 6000);
  const remainingCentiseconds = totalCentiseconds % 6000;
  const seconds = Math.floor(remainingCentiseconds / 100);
  const centiseconds = remainingCentiseconds % 100;

  return { minutes, seconds, centiseconds };
}

/**
 * 將分、秒、毫秒組合成總秒數
 */
function combineToSeconds(minutes: number, seconds: number, centiseconds: number): number {
  return minutes * 60 + seconds + centiseconds / 100;
}

export function TimeInput({ value, onChange, label, maxSeconds }: TimeInputProps) {
  const [timeParts, setTimeParts] = useState(() => parseSeconds(value));

  // 當外部 value 改變時更新內部狀態
  useEffect(() => {
    setTimeParts(parseSeconds(value));
  }, [value]);

  const updateTime = (newParts: { minutes: number; seconds: number; centiseconds: number }) => {
    // 處理進位和借位
    let { minutes, seconds, centiseconds } = newParts;

    // 確保值在合理範圍內
    minutes = Math.max(0, minutes);
    seconds = Math.max(0, seconds);
    centiseconds = Math.max(0, centiseconds);

    // 處理毫秒進位（100 毫秒 = 1 秒）
    if (centiseconds >= 100) {
      seconds += Math.floor(centiseconds / 100);
      centiseconds = centiseconds % 100;
    }

    // 處理秒進位（60 秒 = 1 分鐘）
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds = seconds % 60;
    }

    // 處理借位：如果秒數為負，從分鐘借
    if (seconds < 0 && minutes > 0) {
      minutes -= 1;
      seconds += 60;
    }

    // 處理借位：如果毫秒為負，從秒借
    if (centiseconds < 0 && seconds > 0) {
      seconds -= 1;
      centiseconds += 100;
    } else if (centiseconds < 0 && minutes > 0) {
      minutes -= 1;
      seconds += 59;
      centiseconds += 100;
    }

    // 確保所有值都不為負數
    minutes = Math.max(0, minutes);
    // 如果分鐘為0且總時間小於60秒，秒數可以超過59
    const totalSecondsCheck = combineToSeconds(minutes, seconds, centiseconds);
    const shouldShowMinutes = totalSecondsCheck >= 60 || minutes > 0;
    seconds = Math.max(0, shouldShowMinutes ? Math.min(59, seconds) : seconds);
    centiseconds = Math.max(0, Math.min(99, centiseconds));

    const newTimeParts = { minutes, seconds, centiseconds };
    setTimeParts(newTimeParts);

    // 計算總秒數
    const totalSeconds = combineToSeconds(minutes, seconds, centiseconds);

    // 檢查最大值
    if (maxSeconds !== undefined && totalSeconds > maxSeconds) {
      const maxParts = parseSeconds(maxSeconds);
      setTimeParts(maxParts);
      onChange(maxSeconds);
    } else {
      onChange(totalSeconds);
    }
  };

  const handleIncrement = (field: 'minutes' | 'seconds' | 'centiseconds') => {
    const increment = field === 'centiseconds' ? 1 : 1;
    updateTime({
      ...timeParts,
      [field]: timeParts[field] + increment,
    });
  };

  const handleDecrement = (field: 'minutes' | 'seconds' | 'centiseconds') => {
    updateTime({
      ...timeParts,
      [field]: timeParts[field] - 1,
    });
  };

  const handleInputChange = (field: 'minutes' | 'seconds' | 'centiseconds', inputValue: string) => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) && inputValue !== '') {
      return; // 忽略無效輸入
    }

    const newValue = isNaN(numValue) ? 0 : Math.max(0, numValue);
    
    // 計算當前總秒數，判斷是否需要顯示分鐘
    const currentTotalSeconds = combineToSeconds(timeParts.minutes, timeParts.seconds, timeParts.centiseconds);
    const showMinutes = currentTotalSeconds >= 60 || timeParts.minutes > 0;
    
    // 設定最大值限制
    // 如果不顯示分鐘，秒數可以超過59（因為它實際上包含了分鐘的部分）
    const maxValue = field === 'minutes' ? 999 : field === 'seconds' ? (showMinutes ? 59 : 999) : 99;
    const clampedValue = Math.min(newValue, maxValue);

    updateTime({
      ...timeParts,
      [field]: clampedValue,
    });
  };

  // 判斷是否需要顯示分鐘欄位（總時間小於60秒時不顯示）
  const totalSeconds = combineToSeconds(timeParts.minutes, timeParts.seconds, timeParts.centiseconds);
  const showMinutes = totalSeconds >= 60 || timeParts.minutes > 0;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* 分鐘（只在需要時顯示） */}
        {showMinutes && (
          <>
            <div className="flex items-center gap-1 border border-gray-600 rounded-md overflow-hidden bg-gray-700">
              <button
                type="button"
                onClick={() => handleDecrement('minutes')}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold"
              >
                −
              </button>
              <input
                type="number"
                value={timeParts.minutes}
                onChange={(e) => handleInputChange('minutes', e.target.value)}
                min="0"
                max="999"
                className="w-16 px-2 py-1 text-center border-0 bg-gray-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleIncrement('minutes')}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold"
              >
                +
              </button>
            </div>
            <span className="text-gray-400 font-medium">分</span>
          </>
        )}

        {/* 秒 */}
        <div className="flex items-center gap-1 border border-gray-600 rounded-md overflow-hidden bg-gray-700">
          <button
            type="button"
            onClick={() => handleDecrement('seconds')}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold"
          >
            −
          </button>
          <input
            type="number"
            value={timeParts.seconds}
            onChange={(e) => handleInputChange('seconds', e.target.value)}
            min="0"
            max={showMinutes ? "59" : "999"}
            className="w-16 px-2 py-1 text-center border-0 bg-gray-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleIncrement('seconds')}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold"
          >
            +
          </button>
        </div>
        <span className="text-gray-400 font-medium">秒</span>

        {/* 毫秒（以 0.01 秒為單位，顯示為兩位數） */}
        <div className="flex items-center gap-1 border border-gray-600 rounded-md overflow-hidden bg-gray-700">
          <button
            type="button"
            onClick={() => handleDecrement('centiseconds')}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold"
          >
            −
          </button>
          <input
            type="number"
            value={timeParts.centiseconds}
            onChange={(e) => handleInputChange('centiseconds', e.target.value)}
            min="0"
            max="99"
            className="w-16 px-2 py-1 text-center border-0 bg-gray-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleIncrement('centiseconds')}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold"
          >
            +
          </button>
        </div>
        <span className="text-gray-400 font-medium">毫秒</span>
      </div>
    </div>
  );
}
