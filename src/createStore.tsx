import {
  createState,
  State,
  SetStateFunction,
  createContext,
  useContext,
  Component,
} from 'solid-js';

interface GenerateStoreFn<Store, Methods, Props, C = Methods & { set: SetStateFunction<Store> }> {
  (
    store: Store | ((props: Props) => Store),
    fn: (set: SetStateFunction<Store>, get: State<Store>) => Methods,
  ): readonly [State<Store>, C];
}

type CommonObject = Record<string, any>;

function isFunction<T = Function>(fn: unknown): fn is T {
  return typeof fn === 'function';
}

function generateStore<Store extends CommonObject, Methods, Props>(
  store: Store | ((props: Props) => Store),
  fn: (set: SetStateFunction<Store>, get: State<Store>) => Methods,
  props?: Props,
) {
  const finalStore: Store = isFunction<(props: Props) => Store>(store) ? store(props) : store;
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
export function createStore<Props extends CommonObject, Store extends CommonObject, Methods>(
  store: Store | ((props: Props) => Store),
  fn: (set: SetStateFunction<Store>, get: State<Store>) => Methods,
) {
  type FinalStore = ReturnType<GenerateStoreFn<Store, Methods, Props>>;
  const Context = createContext<FinalStore>();

  const Provider: Component<Props> = (props) => {
    const value: FinalStore = generateStore(store, fn, props);

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  return [Provider, () => useContext(Context)] as const;
}
