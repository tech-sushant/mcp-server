import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import httpsProxyAgentPkg from "https-proxy-agent";
const { HttpsProxyAgent } = httpsProxyAgentPkg;
import * as https from "https";
import * as fs from "fs";
import config from "../config.js";

type RequestOptions = {
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  body?: any;
  raise_error?: boolean; // default: true
};

class ApiResponse<T = any> {
  private _response: AxiosResponse<T>;

  constructor(response: AxiosResponse<T>) {
    this._response = response;
  }

  get data(): T {
    return this._response.data;
  }

  get status(): number {
    return this._response.status;
  }

  get statusText(): string {
    return this._response.statusText;
  }

  get headers(): Record<string, string> {
    const raw = this._response.headers;
    const sanitized: Record<string, string> = {};

    for (const key in raw) {
      const value = raw[key];
      if (typeof value === "string") {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  get config(): AxiosRequestConfig {
    return this._response.config;
  }

  get url(): string | undefined {
    return this._response.config.url;
  }

  get ok(): boolean {
    return this._response.status >= 200 && this._response.status < 300;
  }
}

// Utility to create HTTPS agent if needed (proxy/CA)
function getAxiosAgent(): AxiosRequestConfig["httpsAgent"] | undefined {
  const proxyHost = config.browserstackLocalOptions.proxyHost;
  const proxyPort = config.browserstackLocalOptions.proxyPort;
  const caCertPath = config.browserstackLocalOptions.useCaCertificate;

  // If both proxy host and port are defined
  if (proxyHost && proxyPort) {
    const proxyUrl = `http://${proxyHost}:${proxyPort}`;
    if (caCertPath && fs.existsSync(caCertPath)) {
      // Proxy + CA cert
      const ca = fs.readFileSync(caCertPath);
      return new HttpsProxyAgent({
        host: proxyHost,
        port: Number(proxyPort),
        ca,
        rejectUnauthorized: false, // Set to true if you want strict SSL
      });
    } else {
      // Proxy only
      return new HttpsProxyAgent(proxyUrl);
    }
  } else if (caCertPath && fs.existsSync(caCertPath)) {
    // CA only
    return new https.Agent({
      ca: fs.readFileSync(caCertPath),
      rejectUnauthorized: false, // Set to true for strict SSL
    });
  }
  // Default agent (no proxy, no CA)
  return undefined;
}

class ApiClient {
  private instance = axios.create();

  private get axiosAgent() {
    return getAxiosAgent();
  }

  private async requestWrapper<T>(
    fn: (agent: AxiosRequestConfig["httpsAgent"]) => Promise<AxiosResponse<T>>,
    raise_error: boolean = true,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fn(this.axiosAgent);
      return new ApiResponse<T>(res);
    } catch (error: any) {
      if (error.response && !raise_error) {
        return new ApiResponse<T>(error.response);
      }
      throw error;
    }
  }

  async get<T = any>({
    url,
    headers,
    params,
    raise_error = true,
  }: RequestOptions): Promise<ApiResponse<T>> {
    return this.requestWrapper<T>(
      (agent) =>
        this.instance.get<T>(url, { headers, params, httpsAgent: agent }),
      raise_error,
    );
  }

  async post<T = any>({
    url,
    headers,
    body,
    raise_error = true,
  }: RequestOptions): Promise<ApiResponse<T>> {
    return this.requestWrapper<T>(
      (agent) =>
        this.instance.post<T>(url, body, { headers, httpsAgent: agent }),
      raise_error,
    );
  }

  async put<T = any>({
    url,
    headers,
    body,
    raise_error = true,
  }: RequestOptions): Promise<ApiResponse<T>> {
    return this.requestWrapper<T>(
      (agent) =>
        this.instance.put<T>(url, body, { headers, httpsAgent: agent }),
      raise_error,
    );
  }

  async patch<T = any>({
    url,
    headers,
    body,
    raise_error = true,
  }: RequestOptions): Promise<ApiResponse<T>> {
    return this.requestWrapper<T>(
      (agent) =>
        this.instance.patch<T>(url, body, { headers, httpsAgent: agent }),
      raise_error,
    );
  }

  async delete<T = any>({
    url,
    headers,
    params,
    raise_error = true,
  }: RequestOptions): Promise<ApiResponse<T>> {
    return this.requestWrapper<T>(
      (agent) =>
        this.instance.delete<T>(url, { headers, params, httpsAgent: agent }),
      raise_error,
    );
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, RequestOptions };
