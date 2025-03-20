import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

async function refreshToken() {
  try {
    const response = await api.post('/auth/manual')
    const newToken: string = response.data.access_token

    const cookiesExpiresInSecunds = 60 * 10 // 10 min

    Cookies.set('jao.token', newToken, {
      path: '/',
      expires: cookiesExpiresInSecunds,
    })

    return {
      token: newToken,
    }
  } catch (error) {
    console.error(error)
  }
}


api.interceptors.request.use((request) => {
  const headers = request.headers ?? {}
  const token = Cookies.get('jao.token')

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  request.headers = headers
  return request
})

let countRetry = 0

api.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config

    if (countRetry > 5) {
      Cookies.remove('refreshToken')
      document.cookie = 'jao.token=; Path=/; max-age='
      window.location.href = '/login'

      return Promise.reject(error)
    } else if (
      (error.response.status === 403 && !originalRequest._retry) ||
      error.response.status === 401
    ) {
      countRetry = countRetry + 1

      originalRequest._retry = true
      const refreshResponse = await refreshToken()
      const token = refreshResponse?.token
      axios.defaults.headers.common.Authorization = 'Bearer ' + token
      const cookiesExpiresInSecunds = 60 * 10 // 10 min
      document.cookie = `jao.token=${token}; Path=/; max-age=${cookiesExpiresInSecunds}`
      return api(originalRequest)
    } else if (error instanceof AxiosError) {
      return Promise.reject(error)
    } else {
      Cookies.remove('jao.token')
      Cookies.remove('refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
