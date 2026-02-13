import { http } from '@/http/http'

export function healthCheck() {
  return http.get('/health')
}
