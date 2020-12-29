import {
  createState,
  createContext,
  useContext,
  Component,
  splitProps,
  createResource,
  Show,
  State,
  SetStateFunction,
} from 'solid-js';

type BaseObject = Record<string, any>;

type GenerateStore<Store = {}, Actions = {}, Props = {}> = (options: {
  state: (props: Props) => Promise<Store> | Store;
  actions?: (set: SetStateFunction<Store>, get: State<Store>) => Actions;
  props?: Props;
}) => Promise<
  readonly [
    State<Store>,
    Actions & {
      readonly set: SetStateFunction<Store>;
    },
  ]
>;

interface StateFn<Props, StateResult> {
  (props: Props): StateResult | Promise<StateResult>;
}

// https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise/49889856
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Default Loader when the store is computing the initial state
 */
const DefaultLoader: Component = () => <p>Loading...</p>;

const generateStore: GenerateStore = async ({ state, actions, props }) => {
  const finalStore = await state(props);
  const [get, set] = createState(finalStore);
  const finalActions = actions(set, get);

  return [get, { ...finalActions, set }] as const;
};

/**
 * @param options - A function An object describing your store
 * @returns [Provider, useProvider] - A tuple Provider/useProvider
 *
 * @example
 * ```tsx
 * const [Provider, useProvider] = createStore({
 *  state: () => ({ count: 0 }),
 *
 *  actions: (set) => ({
 *    increment = (by = 1) => set('count', c => c + by)
 *  })
 * })
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
  Store extends BaseObject,
  Actions extends BaseObject,
  Props extends BaseObject
>({
  state,
  actions,
  props,
}: {
  state: StateFn<Props, Store>;
  actions?: ReturnType<StateFn<Props, Store>> extends Promise<Store>
    ? (
        set: SetStateFunction<ThenArg<StateFn<Props, Store>>>,
        get: State<ThenArg<StateFn<Props, Store>>>,
      ) => Actions
    : (set: SetStateFunction<Store>, get: State<Store>) => Actions;
  props?: Props;
}) {
  type Return = readonly [
    State<Store>,
    Readonly<Actions> & {
      readonly set: SetStateFunction<Store>;
    },
  ];

  const Context = createContext<Return>();

  const Provider: Component<Partial<Props & { loader: any }>> = (providerProps) => {
    const finalProps = { ...(props || {}), ...(providerProps || {}) };
    const [internal, external] = splitProps(finalProps, ['children']);
    const [value, loadValue] = createResource<Return>();

    loadValue(
      () =>
        generateStore({
          state,
          actions,
          props: external as Props,
        }) as Promise<Return>,
    );

    return (
      <Show when={!value.loading} fallback={finalProps.loader || DefaultLoader}>
        <Context.Provider {...external} value={value()}>
          {internal.children}
        </Context.Provider>
      </Show>
    );
  };

  return [Provider, () => useContext(Context)] as const;
}
