import { Router, Route, RouteDefinition, Link } from 'solid-app-router';
import { Component } from 'solid-js';
import { MetaProvider, Title } from 'solid-meta';
import { createApp, createStore, createGlobalState, createGlobalSignal } from '../src';

const [globalState, setGlobalState] = createGlobalState({ name: 'hello' });
const [globalSignal, setGlobalSignal] = createGlobalSignal(20);

const [Provider, useProvider] = createStore({
  state: (props) => ({ count: props.count }),
  actions: (set) => ({ inc: () => set('count', (c) => c + 1) }),
  effects: (set, get) => [() => console.log(get.count)],
  props: { count: 0 },
});

const Name = () => <h1>Watch me also change name here: {globalState.name}</h1>;

const Home = () => {
  const [state, { inc }] = useProvider();

  return (
    <>
      <Title>Home</Title>

      <h1>
        My name is: {globalState.name} and I'm: {globalSignal()}
      </h1>

      <Name />

      <button
        onClick={() => {
          setGlobalState('name', 'world');
          setGlobalSignal(22);
        }}
      >
        Change name to 'world' and my age to '22'
      </button>

      <hr />

      <button onClick={inc}>
        Count from provider:{state.count} (open the console to see the effect)
      </button>
    </>
  );
};

const About = () => (
  <>
    <Title>About</Title>
    <h1>About</h1>
  </>
);

const App: Component<{ name: string }> = (props) => {
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <hr />
      <h1>Global name {props.name}</h1>
      <Route />
    </>
  );
};

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
];

createApp(App, { name: 'Alexandre' })
  .use(Router, { routes })
  .use(MetaProvider)
  .use(Provider)
  .mount('#app');
