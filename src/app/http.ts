
export class HttpContextToken<T> {
    constructor(public readonly defaultValue: () => T) { }
}

export class HttpContext {
    private readonly map = new Map<HttpContextToken<unknown>, unknown>();
    set<T>(token: HttpContextToken<T>, value: T): HttpContext {
        this.map.set(token, value);
        return this;
    }
    get<T>(token: HttpContextToken<T>): T {
        if (!this.map.has(token)) {
            this.map.set(token, token.defaultValue());
        }
        return this.map.get(token) as T;
    }
    delete(token: HttpContextToken<unknown>): HttpContext {
        this.map.delete(token);
        return this;
    }
    has(token: HttpContextToken<unknown>): boolean {
        return this.map.has(token);
    }
    keys(): IterableIterator<HttpContextToken<unknown>> {
        return this.map.keys();
    }
}

type ResponseType = 'text' | 'arraybuffer' | 'blob' | 'json';
type Observe = 'body' | 'events' | 'response';

export interface HttpOptions extends RequestInit {
    context?: HttpContext;
    responseType?: ResponseType;
    res?: Promise<HttpResponse>;
    observe?: Observe;
}

export interface HttpRequest extends Request {
    context?: HttpContext;
}

export interface HttpResponse extends Response {
}

export class Http {
    private cb: any[] = [];

    constructor() {

    }

    public intercept(cb: any) {
        this.cb.push(cb);
    }

    public getResponseByType<T = any>(responseType: ResponseType | undefined, response: any) {
        switch (responseType) {
            case 'json': return <Promise<T>>response.json()
            case 'text': return <Promise<T>>response.text()
            case 'blob': return <Promise<T>>response.blob()
            case 'arraybuffer': return <Promise<T>>response.arrayBuffer()
            default: return <Promise<T>>response.json()
        }
    }

    public async get<T>(url: string, options: HttpOptions = {}): Promise<T> {
        return this.request<T>(url, null, { ...options, method: "GET" })
    };
    public async post<T>(url: string, body = {}, options: HttpOptions = {}): Promise<T> {
        return this.request<T>(url, body, { ...options, method: "POST" })
    };
    public async put<T>(url: string, body = {}, options: HttpOptions = {}): Promise<T> {
        return this.request(url, body, { ...options, method: "PUT" })
    };
    public async delete<T>(url: string, options: HttpOptions = {}): Promise<T> {
        return this.request<T>(url, null, { ...options, method: "DELETE" })
    };
    private async request<T>(url: string, body: any | null = {}, options: HttpOptions = {}): Promise<T> {
        options.headers = {
            'Content-Type': "application/json",
            ...options.headers,
        };
        let request: HttpRequest = new Request(url, {
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        });
        request.context = options.context;

        const fetchReq = fetch(request);
        options.res = fetchReq;
        if (this.cb.length) {
            for (let fn of this.cb) {
                request = fn(request, options);
            }
        }
        const fetchResponse = await fetchReq;
        // Iterate all interceptors to modify the options

        return this.getResponseByType<T>(options.responseType, fetchResponse);
    }
}

let httpInstance: Http | null;
const getInstance = () => {
    if (httpInstance == null) {
        httpInstance = new Http();
        // Hide the constructor so the returned object can't be new'd...
    }
    return httpInstance;
}

export const HttpClient = getInstance();



