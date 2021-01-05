import { Component } from 'solid-js';
import { createApp, createStore } from '.';

const App = () => <h1>Hello</h1>;
const [Prov3, useProv3] = createStore({
  state: async () => ({ name: 'test' }),

  actions: (set) => ({
    test() {
      set('name', 'test');
    },
  }),

  props: { name: 'test' },
});

const [a, b] = useProv3();

const app = createApp(App).use(Prov3, { loader: App }).mount('');
