import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type RequestOptions = {
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  body?: any;
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

class ApiClient {
  private instance = axios.create();

  async get<T = any>({
    url,
    headers,
    params,
  }: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.instance.get<T>(url, {
      headers,
      params,
    });
    return new ApiResponse<T>(res);
  }

  async post<T = any>({
    url,
    headers,
    body,
  }: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.instance.post<T>(url, body, {
      headers,
    });
    return new ApiResponse<T>(res);
  }

  async put<T = any>({
    url,
    headers,
    body,
  }: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.instance.put<T>(url, body, {
      headers,
    });
    return new ApiResponse<T>(res);
  }

  async patch<T = any>({
    url,
    headers,
    body,
  }: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.instance.patch<T>(url, body, {
      headers,
    });
    return new ApiResponse<T>(res);
  }

  async delete<T = any>({
    url,
    headers,
    params,
  }: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.instance.delete<T>(url, {
      headers,
      params,
    });
    return new ApiResponse<T>(res);
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, RequestOptions };
