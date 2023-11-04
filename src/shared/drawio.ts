import {
  BehaviorSubject,
  filter,
  of,
  tap,
  switchMap,
  fromEvent,
  map,
  take,
} from 'rxjs';

type DrawioAction =
  | {
      action: 'load';
      xml: string;
    }
  | {
      action: 'export';
      format: 'svg';
    };

type DrawioEvent =
  | {
      event: 'init';
    }
  | {
      event: 'load';
    }
  | {
      event: 'export';
      data: string;
    };

export class DrawioAPI {
  private iframe: HTMLIFrameElement;
  private isInitialized = new BehaviorSubject(false);
  private isDestroyed = new BehaviorSubject(false);

  constructor() {
    this.iframe = document.createElement('iframe');
    this.iframe.src = 'https://embed.diagrams.net/?embed=1&proto=json';
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);
    this.addListener('init')
      .pipe(take(1))
      .subscribe(() => this.isInitialized.next(true));
  }

  private sendMessage(action: DrawioAction) {
    if (!this.iframe.contentWindow) {
      throw new Error('Cannot access content window');
    }
    if (this.isDestroyed.value) {
      return;
    }
    this.iframe.contentWindow.postMessage(JSON.stringify(action), '*');
  }

  private addListener<K extends DrawioEvent['event']>(event: K) {
    return fromEvent<MessageEvent<any>>(window, 'message').pipe(
      filter((message) => message.origin === 'https://embed.diagrams.net'),
      filter((message) => typeof message.data === 'string'),
      map(
        (message) =>
          JSON.parse(message.data) as Extract<DrawioEvent, { event: K }>,
      ),
      filter((data) => data.event === event),
      filter(() => !this.isDestroyed.value),
    );
  }

  private assertIsInitialized() {
    if (!this.isInitialized.value) {
      throw new Error('Draw.io is not initialized');
    }
  }

  public init() {
    return this.isInitialized.value
      ? of(true)
      : this.isInitialized.asObservable().pipe(filter((value) => value));
  }

  public load(content: string) {
    return this.init().pipe(
      tap(() =>
        this.sendMessage({
          action: 'load',
          xml: content,
        }),
      ),
      switchMap(() => this.addListener('load').pipe(take(1))),
    );
  }

  public export(format: Extract<DrawioAction, { action: 'export' }>['format']) {
    this.assertIsInitialized();
    this.sendMessage({ action: 'export', format });
    return this.addListener('export').pipe(
      take(1),
      map((event) => event.data),
    );
  }

  public destroy() {
    this.iframe.remove();
    this.isDestroyed.next(true);
  }
}
