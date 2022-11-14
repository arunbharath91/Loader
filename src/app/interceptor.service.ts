import { HttpClient, HttpOptions, HttpRequest } from "./http";
import { CONTEXT_TOKEN } from "./http.context";
import { loader } from "./loader-config";

export const authInterceptor = async (req: HttpRequest, options: HttpOptions): Promise<HttpRequest> => {
    if (req.context?.get(CONTEXT_TOKEN.ACCESS_TOKEN)) {
        req?.headers.append('ACCESS_TOKEN', 'taken')
    }
    if (req.context?.get(CONTEXT_TOKEN.SHOW_LOADING)) {
        loader.start();
        HttpClient.getResponseByType<any>(options.responseType, (await options.res)?.clone()).then((res: any) => {
            console.log(res)
            loader.end();
        })
    }
    return req
}

HttpClient.intercept(authInterceptor);

