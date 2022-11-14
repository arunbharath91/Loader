import { Loader, LoadingState } from "./loader";
import { PhotoService } from "./photo.service";
import './interceptor.service';
export const loader = new Loader('#loader', {
    color: '#000', onLoadStateChange: (arg: LoadingState) => {
        console.log(arg.loading)
    },
    container: '.progress-container'
});

(window as any).loadStart = () => {
    loader.start();
    const myTimeout = setTimeout(() => {
        loader.end();
        clearTimeout(myTimeout)
    }, 3000);
}

(window as any).loadEnd = () => {
    loader.end();
}

const photoService = new PhotoService();
photoService.getPosts().then(res => console.log(res));