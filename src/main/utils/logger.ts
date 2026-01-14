import log from 'electron-log';
import { app } from 'electron';
import { join } from 'path';

/**
 * 配置主進程日誌系統
 */
export function initializeLogger() {
  // 設置日誌文件位置
  log.transports.file.resolvePathFn = () => {
    const userDataPath = app.getPath('userData');
    return join(userDataPath, 'logs', 'main.log');
  };

  // 配置日誌級別
  log.transports.file.level = 'info';
  log.transports.console.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

  // 配置日誌格式
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
  log.transports.console.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}';

  // 限制日誌文件大小（10MB）
  log.transports.file.maxSize = 10 * 1024 * 1024;

  // 覆蓋 console 方法，將所有 console 輸出重定向到日誌
  if (process.env.NODE_ENV === 'production') {
    console.log = log.log;
    console.error = log.error;
    console.warn = log.warn;
    console.info = log.info;
    console.debug = log.debug;
  }

  log.info('日誌系統已初始化');
}

// 導出日誌實例供其他模組使用
export { log };
