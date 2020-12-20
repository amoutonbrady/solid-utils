import {
  createState,
  State,
  SetStateFunction,
  createContext,
  useContext,
  Component,
} from 'solid-js';

interface CreateStoreFn<A, B, C = B & { set: SetStateFunction<A> }> {
  (store: A, fn: (set: SetStateFunction<A>, get: State<A>) => B): readonly [State<A>, C];
}

function generateStore<A, B>(store: A, fn: (set: SetStateFunction<A>, get: State<A>) => B) {
  const [get, set] = createState(store);

  return [get, { ...fn(set, get), set }] as const;
}

/**
 *
 *
 * @param store - An object describing your store
 * @param fn - A function returning an object that interact with the store
 * @returns [Provider, useProvider] - A tuple Provider/useProvider
 *
 * @example
 * ```tsx
 * const [Provider, useProvider] = createStore(
 *  { count: 0 },
 *
 *  (set) => ({
 *    increment = (by = 1) => set('count', c => c + by)
 *  })
 * )
 *
 * const App = () => {
 *  const [store, { increment }] = useStore()
 *
 *  return <button onClick={[increment, 1]}>{store.count}</button>
 * }
 *
 * const app = createApp(App)
 * app.use(Provider)
 * app.mount('#app')
 * ```
 */
export function createStore<T extends Record<string, any>, B>(
  store: T,
  fn: (set: SetStateFunction<T>, get: State<T>) => B,
) {
  type Store = ReturnType<CreateStoreFn<T, B>>;
  const Context = createContext<Store>();

  const Provider: Component = (props) => {
    const value: Store = generateStore(store, fn);

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  return [Provider, () => useContext(Context)] as const;
}
