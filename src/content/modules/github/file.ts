import { ReactNode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Subject, tap, switchMap, takeUntil, Observable, map } from 'rxjs';
import query from 'shared/query';
import { DrawioAPI } from 'shared/drawio';
import GitHubLoadingIndicator from './components/GitHubLoadingIndicator';
import ImageViewer from './components/ImageViewer';

const fileRenderers: Record<
  string,
  (fileContent: string, destroy: Subject<void>) => Observable<ReactNode>
> = {
  drawio: renderDrawioFile,
};

export function setupFileViewer() {
  const fileExtension = getFileExtension();

  if (!fileExtension || !(fileExtension in fileRenderers)) {
    return;
  }

  const fileContent = query('github.file.content');
  const fileContainer = query('github.file.container');

  if (!fileContent || !fileContainer) {
    return;
  }

  fileContainer.querySelector('div')!.style.display = 'none';

  const destroy = new Subject<void>();

  const customContainer = document.createElement('div');
  fileContainer.appendChild(customContainer);
  const root = createRoot(customContainer);

  root.render(createElement(GitHubLoadingIndicator));

  fileRenderers[fileExtension](fileContent, destroy)
    .pipe(takeUntil(destroy))
    .subscribe((node) => root.render(node));

  destroy.subscribe(() => {
    root.unmount();
    customContainer.remove();
  });

  return () => {
    destroy.next();
    destroy.complete();
  };
}

function getFileExtension() {
  return location.pathname.match(/^\/.*blob\/.*\.(\w+)\/?$/)?.[1] ?? null;
}

function renderDrawioFile(fileContent: string, destroy: Subject<void>) {
  const drawioAPI = new DrawioAPI();
  destroy.subscribe(() => drawioAPI.destroy());
  return drawioAPI.load(fileContent).pipe(
    switchMap(() => drawioAPI.export('svg')),
    tap(() => drawioAPI.destroy()),
    map((svg) => createElement(ImageViewer, { src: svg })),
  );
}
