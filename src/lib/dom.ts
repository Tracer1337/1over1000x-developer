export async function waitForSelector(selector: string, timeout = 5) {
  let result: HTMLElement | null = null;
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
