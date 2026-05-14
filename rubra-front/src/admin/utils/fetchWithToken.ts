import { useAdminStore } from "../context/AdminContext"

interface FetchOptions extends RequestInit {
  method?: string
  headers?: Record<string, string>
  body?: string | FormData
}

/**
 * Wrapper para fetch que automaticamente adiciona o Authorization header com o token do admin
 */
export async function fetchWithToken(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const store = useAdminStore.getState()
  const token = store.getToken()

  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
