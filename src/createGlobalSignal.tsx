import { createRoot, createSignal } from 'solid-js';

interface Options {
  name?: string;
  internal?: boolean;
}

type AreEqual<TState> = boolean | ((prev: TState, next: TState) => boolean);

/**
 * This function is meant to create a global signal registered in its
 * own reactive context, essentially allowing the creation outside of
 * your solid application.
 *
 * @param value - Object state to make reactive
 * @param areEqual - Comparator method
 * @param options - See [official doc](https://github.com/ryansolid/solid/blob/master/documentation/api.md#createsignalinitialvalue-boolean--comparatorfn-getvaluefn-setvaluefn)
 */
export function createGlobalSignal<TState>(
  value: TState,
  areEqual?: AreEqual<TState>,
  options?: Options,
) {
  let globalSignal: [() => TState, (value: TState) => TState];

  createRoot(() => {
    globalSignal = createSignal(value, areEqual, options);
  });

  return globalSignal;
}
