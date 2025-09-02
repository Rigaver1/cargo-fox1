import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import Home from './components/home/Home.jsx'
import OrdersList from './components/orders/OrdersList.jsx'
import OrderDetails from './components/orders/OrderDetails.jsx'
import OrderCreate from './components/orders/OrderCreate.jsx'
import Messages from './components/messages/Messages.jsx'
import Shipments from './components/shipments/Shipments.jsx'
import Documents from './components/documents/Documents.jsx'
import Clients from './components/clients/Clients.jsx'
import Suppliers from './components/suppliers/Suppliers.jsx'
import Settings from './components/settings/Settings.jsx'
import Tracker from './components/tracker/Tracker.jsx'
import Integrations from './components/integrations/Integrations.jsx'
import Help from './components/help/Help.jsx'
import { useState, useEffect } from 'react'

function App() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  //     
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])
  
  return (
      <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
        {/*    */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="sidebar-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="mobile-sidebar">
              <Sidebar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </>
        )}
        
        {/*    */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            isMobileMenuOpen={isMobileMenuOpen}
          />
          
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/orders" element={<OrdersList />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/orders/new" element={<OrderCreate />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/tracker" element={<Tracker />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
  )
}

export default App


