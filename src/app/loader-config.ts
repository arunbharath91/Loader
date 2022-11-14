import { Loader, LoadingState } from "./loader";
import { PhotoService } from "./photo.service";
import './interceptor.service';
export const loader = new Loader('#loader', {
    type: 'Bar',
    color: 'blue', onLoaderStateChange: (arg: LoadingState) => {
        console.log(arg.loading)
    },
    container: '.progress-container'
});

export const circleLoader = new Loader('#circleLoader', {
    type: 'Circle',
    color: 'blue', onLoaderStateChange: (arg: LoadingState) => {
        console.log(arg.loading)
    },
    container: '#circleOverlay'
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
(window as any).loadCEnd = () => {
    circleLoader.end();
}

(window as any).loadCStart = () => {
    circleLoader.start();
}

const photoService = new PhotoService();
photoService.getPosts().then(res => console.log(res));
