import { HttpAgent } from 'http';
import { HttpsAgent } from 'https';

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';

export type ResponseType = 'json' | 'text' | 'buffer';

interface RequestHeaders {
  [key: string]: string;
}

interface RequestOptions {
  url: string;
  method?: Method;
  headers?: RequestHeaders;
  timeout?: number;
  responseType?: ResponseType;
  data?: any;
  agent?: HttpAgent | HttpsAgent;
}

interface ResponseHeaders {
  [key: string]: string;
}

interface Response {
  body: Buffer;
  headers: ResponseHeaders;
  statusCode: number;
  statusMessage: string;
  data: any;
}

export async function request(options: RequestOptions): Promise<Response>;
