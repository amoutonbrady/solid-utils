import {
  createState,
  State,
  SetStateFunction,
  createContext,
  useContext,
  Component,
  splitProps,
  createResource,
  Show,
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

async function generateStore<Store, Methods, Props>(
  store: Store | ((props: Props) => Store),
  fn: (set: SetStateFunction<Store>, get: State<Store>) => Methods = () => ({} as Methods),
  props?: Props,
) {
  const finalStore: Store = isFunction<(props: Props) => Store>(store) ? await store(props) : store;
  const [get, set] = createState(finalStore);

  return [get, { ...fn(set, get), set }] as const;
}

/**
 *
 *
 * @param store - An object describing your store
 * @param methods - A function returning an object that interact with the store
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
export function createStore<
  Props extends CommonObject,
  Store extends CommonObject,
  Methods extends CommonObject
>(
  store: Store | ((props: Props) => Store),
  methods?: (set: SetStateFunction<Store>, get: State<Store>) => Methods,
  defaultProps?: Props,
) {
  type FinalStore = ReturnType<GenerateStoreFn<Store, Methods, Props>>;
  const Context = createContext<FinalStore>();

  const Provider: Component<Partial<Props & { loader: Component }>> = (props) => {
    const finalProps = { ...(defaultProps || {}), ...(props || {}) };
    const [internal, external] = splitProps(finalProps, ['children']);
    const [value, loadValue] = createResource<FinalStore>();
    loadValue(() => generateStore(store, methods, external));

    const defaultLoader = () => <p>Loading...</p>;

    return (
      <Show when={!value.loading} fallback={props.loader || defaultLoader}>
        <Context.Provider {...external} value={value()}>
          {internal.children}
        </Context.Provider>
      </Show>
    );
  };

  return [Provider, () => useContext(Context)] as const;
}
