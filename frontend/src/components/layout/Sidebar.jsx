import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  MessageCircle, 
  Package, 
  FileText, 
  Users, 
  Factory, 
  Settings, 
  ChevronDown,
  Plus
} from 'lucide-react'
import { useSelector } from 'react-redux'

const Sidebar = ({ isMobile = false, onClose = () => {} }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const orders = useSelector(state => state.orders.orders)

  const ordersCount = orders.length
  const inWorkCount = orders.filter(o => o.status === 'в работе').length
  const customsCount = orders.filter(o => o.status === 'на таможне').length

  const isOrdersSection = location.pathname.startsWith('/orders')
  const isMessagesSection = location.pathname.startsWith('/messages')
  const isTrackerSection = location.pathname.startsWith('/tracker')
  const isDocumentsSection = location.pathname.startsWith('/documents')
  const isClientsSection = location.pathname.startsWith('/clients')
  const isSuppliersSection = location.pathname.startsWith('/suppliers')
  const isIntegrationsSection = location.pathname.startsWith('/integrations')

  const [ordersOpen, setOrdersOpen] = useState(isOrdersSection)
  const [messagesOpen, setMessagesOpen] = useState(isMessagesSection)
  const [trackerOpen, setTrackerOpen] = useState(isTrackerSection)
  const [documentsOpen, setDocumentsOpen] = useState(isDocumentsSection)
  const [clientsOpen, setClientsOpen] = useState(isClientsSection)
  const [suppliersOpen, setSuppliersOpen] = useState(isSuppliersSection)
  const [integrationsOpen, setIntegrationsOpen] = useState(isIntegrationsSection)

  const go = (path) => {
    navigate(path)
    if (isMobile) onClose()
  }

  return (
    <div className={`sidebar-gradient h-full ${isMobile ? 'fixed inset-y-0 left-0 w-64 z-50' : 'w-64'} flex flex-col`}>
      {/* Шапка */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-md">
            <span className="text-white font-bold text-xl">Л</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Cargo Manager</h1>
            <div className="flex items-center mt-1">
              <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Лисёнок</div>
              <span className="ml-2 text-xs text-gray-500">v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Основное */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="mb-4">
          <div className="px-5 mb-2 mt-4 flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span className="mr-2 opacity-75">ОСНОВНОЕ</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          <Link
            to="/"
            onClick={isMobile ? onClose : undefined}
            className={`flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              location.pathname === '/' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${location.pathname === '/' ? 'bg-indigo-100 text-indigo-600' : 'text-indigo-600'}`}>
              <Home size={18} />
            </div>
            <span className="flex-1 font-medium">Главная</span>
          </Link>

          {/* Заявки с подменю */}
          <button
            type="button"
            onClick={() => { setOrdersOpen(!ordersOpen); go('/orders') }}
            className={`w-full text-left flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              isOrdersSection ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${isOrdersSection ? 'bg-indigo-100 text-indigo-600' : 'text-amber-600'}`}>
              <FileText size={18} />
            </div>
            <span className="flex-1 font-medium">Заявки</span>
            {ordersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{ordersCount}</span>
            )}
          </button>
          {ordersOpen && (
            <div className="ml-12 mt-1 mb-2 space-y-1">
              <Link to="/orders" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Все заявки</Link>
              <Link to="/orders?status=active" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Активные</Link>
              <Link to="/orders?status=done" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Завершенные</Link>
              <Link to="/orders/new" onClick={() => isMobile && onClose()} className="block text-sm text-green-600 hover:text-green-700 flex items-center">
                <Plus size={14} className="mr-1" />
                Создать заявку
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => { setMessagesOpen(!messagesOpen); go('/messages') }}
            className={`w-full text-left flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              isMessagesSection ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${isMessagesSection ? 'bg-indigo-100 text-indigo-600' : 'text-green-600'}`}>
              <MessageCircle size={18} />
            </div>
            <span className="flex-1 font-medium">Сообщения</span>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">2</span>
          </button>
          {messagesOpen && (
            <div className="ml-12 mt-1 mb-2 space-y-1">
              <Link to="/messages" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Все сообщения</Link>
              <Link to="/messages?filter=unread" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Непрочитанные</Link>
              <Link to="/messages/telegram" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Telegram</Link>
              <Link to="/messages/wechat" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">WeChat</Link>
              <Link to="/messages/whatsapp" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">WhatsApp</Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => { setTrackerOpen(!trackerOpen); go('/tracker') }}
            className={`w-full text-left flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              isTrackerSection ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${isTrackerSection ? 'bg-indigo-100 text-indigo-600' : 'text-purple-600'}`}>
              <Package size={18} />
            </div>
            <span className="flex-1 font-medium">Трекер грузов</span>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
          {trackerOpen && (
            <div className="ml-12 mt-1 mb-2 space-y-1">
              <Link to="/tracker" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Все грузы</Link>
              <Link to="/tracker?status=in-transit" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">В пути</Link>
              <Link to="/tracker?status=customs" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">На таможне</Link>
              <Link to="/tracker/new" onClick={() => isMobile && onClose()} className="block text-sm text-green-600 hover:text-green-700 flex items-center">
                <Plus size={14} className="mr-1" />
                Создать груз
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => { setDocumentsOpen(!documentsOpen); go('/documents') }}
            className={`w-full text-left flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              isDocumentsSection ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${isDocumentsSection ? 'bg-indigo-100 text-indigo-600' : 'text-amber-600'}`}>
              <FileText size={18} />
            </div>
            <span className="flex-1 font-medium">Документы</span>
          </button>
          {documentsOpen && (
            <div className="ml-12 mt-1 mb-2 space-y-1">
              <Link to="/documents/quotes" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Итоговые просчёты</Link>
              <Link to="/documents/specs" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Спецификации</Link>
              <Link to="/documents/invoices" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Счета</Link>
              <Link to="/documents/new" onClick={() => isMobile && onClose()} className="block text-sm text-green-600 hover:text-green-700 flex items-center">
                <Plus size={14} className="mr-1" />
                Сформировать документ
              </Link>
            </div>
          )}
        </div>

        {/* Инструменты */}
        <div className="mb-4">
          <div className="px-5 mb-2 mt-4 flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span className="mr-2 opacity-75">ИНСТРУМЕНТЫ</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          <button
            type="button"
            onClick={() => { setClientsOpen(!clientsOpen); go('/clients') }}
            className={`w-full text-left flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              isClientsSection ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${isClientsSection ? 'bg-indigo-100 text-indigo-600' : 'text-blue-600'}`}><Users size={18} /></div>
            <span className="flex-1 font-medium">Клиенты</span>
          </button>
          {clientsOpen && (
            <div className="ml-12 mt-1 mb-2 space-y-1">
              <Link to="/clients" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Все клиенты</Link>
              <Link to="/clients/telegram" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Telegram контакты</Link>
              <Link to="/clients/new" onClick={() => isMobile && onClose()} className="block text-sm text-green-600 hover:text-green-700 flex items-center">
                <Plus size={14} className="mr-1" />
                Добавить клиента
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => { setSuppliersOpen(!suppliersOpen); go('/suppliers') }}
            className={`w-full text-left flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              isSuppliersSection ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${isSuppliersSection ? 'bg-indigo-100 text-indigo-600' : 'text-red-600'}`}><Factory size={18} /></div>
            <span className="flex-1 font-medium">Поставщики</span>
          </button>
          {suppliersOpen && (
            <div className="ml-12 mt-1 mb-2 space-y-1">
              <Link to="/suppliers" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Все поставщики</Link>
              <Link to="/suppliers/wechat" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">WeChat контакты</Link>
              <Link to="/suppliers/new" onClick={() => isMobile && onClose()} className="block text-sm text-green-600 hover:text-green-700 flex items-center">
                <Plus size={14} className="mr-1" />
                Добавить поставщика
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => { setIntegrationsOpen(!integrationsOpen); go('/integrations') }}
            className={`w-full text-left flex items-center px-5 py-3 text-sm transition-all duration-200 ${
              isIntegrationsSection ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`mr-3 p-1.5 rounded-lg ${isIntegrationsSection ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}><Settings size={18} /></div>
            <span className="flex-1 font-medium">Подключения</span>
          </button>
          {integrationsOpen && (
            <div className="ml-12 mt-1 mb-2 space-y-1">
              <Link to="/integrations/telegram" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">Telegram (личный)</Link>
              <Link to="/integrations/wechat" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">WeChat</Link>
              <Link to="/integrations/whatsapp" onClick={() => isMobile && onClose()} className="block text-sm text-gray-700 hover:text-gray-900">WhatsApp</Link>
            </div>
          )}
        </div>

        {/* Дополнительно */}
        <div className="mb-4">
          <div className="px-5 mb-2 mt-4 flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span className="mr-2 opacity-75">ДОПОЛНИТЕЛЬНО</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          <Link to="/settings" onClick={isMobile ? onClose : undefined} className={`flex items-center px-5 py-3 text-sm transition-all duration-200 ${location.pathname === '/settings' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
            <div className={`mr-3 p-1.5 rounded-lg ${location.pathname === '/settings' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}><Settings size={18} /></div>
            <span className="flex-1 font-medium">Настройки</span>
          </Link>
          <Link to="/help" onClick={isMobile ? onClose : undefined} className={`flex items-center px-5 py-3 text-sm transition-all duration-200 ${location.pathname === '/help' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
            <div className={`mr-3 p-1.5 rounded-lg ${location.pathname === '/help' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}><FileText size={18} /></div>
            <span className="flex-1 font-medium">Справка</span>
          </Link>
        </div>
      </nav>

      {/* Низ */}
      <div className="p-5 border-t border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-md">
            <span className="text-white font-bold text-xl">Л</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">Лисёнок</div>
            <div className="text-xs text-gray-500 mt-0.5">администратор</div>
          </div>
          <div className="relative">
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>Система работает нормально</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
