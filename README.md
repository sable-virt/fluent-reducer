# fluent-reducer

TypeSafe & Immutable useReducer

## how to use

```
npm i -S fluent-reducer immer react
```

### 1. Define State Object
```
interface ROOT_STATE {
  name: string
}
const DEFAULT_STATE: ROOT_STATE = {
  name: 'sable'
}
```

### 2. Create FluentReducer
```
const reducer = new FluentReducer<ROOT_STATE>()
```

### 3. Sync Action

```
const changeState = reducer.sync<string>('CHANGE_NAME', (state, payload) => {
  state.name = payload
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

```
export const MyExample: React.FC = () => {
  const [state, dispatch] = useFluentReducer<ROOT_STATE>(reducer, DEFAULT_STATE)
  useEffect(() => {
    dispatch(asyncChangeState('done'))
  }, [dispatch])
  return (
    <div>{state.name}</div>
  )
}
```