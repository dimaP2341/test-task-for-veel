import axios, { AxiosRequestConfig } from 'axios'
import { Todo } from '../types/api'

const url = 'https://jsonplaceholder.typicode.com'

async function apiRequest<T>(
  url: string,
  key: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET',
  data?: any,
  options: AxiosRequestConfig = {},
  asyncOption?: { signal?: AbortSignal },
): Promise<T> {
  try {
    const response = await axios({
      url: `${url}/${key}`,
      method,
      data,
      ...options,
      ...asyncOption,
    })

    return response.data
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`)
  }
}

export async function getTodos(options?: AxiosRequestConfig = {}) {
  return apiRequest<Todo[]>(url, '/todos?_limit=10', 'GET', undefined, options)
}

export async function postTodo(payload: Todo, options?: AxiosRequestConfig = {}) {
  return apiRequest<Todo>(url, '/todos', 'POST', payload, options)
}

export async function deleteTodo(id: number, options?: AxiosRequestConfig = {}) {
  return apiRequest<void>(url, `todos/${id}`, 'DELETE', undefined, options)
}
