import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BehaviorSubject,
  Subject,
  filter,
  of,
  tap,
  switchMap,
  fromEvent,
  map,
  take,
  takeUntil,
} from 'rxjs';
import query from 'shared/query';
import GitHubLoadingIndicator from './components/GitHubLoadingIndicator';
import ImageViewer from './components/ImageViewer';

export function setupDrawioViewer() {
  const content = query('github.file.content');
  const fileContainer = query('github.file.container');

  if (!content || !fileContainer) {
    return;
  }

  fileContainer.querySelector('div')!.style.display = 'none';

  const destroy = new Subject<void>();

  const customContainer = document.createElement('div');
  fileContainer.appendChild(customContainer);
  const root = createRoot(customContainer);

  root.render(createElement(GitHubLoadingIndicator));

  exportDrawioSVG(content)
    .pipe(takeUntil(destroy))
    .subscribe((svg) => root.render(createElement(ImageViewer, { src: svg })));

  destroy.asObservable().subscribe(() => {
    root.unmount();
    customContainer.remove();
  });

  return () => {
    destroy.next();
    destroy.complete();
  };
}

function exportDrawioSVG(content: string) {
  const drawioAPI = new DrawioAPI();
  return drawioAPI.load(content).pipe(
    switchMap(() => drawioAPI.export('svg')),
    tap(() => drawioAPI.destroy()),
  );
}

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

class DrawioAPI {
  private static iframe: HTMLIFrameElement;

  private isInitialized = new BehaviorSubject(false);

  constructor() {
    if (!DrawioAPI.iframe) {
      DrawioAPI.iframe = document.createElement('iframe');
      DrawioAPI.iframe.src = 'https://embed.diagrams.net/?embed=1&proto=json';
      DrawioAPI.iframe.style.display = 'none';
    }
    document.body.appendChild(DrawioAPI.iframe);
    this.addListener('init')
      .pipe(take(1))
      .subscribe(() => this.isInitialized.next(true));
  }

  private sendMessage(action: DrawioAction) {
    if (!DrawioAPI.iframe.contentWindow) {
      throw new Error('Cannot access content window');
    }
    DrawioAPI.iframe.contentWindow.postMessage(JSON.stringify(action), '*');
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
    DrawioAPI.iframe.remove();
  }
}
