/**
 * Comprehensive Debug Logger for AFFILIFY CRM Authentication
 * This logger provides hyper-detailed logging at every step of the authentication process
 */

export interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  component: string;
  action: string;
  details: Record<string, any>;
  stack?: string;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log a debug message
   */
  debug(component: string, action: string, details: Record<string, any> = {}) {
    this.addLog('DEBUG', component, action, details);
  }

  /**
   * Log an info message
   */
  info(component: string, action: string, details: Record<string, any> = {}) {
    this.addLog('INFO', component, action, details);
  }

  /**
   * Log a warning message
   */
  warn(component: string, action: string, details: Record<string, any> = {}) {
    this.addLog('WARN', component, action, details);
  }

  /**
   * Log an error message
   */
  error(component: string, action: string, details: Record<string, any> = {}, error?: Error) {
    this.addLog('ERROR', component, action, details, error?.stack);
  }

  /**
   * Add a log entry
   */
  private addLog(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', component: string, action: string, details: Record<string, any>, stack?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      action,
      details,
      stack,
    };

    this.logs.push(entry);

    // Console output in development
    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${level}] [${component}] ${action}`;
      console.log(prefix, JSON.stringify(details, null, 2));
      if (stack) console.log('Stack:', stack);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs filtered by component
   */
  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Export logs as CSV
   */
  exportAsCSV(): string {
    const headers = ['Timestamp', 'Level', 'Component', 'Action', 'Details'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.component,
      log.action,
      JSON.stringify(log.details),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    return csv;
  }
}

// Export singleton instance
export const logger = new DebugLogger();
