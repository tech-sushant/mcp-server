import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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

class ApiClient {
  private instance = axios.create();

  private async requestWrapper<T>(
    fn: () => Promise<AxiosResponse<T>>,
    raise_error: boolean = true,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fn();
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
      () => this.instance.get<T>(url, { headers, params }),
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
      () => this.instance.post<T>(url, body, { headers }),
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
      () => this.instance.put<T>(url, body, { headers }),
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
      () => this.instance.patch<T>(url, body, { headers }),
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
      () => this.instance.delete<T>(url, { headers, params }),
      raise_error,
    );
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, RequestOptions };
