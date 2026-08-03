import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, vi } from 'vitest'

// 每个用例使用独立的 Pinia，避免 store 状态在测试之间泄漏。
beforeEach(() => {
  // 单元测试只验证 store 逻辑，不注册持久化插件。
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

// jsdom 不提供 uni-app 运行时，因此集中模拟测试所需的最小 API。
const uniMock = {
  showToast: vi.fn(),
  hideToast: vi.fn(),
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  showModal: vi.fn(),
  navigateTo: vi.fn(),
  redirectTo: vi.fn(),
  navigateBack: vi.fn(),
  switchTab: vi.fn(),
  reLaunch: vi.fn(),
  getStorageSync: vi.fn().mockReturnValue(null),
  setStorageSync: vi.fn(),
  removeStorageSync: vi.fn(),
  getStorage: vi.fn(),
  setStorage: vi.fn(),
  removeStorage: vi.fn(),
  request: vi.fn(),
  uploadFile: vi.fn(),
  chooseImage: vi.fn(),
  getSystemInfoSync: vi.fn().mockReturnValue({ platform: 'devtools' }),
  getSystemInfo: vi.fn(),
  onNetworkStatusChange: vi.fn(),
  getNetworkType: vi.fn(),
}

Object.defineProperty(globalThis, 'uni', {
  value: uniMock,
  writable: true,
  configurable: true,
})

// getCurrentPages 是 uni-app 的独立全局函数，不属于 uni 对象。
Object.defineProperty(globalThis, 'getCurrentPages', {
  value: vi.fn().mockReturnValue([{ route: '/pages/index/index' }]),
  writable: true,
  configurable: true,
})
