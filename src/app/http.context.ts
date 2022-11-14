import { HttpContext, HttpContextToken } from "./http";
export interface IHttpContext {
  ACCESS_TOKEN?: boolean,
  SHOW_LOADING?: boolean,
  SHOW_ERROR?: boolean,
  IS_CACHE_ENABLED?: boolean
  RESET_CACHE?: boolean
}
const ACCESS_TOKEN = new HttpContextToken<boolean>(() => false);
const SHOW_LOADING = new HttpContextToken<boolean>(() => false);
const IS_CACHE_ENABLED = new HttpContextToken<boolean>(() => false);
const RESET_CACHE = new HttpContextToken<boolean>(() => false);

export const CONTEXT_TOKEN = {
  ACCESS_TOKEN,
  SHOW_LOADING,
  IS_CACHE_ENABLED,
  RESET_CACHE
}

const context = new HttpContext();

export const generateContext = (contextList: IHttpContext): HttpContext => {
  for (let cntxt in contextList) {
    switch (cntxt) {
      case 'ACCESS_TOKEN': context.set(CONTEXT_TOKEN.ACCESS_TOKEN, contextList[cntxt]);
        break;
      case 'SHOW_LOADING': context.set(CONTEXT_TOKEN.SHOW_LOADING, contextList[cntxt]);
        break;
      case 'IS_CACHE_ENABLED': context.set(CONTEXT_TOKEN.IS_CACHE_ENABLED, contextList[cntxt]);
        break;
      case 'RESET_CACHE': context.set(CONTEXT_TOKEN.RESET_CACHE, contextList[cntxt]);
        break;
    }
  }
  return context;
}