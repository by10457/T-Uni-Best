import type { CustomTabBarRuntimeItem } from './types'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TabbarItem from './TabbarItem.vue'

// 隔离 tabbar store，避免模块初始化时依赖完整 uni-app 页面环境。
vi.mock('./store', () => ({
  tabbarStore: { curIdx: 0 },
}))

const baseItem: CustomTabBarRuntimeItem = {
  text: '首页',
  pagePath: '/pages/index/index',
  iconType: 'unocss',
  icon: 'i-carbon-home',
}

describe('tabbarItem', () => {
  let wrapper: ReturnType<typeof mount> | undefined

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('渲染文本', () => {
    wrapper = mount(TabbarItem, {
      props: { item: baseItem, index: 0 },
    })
    expect(wrapper.text()).toContain('首页')
  })

  it('isBulge=true 时不渲染文本', () => {
    wrapper = mount(TabbarItem, {
      props: { item: baseItem, index: 0, isBulge: true },
    })
    expect(wrapper.text()).not.toContain('首页')
  })

  it('iconType=unocss 时渲染图标 class', () => {
    wrapper = mount(TabbarItem, {
      props: { item: baseItem, index: 0 },
    })
    expect(wrapper.html()).toContain('i-carbon-home')
  })

  it('badge=dot 时渲染小红点', () => {
    wrapper = mount(TabbarItem, {
      props: { item: { ...baseItem, badge: 'dot' }, index: 0 },
    })
    expect(wrapper.html()).toContain('rounded-full')
  })

  it('badge 为数字时渲染数字角标', () => {
    wrapper = mount(TabbarItem, {
      props: { item: { ...baseItem, badge: 5 }, index: 0 },
    })
    expect(wrapper.text()).toContain('5')
  })

  it('badge 大于 99 时显示 99+', () => {
    wrapper = mount(TabbarItem, {
      props: { item: { ...baseItem, badge: 100 }, index: 0 },
    })
    expect(wrapper.text()).toContain('99+')
  })
})
