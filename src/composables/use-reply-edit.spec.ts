import { describe, it, expect } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useReplyEdit } from './use-reply-edit'
import { EDIT_ACTION, REPLY_ACTION } from '../components/actions'
import type { Message } from '../models'

const runScope = <T>(fn: () => T): { result: T; dispose: () => void } => {
  const scope = effectScope()
  let result!: T
  scope.run(() => {
    result = fn()
  })
  return { result, dispose: () => scope.stop() }
}

const stubMessage = (id: string): Message => ({
  id,
  sender: { id: 'sender-1' },
  content: '',
  createdAt: '2025-01-01T00:00:00Z',
})

describe('useReplyEdit', () => {
  it('REPLY_ACTION sets replyMessage and clears editMessage', () => {
    const { result, dispose } = runScope(() => useReplyEdit())
    const reply = stubMessage('m1')
    const edit = stubMessage('m2')

    result.dispatch({ action: { id: EDIT_ACTION, label: 'Edit' }, message: edit })
    expect(result.editMessage.value).toEqual(edit)

    result.dispatch({ action: { id: REPLY_ACTION, label: 'Reply' }, message: reply })
    expect(result.replyMessage.value).toEqual(reply)
    expect(result.editMessage.value).toBe(null)

    dispose()
  })

  it('EDIT_ACTION sets editMessage and clears replyMessage', () => {
    const { result, dispose } = runScope(() => useReplyEdit())
    const reply = stubMessage('m1')
    const edit = stubMessage('m2')

    result.dispatch({ action: { id: REPLY_ACTION, label: 'Reply' }, message: reply })
    result.dispatch({ action: { id: EDIT_ACTION, label: 'Edit' }, message: edit })

    expect(result.editMessage.value).toEqual(edit)
    expect(result.replyMessage.value).toBe(null)

    dispose()
  })

  it('non-built-in actions are a no-op for state but still safe to dispatch', () => {
    const { result, dispose } = runScope(() => useReplyEdit())
    result.dispatch({
      action: { id: 'forward', label: 'Forward' },
      message: stubMessage('m1'),
    })

    expect(result.replyMessage.value).toBe(null)
    expect(result.editMessage.value).toBe(null)

    dispose()
  })

  it('resetKey change clears both reply and edit state', async () => {
    const resetKey = ref('chat-1')
    const { result, dispose } = runScope(() => useReplyEdit({ resetKey }))

    result.dispatch({
      action: { id: REPLY_ACTION, label: 'Reply' },
      message: stubMessage('m1'),
    })
    expect(result.replyMessage.value).not.toBe(null)

    resetKey.value = 'chat-2'
    await nextTick()
    expect(result.replyMessage.value).toBe(null)
    expect(result.editMessage.value).toBe(null)

    dispose()
  })

  it('resetReply clears replyMessage without touching editMessage', () => {
    const { result, dispose } = runScope(() => useReplyEdit())
    const reply = stubMessage('m1')

    result.dispatch({ action: { id: REPLY_ACTION, label: 'Reply' }, message: reply })
    result.resetReply()

    expect(result.replyMessage.value).toBe(null)
    expect(result.editMessage.value).toBe(null)

    dispose()
  })

  it('resetEdit clears editMessage without touching replyMessage', () => {
    const { result, dispose } = runScope(() => useReplyEdit())
    const edit = stubMessage('m1')

    result.dispatch({ action: { id: EDIT_ACTION, label: 'Edit' }, message: edit })
    result.resetEdit()

    expect(result.editMessage.value).toBe(null)
    expect(result.replyMessage.value).toBe(null)

    dispose()
  })
})
