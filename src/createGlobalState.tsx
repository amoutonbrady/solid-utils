import { createRoot, createState, SetStateFunction, State } from 'solid-js';

interface Options {
  name?: string;
}

/**
 * This function is meant to create a global state registered in its
 * own reactive context, essentially allowing the creation outside of
 * your solid application.
 *
 * @param state - Object state to make reactive
 * @param options - See [official doc](https://github.com/ryansolid/solid/blob/master/documentation/api.md#createstateinitvalue-state-setstate)
 */
export function createGlobalState<TState>(state: TState, options?: Options) {
  let globalState: [State<TState>, SetStateFunction<TState>];

  createRoot(() => {
    globalState = createState(state, options);
  });

  return globalState;
}
