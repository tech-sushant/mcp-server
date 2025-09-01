import { apiClient } from "../../lib/apiClient.js";
import { randomUUID } from "node:crypto";
import logger from "../../logger.js";
import config from "../../config.js";
import { ScanType } from "../accessibility.js";
import {
  isLocalURL,
  ensureLocalBinarySetup,
  killExistingBrowserStackLocalProcesses,
} from "../../lib/local.js";

export interface AccessibilityScanResponse {
  success: boolean;
  data?: { id: string; scanRunId: string };
  errors?: string[];
}

export interface AccessibilityScanStatus {
  success: boolean;
  data?: { status: string };
  errors?: string[];
}

export class AccessibilityScanner {
  private auth: { username: string; password: string } | undefined;

  public setAuth(auth: { username: string; password: string }): void {
    this.auth = auth;
  }

  public buildScanRequestBody(
    name: string,
    urlList: string[],
    scanTypes: ScanType[],
    authConfigId?: number,
  ) {
    if (!this.auth?.username || !this.auth?.password) {
      throw new Error(
        "BrowserStack credentials are not set for AccessibilityScanner.",
      );
    }
    const hasLocal = urlList.some(isLocalURL);
    const localIdentifier = randomUUID();
    const localHosts = new Set(["127.0.0.1", "localhost", "0.0.0.0"]);
    const BS_LOCAL_DOMAIN = "bs-local.com";

    if (config.USE_OWN_LOCAL_BINARY_PROCESS && hasLocal) {
      throw new Error(
        "Cannot start scan with local URLs when using own BrowserStack Local binary process. Please set USE_OWN_LOCAL_BINARY_PROCESS to false.",
      );
    }

    if (config.REMOTE_MCP && hasLocal) {
      throw new Error(
        "Local URLs are not supported in this remote mcp. Please use a public URL.",
      );
    }

    const transformedUrlList = urlList.map((url) => {
      try {
        const parsed = new URL(url);
        if (localHosts.has(parsed.hostname)) {
          parsed.hostname = BS_LOCAL_DOMAIN;
          return parsed.toString();
        }
        return url;
      } catch (e) {
        logger.warn(`[AccessibilityScan] Invalid URL skipped: ${e}`);
        return url;
      }
    });

    let scanData: Record<string, any> = {};

    if (scanTypes.includes(ScanType.Accessibility)) {
      scanData = {
        ...scanData,
        a11yConfig: {
          wcagVersion: {
            label: "WCAG 2.1 AA",
            value: "wcag21aa",
          },
          advanced: true,
          needsReview: true,
          bestPractices: false,
        },
      };
    }
    if (scanTypes.includes(ScanType.Performance)) {
      scanData = {
        ...scanData,
        performanceConfig: { enabled: true },
      };
    }
    if (scanTypes.includes(ScanType.Visual)) {
      scanData = {
        ...scanData,
        visualConfig: {
          scannerDelay: { id: "5 seconds", label: "5 seconds", value: 5 },
          enableLayout: false,
        },
      };
    }
    
    if (scanTypes.includes(ScanType.Responsive)) {
      scanData = {
        ...scanData,
        responsiveConfig: {
          viewportSettings: ["1920", "1280", "375"].map((v) => ({
            label: `viewport-${v}`,
            value: [v],
          })),
        },
      };
    }

    if (scanTypes.includes(ScanType.BrokenLink)) {
      scanData = {
        ...scanData,
        brokenLinkConfig: {
          enabled: true,
          checkExternalLinks: false,
          maxDepth: 3,
        },
      };
    }

    const requestBody = {
      name,
      urlList: transformedUrlList,
      recurring: false,
      ...(authConfigId && { authConfigId }),
      ...(Object.keys(scanData).length > 0 ? { scanData } : {}),
      ...(hasLocal && {
        localTestingInfo: {
          localIdentifier,
          localEnabled: true,
        },
      }),
    };

    return requestBody;
  }

  async startScan(
    name: string,
    urlList: string[],
    scanTypes: ScanType[],
    authConfigId?: number,
  ) {
    if (!this.auth?.username || !this.auth?.password) {
      throw new Error(
        "BrowserStack credentials are not set for AccessibilityScanner.",
      );
    }
    // Check if any URL is local
    const hasLocal = urlList.some(isLocalURL);
    const localIdentifier = randomUUID();

    if (config.USE_OWN_LOCAL_BINARY_PROCESS && hasLocal) {
      throw new Error(
        "Cannot start scan with local URLs when using own BrowserStack Local binary process. Please set USE_OWN_LOCAL_BINARY_PROCESS to false.",
      );
    }

    if (config.REMOTE_MCP && hasLocal) {
      throw new Error(
        "Local URLs are not supported in this remote mcp. Please use a public URL.",
      );
    }

    if (hasLocal) {
      await ensureLocalBinarySetup(
        this.auth.username,
        this.auth.password,
        localIdentifier,
      );
    } else {
      await killExistingBrowserStackLocalProcesses();
    }

    const requestBody = this.buildScanRequestBody(
      name,
      urlList,
      scanTypes,
      authConfigId
    );

    try {
      const response = await apiClient.post<AccessibilityScanResponse>({
        url: "https://api-accessibility.browserstack.com/api/website-scanner/v1/scans",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${this.auth.username}:${this.auth.password}`).toString(
              "base64",
            ),
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      const data = response.data;
      if (!data.success)
        throw new Error(`Unable to start scan: ${data.errors?.join(", ")}`);
      return data;
    } catch (err: any) {
      // apiClient throws generic errors, try to extract message
      if (err?.response?.status === 422) {
        throw new Error(
          "A scan with this name already exists. please update the name and run again.",
        );
      }
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        String(err);
      throw new Error(`Failed to start scan: ${msg}`);
    }
  }

  async pollStatus(
    scanId: string,
    scanRunId: string,
  ): Promise<AccessibilityScanStatus> {
    try {
      const response = await apiClient.get<AccessibilityScanStatus>({
        url: `https://api-accessibility.browserstack.com/api/website-scanner/v1/scans/${scanId}/scan_runs/${scanRunId}/status`,
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${this.auth?.username}:${this.auth?.password}`,
            ).toString("base64"),
        },
      });
      const data = response.data;
      if (!data.success)
        throw new Error(`Failed to get status: ${data.errors?.join(", ")}`);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      throw new Error(`Failed to get scan status: ${msg}`);
    }
  }

  async waitUntilComplete(
    scanId: string,
    scanRunId: string,
    context: any,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let timepercent = 0;
      let dotCount = 1;
      const interval = setInterval(async () => {
        try {
          const statusResp = await this.pollStatus(scanId, scanRunId);
          const status = statusResp.data!.status;
          timepercent += 1.67;
          const progress = status === "completed" ? 100 : timepercent;
          const dots = ".".repeat(dotCount);
          dotCount = (dotCount % 4) + 1;
          const message =
            status === "completed" || status === "failed"
              ? `Scan completed with status: ${status}`
              : `Scan in progress${dots}`;
          await context.sendNotification({
            method: "notifications/progress",
            params: {
              progressToken: context._meta?.progressToken ?? "NOT_FOUND",
              message: message,
              progress: progress,
              total: 100,
            },
          });
          if (status === "completed" || status === "failed") {
            clearInterval(interval);
            resolve(status);
          }
        } catch (e) {
          clearInterval(interval);
          reject(e);
        }
      }, 5000);

      setTimeout(
        () => {
          clearInterval(interval);
          reject(new Error("Scan timed out after 5 minutes"));
        },
        5 * 60 * 1000,
      );
    });
  }
}
