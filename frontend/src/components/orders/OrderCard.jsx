import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, User, Factory, CreditCard, Calendar } from 'lucide-react'

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Новый':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'в работе':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'на таможне':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'доставлен':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const getCardColor = (status) => {
    switch (status) {
      case 'Новый':
        return 'hover:border-purple-300'
      case 'в работе':
        return 'hover:border-blue-300'
      case 'на таможне':
        return 'hover:border-yellow-300'
      case 'доставлен':
        return 'hover:border-green-300'
      default:
        return 'hover:border-gray-300'
    }
  }
  
  return (
    <Link to={`/orders/${order.id}`} className="block fade-in">
      <div className={`order-card border-l-4 ${getCardColor(order.status)}`}>
        <div className="p-5">
          {/* Заголовок карточки */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Заказ #{order.id}</h3>
              <p className="text-sm text-gray-600 mt-1">{order.name}</p>
            </div>
            <span className={`status-badge px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          {/* Клиент/Поставщик */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <User size={14} className="mr-1.5" />
                Клиент
              </div>
              <div className="font-medium text-gray-900 truncate">{order.client_name || 'Без названия'}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Factory size={14} className="mr-1.5" />
                Поставщик
              </div>
              <div className="font-medium text-gray-900 truncate">{order.supplier_name || 'Shenzhen Electronics'}</div>
            </div>
          </div>
          
          {/* Суммы */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 p-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CreditCard size={14} className="mr-1.5" />
              Сумма
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {order.total_cny.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CNY
            </div>
            <div className="text-sm text-gray-600">
              {order.total_rub.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽ /{' '}
              {order.total_usd.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </div>
          </div>
          
          {/* Дата */}
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-1.5" />
            {new Date(order.created_date ?? Date.now()).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
        
        {/* Футер */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
            <Briefcase size={14} className="mr-1" />
            Детали сделки
          </button>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Открыть
          </button>
        </div>
      </div>
    </Link>
  )
}

export default OrderCard

