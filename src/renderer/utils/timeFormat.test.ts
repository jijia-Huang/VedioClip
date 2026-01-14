import { describe, it, expect } from 'vitest';
import { formatTime, parseTime, formatBitrate } from './timeFormat';

describe('formatTime', () => {
  it('應該正確格式化秒數', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(3665)).toBe('1:01:05');
  });

  it('應該處理負數和無效值', () => {
    expect(formatTime(-5)).toBe('0:00');
    expect(formatTime(NaN)).toBe('0:00');
    expect(formatTime(Infinity)).toBe('0:00');
  });

  it('應該正確顯示毫秒', () => {
    expect(formatTime(0, true)).toBe('0:00.00');
    expect(formatTime(30.5, true)).toBe('0:30.50');
    expect(formatTime(65.75, true)).toBe('1:05.75');
    expect(formatTime(3665.99, true)).toBe('1:01:05.99');
  });

  it('應該正確處理小數秒數', () => {
    expect(formatTime(30.123)).toBe('0:30');
    expect(formatTime(30.999)).toBe('0:30');
  });
});

describe('parseTime', () => {
  it('應該正確解析秒數格式', () => {
    expect(parseTime('0')).toBe(0);
    expect(parseTime('30')).toBe(30);
    expect(parseTime('65')).toBe(65);
  });

  it('應該正確解析分:秒格式', () => {
    expect(parseTime('1:05')).toBe(65);
    expect(parseTime('10:30')).toBe(630);
    expect(parseTime('0:30')).toBe(30);
  });

  it('應該正確解析時:分:秒格式', () => {
    expect(parseTime('1:01:05')).toBe(3665);
    expect(parseTime('0:0:30')).toBe(30);
    expect(parseTime('2:30:45')).toBe(9045);
  });

  it('應該在格式無效時拋出錯誤', () => {
    expect(() => parseTime('1:2:3:4')).toThrow('無效的時間格式');
    expect(() => parseTime('')).toThrow();
    expect(() => parseTime('abc')).toThrow();
  });
});

describe('formatBitrate', () => {
  it('應該正確格式化位元率', () => {
    expect(formatBitrate(0)).toBe('未知');
    expect(formatBitrate(500)).toBe('500 bps');
    expect(formatBitrate(1500)).toBe('1.50 kbps');
    expect(formatBitrate(1500000)).toBe('1.50 Mbps');
    expect(formatBitrate(5000000)).toBe('5.00 Mbps');
  });

  it('應該正確處理邊界值', () => {
    expect(formatBitrate(999)).toBe('999 bps');
    expect(formatBitrate(1000)).toBe('1.00 kbps');
    expect(formatBitrate(999999)).toBe('999.99 kbps');
    expect(formatBitrate(1000000)).toBe('1.00 Mbps');
  });
});
