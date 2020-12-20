# solid-utils

The ultime companion of all your [solid-js](https://github.com/ryansolid/solid) applications.

These modules are:

* [x] Tiny in size
* [x] Tree shakeable
* [x] Typescript ready
* [x] Growing and maturing
* [x] Used in various projects (mostly pet project)
* [x] Integrate 100% of [Skypack package best practices](https://docs.skypack.dev/package-authors/package-checks)
* [x] ES Module, Common JS & source export (solid specific) ready

* [ ] Doesn't entirelyu support SSR just yet
* [ ] Untested (progamatically) - Mostly because I didn't find a proper solution yet

## Installation

```bash
# npm
$ npm i solid-utils

# pnpm
$ pnpm add solid-utils

# yarn
$ yarn add solid-utils
```

## Usage

### createApp

A Vue 3 inspired app mounting bootstrapper that helps managing large list of global providers

#### Basic usage

```tsx
import { createApp } from 'solid-utils'

const App = () => <h1>Hello world!</h1>

createApp(App).mount('#app')
```

#### With providers

```tsx
const app = createApp(App)

app.use(RouterProvider)
app.use(I18nProvider, { dict })
app.use(GlobalStoreProvider)

app.mount('#app')
```

into something like that:

```tsx
render(
  <RouterProvider>
    <I18nProvider dict={dict}>
      <GlobalStoreProvider>
        <App />
      </GlobalStoreProvider>
    </I18nProvider>
  </RouterProvider>,
  document.querySelector('#app')
 )
 ```

 #### With disposable app

 Can be useful in tests or HMR

 ```tsx
const dispose = createApp(App).mount('#app')

if (module.hot) {
    module.hot.accept()
    module.hot.dispose(dispose)
}
 ```

### createProvider

A small utility that helps generate Provider & associated hook

#### Basic usage

```tsx
const [Provider, useProvider] = createProvider(
    { count: 0, first: 'Alexandre' },
    (set, get) => ({ 
        increment(by = 1) {
            set('count', count => count + 1)
        },
        dynamicFullName(last) {
            return `${get.first} ${last} ${get.count}`;
        }
    })
)

const Counter = () => {
    const [state, { increment, dynamicFullName }] = useProvider()

    // The count here will be sync between the two <Counter /> because it's global
    return <>
        <button onClick={[increment, 1]}>{state.count}</button>
        <h1>{dynamicFullName('Mouton-Brady')}</h1>
    </>
}
render(() => <Provider><Counter /><Counter /></Provider>, document.getElementById('app'))
```