import confetti from 'canvas-confetti';
import { shouldHandleElement } from 'lib/dom';

let isActive = true;

export function setupConfetti() {
  const render = () => {
    if (!isActive) {
      return;
    }

    Array.from(
      document.querySelectorAll<HTMLInputElement>('.task-list-item-checkbox'),
    )
      .filter((element) => shouldHandleElement(element))
      .forEach((element) => applyConfettiHandler(element));

    setTimeout(render, 200);
  };

  render();
}

export async function destroyConfetti() {
  isActive = false;
}

function applyConfettiHandler(element: HTMLInputElement) {
  element.addEventListener(
    'change',
    () =>
      element.checked &&
      confettiAtElement(element, {
        startVelocity: 20,
      }),
  );
}

function confettiAtElement(element: Element, config: confetti.Options = {}) {
  const rect = element.getBoundingClientRect();
  const x = rect.x / window.innerWidth;
  const y = rect.y / window.innerHeight;
  confetti({ ...config, origin: { x, y } });
}
