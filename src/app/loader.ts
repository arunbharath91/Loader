interface IOptions {
  size?: string;
  type?: 'Circle' | 'Bar';
  mode?: ProgressBarMode;
  container?: string | HTMLElement;
  color?: string;
  onLoadStateChange?: Function;
}

export type ProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';
const defaultOption: IOptions = {
  size: 'lg',
  mode: 'indeterminate'
}
export interface LoadingState {
  loading: boolean;
}
export class Loader {
  private selector: HTMLElement | null;
  private container!: HTMLElement | null;
  private options: IOptions;
  public loadingState: LoadingState = { loading: false };
  constructor(selector: string | HTMLElement, options?: IOptions) {
    this.selector = (typeof selector == 'string') ? document.querySelector<HTMLElement>(selector) : selector as HTMLElement;
    this.options = { ...defaultOption, ...options };
    if (this.options.container) {
      this.container = (typeof this.options.container == 'string') ? document.querySelector<HTMLElement>(this.options.container) : this.options.container as HTMLElement;
    }
    this.initialLoader();
    this.stateUpater();
  }

  stateUpater() {
    let _value: any = null;
    Object.defineProperty(this.loadingState, 'loading', {
      get: () => {
        return _value;
      },
      set: (value) => {
        // If same value is passed, do nothing.
        if (_value === value) return;
        _value = !!value;
        this.options.onLoadStateChange?.call(this, this.loadingState);
        this.container?.setAttribute('progress-loading', this.loadingState.loading.toString());
        this.selector?.setAttribute('progress-loading', this.loadingState.loading.toString());
      }
    });
  }

  start() {
    this.loadingState.loading = true;
  }

  end() {
    this.loadingState.loading = false;
  }

  private initialLoader() {
    this.loadingState.loading = false;
    this.container?.setAttribute('progress-loading', this.loadingState.loading.toString());
    if (this.selector) {
      this.selector.setAttribute('progress-mode', this.options?.mode || '');
      this.selector.setAttribute('progress-loading', this.loadingState.loading.toString());
      if (this.options.color && this.checkValidColor(this.options.color)) {
        this.selector.setAttribute('progress-color', this.options.color);
        this.selector.style.cssText = `--progress-color: ${this.options.color}`;
      } else {
        throw new Error('Invalid Color Supplied');
      }
    }
  }

  private checkValidColor(value: string) {
    return CSS.supports('background', value);
  }

}
