import { HttpClient } from "./http";
import { generateContext, IHttpContext } from "./http.context";

const context: IHttpContext = {
    SHOW_LOADING: true,
    ACCESS_TOKEN: true
}

interface Photos {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export class PhotoService {
    constructor() {

    }

    getPosts() {
        return HttpClient.get<Photos[]>('https://jsonplaceholder.typicode.com/photos', { context: generateContext(context) }).then((res: Photos[]) => {
            return res.map((r: Photos) => r.id)
        })
    }


}
