import React from 'react'
import CurrencyRatesDisplay from './CurrencyRatesDisplay.jsx'
import { useState } from 'react'
import { Menu, X, Bell, Search } from 'lucide-react'

const Header = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Поиск:', searchQuery)
      // TODO: подключить поисковую навигацию
    }
  }

  return (
    <header className="header-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Кнопка бургер для мобильного меню */}
          <div className="flex items-center">
            <button 
              onClick={onMobileMenuToggle}
              className="md:hidden mr-4 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-bold text-xl">Л</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Cargo Manager <span className="text-indigo-600">Лисёнок</span></h1>
            </div>
          </div>
          
          {/* Поиск */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                  isSearchActive 
                    ? 'border-indigo-500 shadow-md bg-white' 
                    : 'border-gray-300 bg-gray-50 hover:bg-white'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                placeholder="Поиск заказов, клиентов, поставщиков..."
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </div>
          
          {/* Правый блок */}
          <div className="flex items-center space-x-4">
            {/* Уведомления */}
            <div className="relative">
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            {/* Курсы валют */}
            <CurrencyRatesDisplay />
            
            {/* Профиль */}
            <div className="flex items-center ml-3 relative group">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mr-2 shadow-md">
                <span className="text-white font-bold text-xl">Л</span>
              </div>
              <div className="hidden md:block">
                <div className="font-medium text-gray-700">Лисёнок</div>
                <div className="text-xs text-gray-500">администратор</div>
              </div>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-12 w-48 bg-white rounded-xl shadow-lg py-1 hidden group-hover:block animate-fadeIn border border-gray-100 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Мой профиль</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Настройки</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Поддержка</a>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Выйти</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

