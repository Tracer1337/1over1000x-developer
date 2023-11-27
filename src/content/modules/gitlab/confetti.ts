import confetti from 'canvas-confetti';
import { createRenderLoop } from 'shared/bridge';
import { shouldHandleElement } from 'shared/dom';

export function setupConfetti() {
  return createRenderLoop(render);
}

function render() {
  Array.from(
    document.querySelectorAll<HTMLInputElement>('.task-list-item-checkbox'),
  )
    .filter((element) => shouldHandleElement(element))
    .forEach((element) => applyConfettiHandler(element));
}

function applyConfettiHandler(element: HTMLInputElement) {
  element.addEventListener('change', () => {
    if (element.checked) {
      confettiAtElement(element, {
        startVelocity: 20,
      });
    }
  });
}

function confettiAtElement(element: Element, config: confetti.Options = {}) {
  const rect = element.getBoundingClientRect();
  const x = rect.x / window.innerWidth;
  const y = rect.y / window.innerHeight;
  confetti({ ...config, origin: { x, y } });
}
