import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import useRequest from './useRequest'

/**
 * 在临时 Vue 组件的 setup 上下文中运行 composable。
 */
function withSetup<T>(composableFn: () => T): T {
  let result!: T
  const component = defineComponent({
    setup() {
      result = composableFn()
      return () => h('div')
    },
  })
  const wrapper = mount(component)
  wrapper.unmount()
  return result
}

describe('useRequest', () => {
  it('使用默认初始状态', () => {
    const asyncFn = vi.fn().mockResolvedValue('data')
    const { loading, error, data } = withSetup(() => useRequest(asyncFn))

    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
    expect(data.value).toBeUndefined()
  })

  it('使用传入的 initialData', () => {
    const asyncFn = vi.fn().mockResolvedValue('new')
    const { data } = withSetup(() => useRequest(asyncFn, { initialData: 'init' }))

    expect(data.value).toBe('init')
  })

  it('请求成功时更新 loading 和 data', async () => {
    const asyncFn = vi.fn().mockResolvedValue('result')
    const { loading, data, run } = withSetup(() => useRequest(asyncFn))

    const runPromise = run()
    expect(loading.value).toBe(true)

    await runPromise

    expect(loading.value).toBe(false)
    expect(data.value).toBe('result')
  })

  it('请求失败时记录错误并重置 loading', async () => {
    const requestError = new Error('network error')
    const asyncFn = vi.fn().mockRejectedValue(requestError)
    const { loading, error, run } = withSetup(() => useRequest(asyncFn))

    await expect(run()).rejects.toThrow('network error')

    expect(loading.value).toBe(false)
    expect(error.value).toBe(requestError)
  })

  it('immediate=true 时立即请求并更新 data', async () => {
    const asyncFn = vi.fn().mockResolvedValue('eager')
    const { data } = withSetup(() => useRequest(asyncFn, { immediate: true }))

    expect(asyncFn).toHaveBeenCalledTimes(1)
    await asyncFn.mock.results[0].value
    expect(data.value).toBe('eager')
  })
})
