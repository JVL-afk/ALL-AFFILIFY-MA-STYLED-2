/**
 * Comprehensive Debug Logger for AFFILIFY CRM Authentication
 * This logger provides hyper-detailed logging at every step of the authentication process
 */

export interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  service: string; // New field: name_of_service
  component: string;
  action: string;
  message?: string; // New field: Human-readable log message
  trace_id?: string; // New field: UUID or OpenTelemetry Trace ID
  span_id?: string; // New field: OpenTelemetry Span ID
  user_id?: string; // New field: Optional, ID of the user performing the action
  campaign_id?: string; // New field: Optional, ID of the campaign
  subscriber_id?: string; // New field: Optional, ID of the subscriber
  details: Record<string, any>;
  stack?: string;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log a debug message
   */
  debug(service: string, component: string, action: string, message?: string, details: Record<string, any> = {}) {
    this.addLog('DEBUG', service, component, action, message, details);
  }

  /**
   * Log an info message
   */
  info(service: string, component: string, action: string, message?: string, details: Record<string, any> = {}) {
    this.addLog('INFO', service, component, action, message, details);
  }

  /**
   * Log a warning message
   */
  warn(service: string, component: string, action: string, message?: string, details: Record<string, any> = {}) {
    this.addLog('WARN', service, component, action, message, details);
  }

  /**
   * Log an error message
   */
  error(service: string, component: string, action: string, message?: string, details: Record<string, any> = {}, error?: Error) {
    this.addLog('ERROR', service, component, action, message, details, error?.stack);
  }

  /**
   * Add a log entry
   */
  private addLog(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', service: string, component: string, action: string, message?: string, details: Record<string, any>, stack?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service,
      component,
      action,
      message,
      details,
      stack,
      // Trace and entity IDs will be added by a wrapper or context provider
      // For now, they are optional in the interface and can be passed in details if needed
    };

    this.logs.push(entry);

    // Console output in development
    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${level}] [${service}] [${component}] ${action}`;
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
    const headers = ['Timestamp', 'Level', 'Service', 'Component', 'Action', 'Message', 'Details'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.service,
      log.component,
      log.action,
      log.message || '',
      JSON.stringify(log.details),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    return csv;
  }
}

// Export singleton instance
export const logger = new DebugLogger();
