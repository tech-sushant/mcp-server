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

// Platform utilities for cross-platform support
export const PLATFORM_UTILS = {
  isWindows: process.platform === "win32",
  isMac: process.platform === "darwin",
  isAppleSilicon: process.platform === "darwin" && process.arch === "arm64",
  getPlatformLabel: () => {
    switch (process.platform) {
      case "win32":
        return "Windows";
      case "darwin":
        return "macOS";
      case "linux":
        return "Linux";
      default:
        return process.platform;
    }
  },
};
