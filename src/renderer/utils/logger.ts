/**
 * 渲染進程日誌工具
 * 將日誌發送到主進程進行記錄
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogErrorParams {
  message: string;
  stack?: string;
  componentStack?: string;
}

class RendererLogger {
  private log(level: LogLevel, ...args: unknown[]) {
    const message = args
      .map((arg) => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');

    // 在開發模式下也輸出到控制台
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      consoleMethod(`[${level.toUpperCase()}]`, ...args);
    }

    // 發送到主進程記錄（如果可用）
    if (window.electronAPI?.log) {
      window.electronAPI.log(level, message);
    }
  }

  debug(...args: unknown[]) {
    this.log('debug', ...args);
  }

  info(...args: unknown[]) {
    this.log('info', ...args);
  }

  warn(...args: unknown[]) {
    this.log('warn', ...args);
  }

  error(...args: unknown[]) {
    this.log('error', ...args);
  }

  errorWithDetails(params: LogErrorParams) {
    const message = `錯誤: ${params.message}${params.stack ? `\n堆疊: ${params.stack}` : ''}${params.componentStack ? `\n組件堆疊: ${params.componentStack}` : ''}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.error(message);
    }

    if (window.electronAPI?.logError) {
      window.electronAPI.logError(params);
    }
  }
}

export const logger = new RendererLogger();
