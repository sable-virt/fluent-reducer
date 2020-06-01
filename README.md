# fluent-reducer

TypeSafe & Immutable useReducer(No Redux Dependency)

## how to use

```
npm i -S fluent-reducer immer react
```

### 1. Define State Object
```./example/src/reducers/RootReducers.ts
export interface IRootState {
  name: string
}
const RootState: IRootState = {
  name: 'unknown'
}
```

### 2. Create FluentReducer
```./example/src/reducers/RootReducers.ts
export const rootReducer = new FluentReducer<IRootState>(RootState, {
  prefix: 'ROOT_', // [optional] action name prefix
  verbose: true,
  middlewares: [(state) => {
    console.log(state)
  }]
})
```

### 3. Sync Action
```./example/src/reducers/RootReducers.ts
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
  started(state, params) {
    console.log('started', params)
    state.state = 'started'
  },
  failed(state, { error }) {
    console.error(error)
  },
  done(state, { result }) {
    state.name = result
    console.log('done')
  }
})
```

### 5. hooks

```./example/src/MyExample.tsx
export const MyExample: React.FC = () => {
  const [state, dispatch] = useRootContext()
  const _handleOnClick = useCallback(() => {
    dispatch(changeName(Date.now().toString()))
  }, [dispatch])
  return (
    <div onClick={_handleOnClick}>{state.name}</div>
  )
}
```

## Helpers

### Create Context

```
const reducer = new FluentReducer<YOUR_STATE_TYPE>()
const [ReducerContext, useReducerContext] = createReducerContext<YOUR_STATE_TYPE>(reducer)
```

wrap your components in ReducerContext
```
<ReducerContext>
  ...
</ReducerContext>
```

call useReducerContext in your component
```
const [state, dispatch] = useReducerContext()
```
