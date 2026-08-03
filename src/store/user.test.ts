import type { IUserInfoRes } from '@/api/types/login'
import { getUserInfo } from '@/api/login'
import { describe, expect, it, vi } from 'vitest'
import { useUserStore } from './user'

vi.mock('@/api/login', () => ({
  getUserInfo: vi.fn(),
}))

const createUser = (overrides: Partial<IUserInfoRes> = {}): IUserInfoRes => ({
  userId: '1',
  uniqueId: 'user-1',
  username: 'testuser',
  nickname: 'Test User',
  avatarUrl: 'https://example.com/avatar.png',
  gender: 0,
  ...overrides,
})

describe('useUserStore', () => {
  it('使用封装项目定义的初始用户信息', () => {
    const store = useUserStore()

    expect(store.userInfo.userId).toBe('-1')
    expect(store.userInfo.uniqueId).toBe('')
    expect(store.userInfo.username).toBe('')
    expect(store.userInfo.nickname).toBe('')
    expect(store.userInfo.avatarUrl).toBe('/static/images/default-avatar.png')
    expect(store.userInfo.gender).toBe(0)
  })

  it('setUserInfo：正确更新用户信息', () => {
    const store = useUserStore()
    store.setUserInfo(createUser())

    expect(store.userInfo.userId).toBe('1')
    expect(store.userInfo.username).toBe('testuser')
    expect(store.userInfo.avatarUrl).toBe('https://example.com/avatar.png')
  })

  it('setUserInfo：avatarUrl 为空时使用默认头像', () => {
    const store = useUserStore()
    store.setUserInfo(createUser({ avatarUrl: '' }))

    expect(store.userInfo.avatarUrl).toBe('/static/images/default-avatar.png')
  })

  it('setUserAvatar：正确更新头像', () => {
    const store = useUserStore()
    store.setUserAvatar('https://example.com/new-avatar.png')

    expect(store.userInfo.avatarUrl).toBe('https://example.com/new-avatar.png')
  })

  it('clearUserInfo：重置状态并清理持久化数据', () => {
    const store = useUserStore()
    store.setUserInfo(createUser())

    store.clearUserInfo()

    expect(store.userInfo.userId).toBe('-1')
    expect(store.userInfo.username).toBe('')
    expect(uni.removeStorageSync).toHaveBeenCalledWith('user')
  })

  it('fetchUserInfo：调用 API 并将结果写入 store', async () => {
    const store = useUserStore()
    const mockUser = createUser({
      userId: '42',
      uniqueId: 'api-user-42',
      username: 'api_user',
      nickname: 'API User',
    })
    vi.mocked(getUserInfo).mockResolvedValue(mockUser)

    await store.fetchUserInfo()

    expect(getUserInfo).toHaveBeenCalledTimes(1)
    expect(store.userInfo).toEqual(mockUser)
  })
})
