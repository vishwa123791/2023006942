const LOG_LEVELS = {INFO: "INFO",WARN: "WARN",ERROR: "ERROR",DEBUG: "DEBUG",
};function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] [${level}] ${message} ${metaStr}`;
}
const logger = {
  info(message, meta = {}) {
    const line = formatLog(LOG_LEVELS.INFO, message, meta);
    const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    logs.push(line);
    localStorage.setItem("app_logs", JSON.stringify(logs));
  },
  warn(message, meta = {}) {
    const line = formatLog(LOG_LEVELS.WARN, message, meta);
    const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    logs.push(line);
    localStorage.setItem("app_logs", JSON.stringify(logs));
  },
  error(message, meta = {}) {
    const line = formatLog(LOG_LEVELS.ERROR, message, meta);
    const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    logs.push(line);
    localStorage.setItem("app_logs", JSON.stringify(logs));
  },
  debug(message, meta = {}) {
    const line = formatLog(LOG_LEVELS.DEBUG, message, meta);
    const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    logs.push(line);
    localStorage.setItem("app_logs", JSON.stringify(logs));
  },
};
export default logger;