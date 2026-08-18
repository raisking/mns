import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Testing Library's own auto-cleanup only registers itself when it detects
// a global afterEach — this project deliberately doesn't enable Vitest's
// `globals` option (keeps describe/it/expect explicit imports, so tsc -b
// never needs ambient test-framework types). Register cleanup ourselves.
afterEach(() => {
  cleanup();
});
