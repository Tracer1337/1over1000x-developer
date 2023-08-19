export async function waitForSelector<T extends HTMLElement>(
  selector: string,
  timeout = 5,
) {
  let result: T | null = null;
  const startTime = Date.now();
  while (!result) {
    result = document.querySelector(selector);
    if (Date.now() - startTime > timeout * 1000) {
      throw new Error(`Element with selector '${selector}' could not be found`);
    }
    await new Promise(requestAnimationFrame);
  }
  return result;
}

export function shouldHandleElement(element: Element) {
  if (element.getAttribute('is-handled')) {
    return false;
  }
  element.setAttribute('is-handled', '1');
  return true;
}

export function getOrCreateContainer(
  id: string,
  parentSelector = 'body',
  method: 'appendChild' | 'prepend' = 'appendChild',
) {
  const parent = document.querySelector(parentSelector);
  if (!parent) {
    throw new Error(
      `Element with selector '${parentSelector}' could not be found`,
    );
  }
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', id);
    parent[method](container);
  }
  return container;
}
