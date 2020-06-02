import 'jest'
import { FluentDispatcher } from '../src/FluentDispatcher'
test('defined', () => {
  const dispatcher = new FluentDispatcher()
  expect(dispatcher).toBeDefined()
})