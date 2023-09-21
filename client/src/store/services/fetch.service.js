import { API_URL } from '../../constants/api';

export class FetchService {
  request;
  abortController;
  minDelay = 1e3;
  minWaitTimeout;

  constructor({ body, method, routeInfo, abortController }) {
    this.abortController = abortController ?? new AbortController();

    this.request = this.buildRequest({ body, method, routeInfo, signal: this.abortController.signal });
  }

  async sendRequest(requiredMinDelay = false) {
    const fetchStartTime = Date.now();
    const response = await fetch(this.request);

    const result = await this.checkResponse(response);

    if (requiredMinDelay) {
      await this.waitMinDelay(fetchStartTime);
    }

    return result;
  }

  clearFetch() {
    this.abortController.abort();
    clearTimeout(this.minWaitTimeout);
  }

  buildRequest({ body, method, routeInfo, signal }) {
    const url = this.buildURL(routeInfo);

    let requestBody;
    if (body) {
      requestBody = JSON.stringify(body);
    }

    const contentType = requestBody && 'application/json';
    const headers = this.buildHeaders({ contentType });

    return new Request(url, {
      body: requestBody,
      method,
      signal,
      headers,
    });
  }

  buildURL(routeInfo) {
    if (!API_URL) throw new Error('Does not have API_URL!');

    const url = new URL(API_URL);
    url.pathname = routeInfo.route;

    for (const key in routeInfo.params) {
      const param = routeInfo.params[key];

      if (url.pathname.at(-1) !== '/') url.pathname += '/';
      url.pathname += param + '/';
    }

    for (const key in routeInfo.searchParams) {
      const searchParam = routeInfo.searchParams[key];
      url.searchParams.set(key, searchParam);
    }

    return url;
  }

  buildHeaders({ contentType }) {
    const headers = new Headers();

    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    return headers;
  }

  async checkResponse(res) {
    if (res.status === 500) {
      const errorData = await res.json();
      throw new Error(`Server Error: ${errorData.error}`);
    } else if (res.status === 204) {
      return 'No Content';
    } else if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Request Error: ${errorData.error}`);
    }

    const result = await res.json();
    return result;
  }

  async waitMinDelay(fetchStartTime = Date.now()) {
    const timeLeft = this.minDelay - (Date.now() - fetchStartTime);
    await new Promise((res) => (this.minWaitTimeout = setTimeout(() => res(), timeLeft)));
  }
}
