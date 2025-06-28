// Import the logger
import { Log } from './utils/logger';

// Log an info message from a frontend page/component
Log("frontend", "info", "page", "User opened the MiniURL home page");

// Log an error
Log("frontend", "error", "component", "Failed to fetch shortened URL");
/**
 * Sends a log to the remote logging API.
 * @param {"backend"|"frontend"} stack
 * @param {"debug"|"info"|"warn"|"error"|"fatal"} level
 * @param {string} pkg - The package name (see allowed values)
 * @param {string} message - The log message
 */
export async function Log(stack, level, pkg, message) {
  const url = "http://20.244.56.144/evaluation-service/logs";
  const body = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // Optionally handle response here
    return await response.json();
  } catch (err) {
    // Optionally handle error here
    console.error("Logging failed:", err);
  }
}