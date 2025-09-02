import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home as HomeIcon, MessageCircle, Package, FileText, Users, Factory, Settings, Plus } from 'lucide-react'

const StatCard = ({ title, value, subtitle, to }) => (
  <Link to={to} className="block">
    <div className="info-panel hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  </Link>
)

const ActionTile = ({ to, icon: Icon, title, desc, accent = 'text-indigo-600' }) => (
  <Link to={to} className="block">
    <div className="card p-5 h-full">
      <div className={`mb-3 inline-flex p-2 rounded-lg bg-gray-50 ${accent}`}>
        <Icon size={18} />
      </div>
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="text-sm text-gray-600 mt-1 flex-1">{desc}</div>
      <div className="mt-3 text-sm font-medium text-indigo-600">Открыть</div>
    </div>
  </Link>
)

const Home = () => {
  const navigate = useNavigate()
  const orders = useSelector(state => state.orders.orders)

  const totalOrders = orders?.length ?? 0

  return (
    <div className="max-w-7xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Главная</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xl font-bold text-gray-900">Добро пожаловать в Cargo Manager Лисёнок!</div>
            <p className="text-gray-600 mt-1">Это тестовая версия интерфейса. Проверьте разделы меню и дайте обратную связь.</p>
          </div>
          <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">Тестовая версия</div>
        </div>

        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="font-semibold text-gray-900 mb-1">Как это работает</div>
          <div className="text-sm text-gray-700">Программа объединяет управление заявками, сообщениями, грузами и документами в одном интерфейсе. Все разделы связаны между собой для удобства работы.</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-lg font-semibold text-gray-900 mb-3">Статистика</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Активные заявки" value={totalOrders} subtitle="Перейти к списку" to="/orders" />
          <StatCard title="Непрочитанные сообщения" value={0} subtitle="Telegram / WeChat / WhatsApp" to="/messages" />
          <StatCard title="Грузы в пути" value={0} subtitle="Открыть трекер" to="/tracker" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Link to="/orders/new" className="button-primary px-4 py-2 rounded-lg inline-flex items-center">
            <Plus size={18} className="mr-2" />
            Создать заявку
          </Link>
          <Link to="/documents" className="button-secondary px-4 py-2 rounded-lg">Экспорт отчета</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionTile to="/orders" icon={FileText} title="Заявки" desc="Создание, список и детали заявок" accent="text-amber-600" />
        <ActionTile to="/messages" icon={MessageCircle} title="Сообщения" desc="Переписка с клиентами и поставщиками" accent="text-blue-600" />
        <ActionTile to="/tracker" icon={Package} title="Трекер" desc="Этапы и статусы грузов" accent="text-purple-600" />
        <ActionTile to="/documents" icon={FileText} title="Документы" desc="Просчеты, спецификации, счета" accent="text-amber-600" />
        <ActionTile to="/clients" icon={Users} title="Клиенты" desc="Синхронизация и контакты" accent="text-blue-600" />
        <ActionTile to="/suppliers" icon={Factory} title="Поставщики" desc="Контакты и статусы WeChat" accent="text-red-600" />
        <ActionTile to="/integrations" icon={Settings} title="Подключения" desc="Telegram, WeChat, WhatsApp" accent="text-gray-600" />
        <ActionTile to="/help" icon={FileText} title="Справка" desc="Видео и инструкции" accent="text-gray-600" />
      </div>
    </div>
  )
}

export default Home

