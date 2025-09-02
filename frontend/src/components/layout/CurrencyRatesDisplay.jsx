import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadCurrencyRates, refreshCurrencyRates } from '../../services/currencyService'
import { RefreshCw, CircleDollarSign, TrendingUp } from 'lucide-react'

const CurrencyRatesDisplay = () => {
  const dispatch = useDispatch()
  const currencyRates = useSelector(state => state.currency.rates)
  const lastUpdate = useSelector(state => state.currency.lastUpdate)
  const updateStatus = useSelector(state => state.currency.updateStatus)
  const error = useSelector(state => state.currency.error)
  const [isUpdating, setIsUpdating] = useState(false)
  
  useEffect(() => {
    dispatch(loadCurrencyRates())
    const interval = setInterval(() => {
      dispatch(refreshCurrencyRates())
    }, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [dispatch])
  
  const handleManualUpdate = () => {
    setIsUpdating(true)
    dispatch(refreshCurrencyRates())
      .finally(() => setIsUpdating(false))
  }
  
  if (!currencyRates) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-600">Загрузка курсов...</span>
      </div>
    )
  }
  
  const cnyToRub = currencyRates['RUB'] ? currencyRates['RUB'] : null
  const cnyToUsd = currencyRates['USD'] ? currencyRates['USD'] : null
  
  return (
    <div className="flex items-center space-x-6 bg-gray-100 rounded-xl px-4 py-2">
      {/* CNY → RUB */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <CircleDollarSign size={16} className="text-blue-600" />
          <span className="text-xs font-medium text-gray-700">CNY → RUB</span>
        </div>
        <div className="flex items-baseline space-x-1 mt-1">
          <span className="text-sm font-bold text-gray-900">≈1 =</span>
          <span className="text-lg font-bold text-blue-600">
            {cnyToRub ? cnyToRub.toFixed(2) : '—'} ₽
          </span>
        </div>
      </div>
      
      <div className="w-px h-6 bg-gray-300"></div>
      
      {/* CNY → USD */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <CircleDollarSign size={16} className="text-blue-600" />
          <span className="text-xs font-medium text-gray-700">CNY → USD</span>
        </div>
        <div className="flex items-baseline space-x-1 mt-1">
          <span className="text-sm font-bold text-gray-900">≈1 =</span>
          <span className="text-lg font-bold text-blue-600">
            {cnyToUsd ? cnyToUsd.toFixed(4) : '—'} $
          </span>
        </div>
      </div>
      
      {/* Обновить теперь */}
      <button 
        onClick={handleManualUpdate}
        disabled={isUpdating}
        className={`p-1.5 rounded-lg hover:bg-gray-200 transition-colors ${
          isUpdating ? 'cursor-not-allowed opacity-50' : ''
        }`}
        title="Обновить курсы"
      >
        {isUpdating ? (
          <RefreshCw size={16} className="animate-spin text-gray-500" />
        ) : (
          <RefreshCw size={16} className="text-gray-500" />
        )}
      </button>
      
      {/* Время обновления */}
      <div className="text-xs text-gray-500 ml-2">
        {lastUpdate 
          ? `обн.: ${new Date(lastUpdate).toLocaleTimeString()}` 
          : 'Ещё не обновлялось'}
      </div>
      
      <div className="ml-2 p-1 bg-green-50 rounded-lg">
        <TrendingUp size={14} className="text-green-600" />
      </div>
      
      {/* Ошибка */}
      {updateStatus === 'failed' && error && (
        <div className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg">
          Ошибка: {String(error).substring(0, 30)}...
        </div>
      )}
    </div>
  )
}

export default CurrencyRatesDisplay
