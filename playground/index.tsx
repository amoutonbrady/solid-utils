import { createApp, createStore, createGlobalState, createGlobalSignal } from 'solid-utils';

import { Router, Route } from 'solid-app-router';
import { Meta, MetaProvider, Title } from 'solid-meta';

const [globalState, setGlobalState] = createGlobalState({ name: 'Alexandre' });
const [globalSignal, setGlobalSignal] = createGlobalSignal(20);

const [Provider, useProvider] = createStore({
  state: (props) => ({ count: props.count }),
  actions: (set) => ({
    inc: () => set('count', (c) => c + 1),
  }),
  effects: (_set, get) => [() => console.log(get.count)],
  props: { count: 0 },
});

const Name = () => <h1>Watch me also change name here: {globalState.name}</h1>;

const Hoooome = () => {
  const [state, actions] = useProvider();

  return (
    <>
      <Title>Hello world!</Title>

      <h1>
        My name is: {globalState.name} and I'm: {globalSignal()}
      </h1>

      <Name />

      <button
        onClick={() => {
          setGlobalState('name', (name) => (name === 'Alexandre' ? 'Alex' : 'Alexandre'));
          setGlobalSignal(globalSignal() === 20 ? 22 : 20);
        }}
      >
        Toggle name between 'Alex' and 'Alexandre' and my age between '22' and '20'
      </button>

      <hr />

      <button onClick={actions.inc}>
        Count from provider:{state.count} (open the console to see the effect)
      </button>
    </>
  );
};

const App = () => (
  <>
    <Meta name="keywords" content="javascript solid ui framework" />
    <Route />
  </>
);

const routes = [
  {
    component: Hoooome,
    path: '/',
  },
];

createApp(App, {}).use(MetaProvider).use(Router, { routes }).use(Provider).mount('#app');
