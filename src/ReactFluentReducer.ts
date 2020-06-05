import { useCallback, useEffect, useMemo, useState } from 'react'
import { TypeDispatch } from './AsyncActionCreator'
import { FluentReducer, IFluentReducerOption } from './FluentReducer'

export class ReactFluentReducer<ID extends string, InS> extends FluentReducer<ID, InS> {
  constructor(public initialState: InS, op: Partial<IFluentReducerOption<InS>> = {}) {
    super(initialState, op)
  }
  public useFluentReducer(): [InS, TypeDispatch<ID, InS>] {
    const [state, setState] = useState<InS>(this.getState())
    const update = useCallback((newState: Readonly<InS>, action) => {
      setState(newState)
    }, [])
    const dispatch = useMemo(() => {
      return this.dispatch.bind(this)
    }, [])
    useEffect(() => {
      this.subscribe(update)
      return () => {
        this.unsubscribe(update)
      }
    })
    return [
      state,
      dispatch
    ]
  }
}
