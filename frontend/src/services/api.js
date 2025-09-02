import axios from 'axios'

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Перехватчик запросов
api.interceptors.request.use(config => {
  // Здесь можно добавить токен авторизации, если понадобится
  return config
})

// Перехватчик ответов
api.interceptors.response.use(
  response => response,
  error => {
    // Обработка ошибок
    if (error.response) {
      // Сервер ответил с кодом состояния, отличным от 2xx
      console.error('API Error:', error.response.data)
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // Запрос был сделан, но ответа не получено
      console.error('No response received:', error.request)
      return Promise.reject({ message: 'Не удалось подключиться к серверу' })
    } else {
      // Что-то произошло при настройке запроса
      console.error('Error', error.message)
      return Promise.reject({ message: error.message })
    }
  }
)

export default api