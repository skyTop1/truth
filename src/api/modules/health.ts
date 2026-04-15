import { http } from '@/api/http'

// Placeholder module only.
// Do not wire this into product flows until the local-first constraint is explicitly lifted.
export interface HealthResponse {
  status: string
  timestamp: string
}

export function fetchHealth() {
  return http<HealthResponse>({
    url: '/health',
    method: 'GET'
  })
}
