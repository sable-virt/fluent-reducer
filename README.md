# fluent-reducer

Easy & TypeSafe & Immutable reducer(No Redux Dependency)

Storybook https://sable-virt.github.io/fluent-reducer/

## How to use

```
npm i -S fluent-reducer immer react
```

### 1. Define State Object
```
export interface IRootState {
  name: string
}
const RootState: IRootState = {
  name: 'unknown'
}
```

### 2. Create FluentReducer
```
// 'root' is unique ID
export const rootReducer = new ReactFluentReducer<'root', IRootState>(RootState, {
  prefix: 'ROOT_', // [optional] action name prefix
  verbose: true,
  middlewares: [(state, action) => {
    // this state can edit. not plane object, so if you save state like localstorage, use subscribe
    console.log(state, action)
  }]
})
```

### 3. Sync Action
```
export const changeName = rootReducer.sync<string>('CHANGE_NAME', (state, name) => {
  state.name = name
})
```

### 4. Async Action
```
const asyncChangeState = reducer.async<string, string, Error>('ASYNC_CHANGE_NAME', (name, dispatch, getState) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(name)
    }, 3000)
  })
}, {
  // before promise action
  started(state, params) {
    console.log('started', params)
    state.state = 'started'
  },
  // promise rejected action
  failed(state, { error }) {
    console.error(error)
  },
  // promise resolved action
  done(state, { result }) {
    state.name = result
    console.log('done')
  }
})
```

### 5. hooks

```
export const MyExample: React.FC = () => {
  const [state, dispatch] = rootReducer.useFluentReducer()
  const _handleOnClick = useCallback(() => {
    // execute changeName action
    dispatch(changeName(Date.now().toString()))
  }, [dispatch])
  return (
    <div onClick={_handleOnClick}>{state.name}</div>
  )
}
```

### 6. subscribe/unsubscribe

```
rootReducer.subscribe((state, action) => {
  // this state is readonly. if you want to update state, use middlewares option.
  console.log(state, action)
})
```
