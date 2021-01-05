import { createApp, createStore } from '..';

const [Provider, useProvider] = createStore({
  state: () => ({ count: 0 }),
  actions: (set) => ({ inc: () => set('count', (c) => c + 1) }),
  effects: () => [],
});

const App = () => {
  const [state] = useProvider();

  return <h1>{state.count}</h1>;
};

createApp(App).use(Provider).mount('#app');
