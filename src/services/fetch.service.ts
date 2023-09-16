import { API_URL } from "../constants/api";

interface IFetchServiceConstructor {
  body?: object;
  method: string;
  routeInfo: {
    route: string;
    params?: Record<string, string>;
    searchParams?: Record<string, string>;
  };
  abortController?: AbortController;
}

interface IFetchServiceRequest extends IFetchServiceConstructor {
  signal: AbortSignal;
  abortController?: never;
}

interface IHeaders {
  contentType?: string;
}

export class FetchService {
  private request: Request;
  private abortController: AbortController;

  constructor({ body, method, routeInfo, abortController }: IFetchServiceConstructor) {
    this.abortController = abortController ?? new AbortController();

    this.request = this.buildRequest({ body, method, routeInfo, signal: this.abortController.signal });
  }

  public async sendRequest<T>(): Promise<T> {
    const response = await fetch(this.request);
    const result = await response.json();
    return result;
  }

  public clearFetch() {
    this.abortController.abort();
  }

  private buildRequest({ body, method, routeInfo, signal }: IFetchServiceRequest): Request {
    const url = this.buildURL(routeInfo);

    let requestBody: string | undefined;
    if (body) {
      requestBody = JSON.stringify(body);
    }

    const contentType = requestBody && "application/json";
    const headers = this.buildHeaders({ contentType });

    return new Request(url, {
      body: requestBody,
      method,
      signal,
      headers,
    });
  }

  private buildURL(routeInfo: IFetchServiceConstructor["routeInfo"]): URL {
    if (!API_URL) throw new Error("Does not have API_URL!");

    const url = new URL(API_URL);
    url.pathname = routeInfo.route;

    for (const key in routeInfo.params) {
      const param = routeInfo.params[key];
      url.pathname += param + "/";
    }

    for (const key in routeInfo.searchParams) {
      const searchParam = routeInfo.searchParams[key];
      url.searchParams.set(key, searchParam);
    }

    return url;
  }

  private buildHeaders({ contentType }: IHeaders): Headers {
    const headers = new Headers();

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    return headers;
  }
}
