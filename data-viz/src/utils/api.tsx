import { authService } from '../authContext/AuthService'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL 

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean
}

export async function fetchData<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options
  const url = `${BASE_URL}${endpoint}`

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    }

    if (requiresAuth) {
      let token = authService.getAccessToken()
      if (!token) {
        throw new Error('No authentication token available')
      }

      if (authService.isTokenExpired(token)) {
        const newToken = await authService.refreshToken()
        if (!newToken) {
          throw new Error('Failed to refresh authentication token')
        }
        token = newToken
      }

      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return data as T
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export function createDataFetcher<T>() {
  return async (endpoint: string = '', options: FetchOptions = {}): Promise<T> => {
    return fetchData<T>(endpoint, options)
  }
}