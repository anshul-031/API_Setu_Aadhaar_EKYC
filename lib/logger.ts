// Centralized logging utility
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? data : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ? error : '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`[DEBUG] ${message}`, data ? data : '');
  }
};