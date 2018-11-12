import {
  Omit,
} from 'typelevel-ts';
import {
  APIType,
  BaseRequestType,
  BaseResponseType,
} from './types';

export type CleanedResponseType<
  T extends BaseResponseType = BaseResponseType,
> = Omit<T, '___BaseResponseType'>;

export abstract class BaseAPIServer {
  handlers: {
    [apiName: string]: (req: any) => Promise<CleanedResponseType>;
  } = {};
  addAPI<
    RequestType extends BaseRequestType,
    ResponseType extends BaseResponseType,
    name extends string
  >(
    api: APIType<RequestType, ResponseType, name>,
    handler: (req: RequestType) => Promise<CleanedResponseType<ResponseType>>,
  ) {
    this.handlers[api.name] = handler;
  }
  checkAPIAllImplemented(apis: {
    [name: string]: APIType<any, any, string>;
  }) {
    Object.keys(apis).forEach(key => {
      const api = apis[key];
      if (
        api.__SINGLE_REQ_SINGLE_RESP &&
        !this.handlers[api.name]
      ) throw new Error(`HANDLER NOT IMPLEMENTED FOR: ${api.name}`);
    });
  }
  abstract cleanUp(): void;
}