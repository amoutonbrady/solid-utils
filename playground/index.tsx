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

const App = () => {
  const [state, { inc }] = useProvider();

  return (
    <>
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

createApp(App).use(Provider).mount('#app');
