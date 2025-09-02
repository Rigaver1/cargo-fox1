import React from 'react'
import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="bg-white p-3 rounded-full shadow-lg">
          <Loader2 size={32} className="text-blue-600 animate-spin" />
        </div>
      </div>
      <p className="text-gray-600 text-lg font-medium">Загрузка данных...</p>
      <p className="text-gray-500 text-sm mt-1">Пожалуйста, подождите</p>
    </div>
  )
}

export default Loader

