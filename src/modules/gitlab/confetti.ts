import confetti from 'canvas-confetti';

export function setupConfetti() {
  document
    .querySelectorAll<HTMLInputElement>('.task-list-item-checkbox')
    .forEach((target) =>
      target.addEventListener(
        'change',
        () =>
          target.checked &&
          confettiAtElement(target, {
            startVelocity: 20,
          }),
      ),
    );
}

function confettiAtElement(element: Element, config: confetti.Options = {}) {
  const rect = element.getBoundingClientRect();
  const x = rect.x / window.innerWidth;
  const y = rect.y / window.innerHeight;
  confetti({ ...config, origin: { x, y } });
}
