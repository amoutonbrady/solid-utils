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

type CommonObject = Record<string, any>;

function generateStore<A, B, C>(
  store: A,
  fn: (set: SetStateFunction<A>, get: State<A>) => B,
  props?: C,
) {
  const finalStore: A = typeof store === 'function' ? store(props) : store;
  const [get, set] = createState(finalStore);

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
export function createStore<P extends CommonObject, T extends CommonObject, B>(
  store: T,
  fn: (set: SetStateFunction<T>, get: State<T>) => B,
) {
  type Store = ReturnType<CreateStoreFn<T, B>>;
  const Context = createContext<Store>();

  const Provider: Component<P> = (props) => {
    const value: Store = generateStore(store, fn, props);

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  return [Provider, () => useContext(Context)] as const;
}
