import type { Component, JSX } from 'solid-js';
import { createComponent as component, render } from 'solid-js/web';

interface App {
  /**
   * Add a Provider to the app. The list of provider will be merged
   * at mount time.
   *
   * @param provider {Component} - The provider to add to the list
   * @param opts {Record<string, any>} - The optional options
   */
  use<Props>(provider: Component<Props>, options?: Props): App;

  /**
   * It first merges all the Providers and then uses the `render` function
   * to mount the application.
   *
   * @param dom {HTMLElement | string} - The element to mount your app on
   */
  mount(domElement: HTMLElement | string): ReturnType<typeof render>;
}

interface Provider {
  provider: Component;
  opts?: Record<string, any>;
}

interface MergeParams {
  app: (props?: Record<string, any>) => JSX.Element;
  props: Record<string, any>;
  providers: Provider[];
}

/**
 * This utils function automatically merge the provider in the order they
 * were provided. It turns the following calls:
 *
 * const app = createApp(App)
 *
 * app.use(RouterProvider)
 * app.use(I18nProvider, { dict })
 * app.use(GlobalStoreProvider)
 *
 * app.mount('#app')
 *
 * into something like that:
 *
 * render(
 *   <RouterProvider>
 *     <I18nProvider dict={dict}>
 *       <GlobalStoreProvider>
 *         <App />
 *       </GlobalStoreProvider>
 *     </I18nProvider>
 *   </RouterProvider>,
 *   document.querySelector('#app')
 *  )
 */
function mergeProviders({ app, props = {}, providers }: MergeParams) {
  return providers.reduceRight(
    (application, { provider, opts = {} }) => () =>
      component(provider, {
        ...opts,

        get children() {
          return application();
        },
      }),
    () => component(app, props),
  );
}

export function createApp<AppProps>(app: (props?: AppProps) => JSX.Element, props?: AppProps) {
  const providers: Provider[] = [];

  const _app: App = {
    use(provider, opts = {} as any) {
      providers.push({ provider, opts });
      return _app;
    },

    mount(dom) {
      const application = mergeProviders({ app, props, providers });
      const root = typeof dom === 'string' ? document.querySelector(dom) : dom;
      return render(application, root);
    },
  };

  return _app;
}
