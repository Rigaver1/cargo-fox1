import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const ErrorBoundary = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
      <div className="bg-red-50 p-4 rounded-2xl mb-6">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Произошла ошибка</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {message || 'Не удалось загрузить данные. Попробуйте повторить попытку или обновите страницу.'}
      </p>
      
      <div className="flex space-x-3">
        <button 
          onClick={onRetry}
          className="button-primary px-6 py-2.5 rounded-xl flex items-center"
        >
          <RefreshCw size={18} className="mr-2" />
          Повторить
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="button-secondary px-6 py-2.5 rounded-xl"
        >
          Обновить страницу
        </button>
      </div>
    </div>
  )
}

export default ErrorBoundary

