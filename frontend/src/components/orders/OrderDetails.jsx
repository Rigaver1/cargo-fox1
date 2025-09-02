import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchOrder } from '../../services/orderActions'
import Loader from '../common/Loader.jsx'
import ErrorBoundary from '../common/ErrorBoundary.jsx'
import { 
  ArrowLeft, 
  MoreVertical, 
  MessageCircle, 
  Package, 
  FileText, 
  Download, 
  Edit, 
  Trash2,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Briefcase
} from 'lucide-react'

const OrderDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { order, loading, error } = useSelector(state => state.orders)
  const [activeTab, setActiveTab] = useState('details')
  const [showActions, setShowActions] = useState(false)
  
  useEffect(() => {
    dispatch(fetchOrder(id))
  }, [dispatch, id])
  
  if (loading) return <Loader />
  if (error || !order) {
    return <ErrorBoundary message={error || "Заказ не найден"} onRetry={() => dispatch(fetchOrder(id))} />
  }
  
  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 relative">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <button 
                  onClick={() => window.history.back()}
                  className="mr-3 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  title="Назад"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Заказ #{order.id}</h1>
              </div>
              <p className="mt-1 text-gray-600">{order.name}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  title="Действия"
                >
                  <MoreVertical size={18} />
                </button>
                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 z-50">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Edit size={16} className="mr-2" />
                      Редактировать
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Download size={16} className="mr-2" />
                      Скачать документы
                    </a>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                        <Trash2 size={16} className="mr-2" />
                        Удалить заказ
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                order.status === 'в работе' ? 'bg-blue-100 text-blue-800' :
                order.status === 'на таможне' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'доставлен' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'details' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Детали
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'messages' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageCircle size={16} className="inline mr-1.5" />
              Сообщения
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'shipments' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('shipments')}
            >
              <Package size={16} className="inline mr-1.5" />
              Отгрузки
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'documents' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              <FileText size={16} className="inline mr-1.5" />
              Документы
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Информация о заказе</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="text-gray-500">Клиент</div>
                  <div className="font-medium text-gray-900">{order.client_name || '—'}</div>
                  <div className="text-gray-500">Поставщик</div>
                  <div className="font-medium text-gray-900">{order.supplier_name || '—'}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Статусы</h2>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center"><CheckCircle className="text-green-600 mr-2" size={16}/> Создан</div>
                  <div className="flex items-center"><AlertTriangle className="text-amber-600 mr-2" size={16}/> В работе</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

