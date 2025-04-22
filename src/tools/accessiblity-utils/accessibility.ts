import axios from "axios";
import config from "../../config.js";
import { AxiosError } from "axios";

export interface AccessibilityScanResponse {
  success: boolean;
  data?: {
    id: string;
    scanRunId: string;
  };
  errors?: string[];
}

export async function startAccessibilityScan(
  name: string,
  urlList: string[],
): Promise<AccessibilityScanResponse> {
  try {
    const response = await axios.post<AccessibilityScanResponse>(
      "https://api-accessibility.browserstack.com/api/website-scanner/v1/scans",
      {
        name,
        urlList,
        recurring: false,
      },
      {
        auth: {
          username: config.browserstackUsername,
          password: config.browserstackAccessKey,
        },
      },
    );

    if (!response.data.success) {
      throw new Error(
        `Unable to create an accessibility scan: ${response.data.errors?.join(", ")}`,
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw new Error(
          `Failed to start accessibility scan: ${error.response?.data?.error}`,
        );
      } else {
        throw new Error(
          `Failed to start accessibility scan: ${error.response?.data?.message || error.message}`,
        );
      }
    }
    throw error;
  }
}

export interface AccessibilityScanStatus {
  success: boolean;
  data?: {
    status: string;
  };
  errors?: string[];
}

export async function pollScanStatus(
  scanId: string,
  scanRunId: string,
): Promise<string> {
  try {
    const response = await axios.get<AccessibilityScanStatus>(
      `https://api-accessibility.browserstack.com/api/website-scanner/v1/scans/${scanId}/scan_runs/${scanRunId}/status`,
      {
        auth: {
          username: config.browserstackUsername,
          password: config.browserstackAccessKey,
        },
      },
    );

    if (!response.data.success) {
      throw new Error(
        `Failed to get scan status: ${response.data.errors?.join(", ")}`,
      );
    }

    return response.data.data?.status || "unknown";
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to get scan status: ${error.response?.data?.message || error.message}`,
      );
    }
    throw error;
  }
}

export async function waitUntilScanComplete(
  scanId: string,
  scanRunId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const status = await pollScanStatus(scanId, scanRunId);
        if (status === "completed") {
          clearInterval(interval);
          resolve();
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 5000); // Poll every 5 seconds

    // Set a timeout of 5 minutes
    setTimeout(
      () => {
        clearInterval(interval);
        reject(new Error("Scan timed out after 5 minutes"));
      },
      5 * 60 * 1000,
    );
  });
}
