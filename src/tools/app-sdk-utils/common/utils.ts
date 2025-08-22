export function getShellPrefix(): string {
  return process.platform === "win32" ? "cmd" : "bash";
}

export function sanitizeInput(input: string): string {
  // Basic sanitization - remove potentially dangerous characters
  return input.replace(/[;&|`$(){}[\]]/g, "");
}

export function isBrowserStackAppUrl(appPath: string): boolean {
  return appPath.startsWith("bs://");
}

export function generateBuildName(baseName: string = "app-automate"): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, "");
  return `${baseName}-${timestamp}`;
}

export function createError(
  message: string,
  context?: Record<string, any>,
): Error {
  const error = new Error(message);
  if (context) {
    (error as any).context = context;
  }
  return error;
}
