import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../../services/orderActions'
import OrderCard from './OrderCard.jsx'
import Loader from '../common/Loader.jsx'
import ErrorBoundary from '../common/ErrorBoundary.jsx'
import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const OrdersList = () => {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector(state => state.orders)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  
  const filteredOrders = React.useMemo(() => {
    let result = [...orders]
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(order => 
        String(order.id).toLowerCase().includes(term) ||
        order.name.toLowerCase().includes(term) ||
        (order.client_name && order.client_name.toLowerCase().includes(term))
      )
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(order => order.status === selectedStatus)
    }
    
    switch (sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
        break
      case 'date-desc':
        result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        break
      case 'amount-asc':
        result.sort((a, b) => a.total_cny - b.total_cny)
        break
      case 'amount-desc':
        result.sort((a, b) => b.total_cny - a.total_cny)
        break
      default:
        break
    }
    
    return result
  }, [orders, searchTerm, selectedStatus, sortBy])
  
  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  // Синхронизируем фильтр статуса с query-параметрами (?status=active|done)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const status = params.get('status')
    if (status === 'active') setSelectedStatus('в работе')
    else if (status === 'done') setSelectedStatus('доставлен')
    else setSelectedStatus('all')
  }, [location.search])
  
  if (loading) {
    return <Loader />
  }
  
  if (error) {
    return <ErrorBoundary message={error} onRetry={() => dispatch(fetchOrders())} />
  }
  
  return (
    <div className="max-w-7xl mx-auto fade-in">
      {/* Заголовок и панель действий */}
      <div className="h-16 mb-6 px-4 py-3 bg-white rounded-xl shadow-sm flex items-center justify-between">
        <div className="font-semibold">Список заказов</div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Поиск..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button className="button-primary px-5 py-2.5 rounded-xl flex items-center">
            <Plus size={18} className="mr-2" />
            Новый заказ
          </button>
        </div>
      </div>
      
      {/* Итоги */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="info-panel">
          <div className="info-panel-title">Всего заказов</div>
          <div className="info-panel-value">{orders.length}</div>
        </div>
        <div className="info-panel">
          <div className="info-panel-title">В работе</div>
          <div className="info-panel-value text-blue-600">{orders.filter(o => o.status === 'в работе').length}</div>
        </div>
        <div className="info-panel">
          <div className="info-panel-title">На таможне</div>
          <div className="info-panel-value text-yellow-600">{orders.filter(o => o.status === 'на таможне').length}</div>
        </div>
        <div className="info-panel">
          <div className="info-panel-title">Сумма (CNY)</div>
          <div className="info-panel-value">
            {orders.reduce((sum, order) => sum + (order.total_cny || 0), 0).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} CNY
          </div>
        </div>
      </div>
      
      {/* Сетка заказов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

export default OrdersList
