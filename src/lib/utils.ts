import sharp from "sharp";

export interface LogResponse {
  logs?: any[];
  message?: string;
}

export interface HarFile {
  log: {
    entries: HarEntry[];
  };
}

export interface HarEntry {
  startedDateTime: string;
  request: {
    method: string;
    url: string;
    queryString?: { name: string; value: string }[];
  };
  response: {
    status: number;
    statusText?: string;
    _error?: string;
  };
  serverIPAddress?: string;
  time?: number;
}

export function validateResponse(
  response: Response,
  logType: string,
): LogResponse | null {
  if (!response.ok) {
    if (response.status === 404) {
      return { message: `No ${logType} available for this session` };
    }
    if (response.status === 401 || response.status === 403) {
      return {
        message: `Unable to access ${logType} - please check your credentials`,
      };
    }
    return { message: `Unable to fetch ${logType} at this time` };
  }
  return null;
}

export function sanitizeUrlParam(param: string): string {
  // Remove any characters that could be used for command injection
  return param.replace(/[;&|`$(){}[\]<>]/g, "");
}

const ONE_MB = 1048576;

//Compresses a base64 image intelligently to keep it under 1 MB if needed.
export async function maybeCompressBase64(base64: string): Promise<string> {
  const buffer = Buffer.from(base64, "base64");

  if (buffer.length <= ONE_MB) {
    return base64;
  }

  const sizeRatio = 1048576 / buffer.length;
  const estimatedQuality = Math.floor(sizeRatio * 100);
  const quality = Math.min(95, Math.max(30, estimatedQuality));

  const compressedBuffer = await sharp(buffer).png({ quality }).toBuffer();

  return compressedBuffer.toString("base64");
}

export async function assertOkResponse(response: Response, action: string) {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Invalid session ID for ${action}`);
    }
    throw new Error(
      `Failed to fetch logs for ${action}: ${response.statusText}`,
    );
  }
}

export function filterLinesByKeywords(
  logText: string,
  keywords: string[],
): string[] {
  return logText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) =>
      keywords.some((keyword) => line.toLowerCase().includes(keyword)),
    );
}
