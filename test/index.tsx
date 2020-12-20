import { createStore } from '..';

const [Store, useStore] = createStore(
  {
    count: 0,
  },
  (set) => ({
    increment() {
      set('count', (c) => c + 1);
    },
  }),
);
