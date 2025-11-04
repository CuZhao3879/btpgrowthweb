import React, { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from '../WhatsAppButton'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden" style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <main className="flex-grow w-full" style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Layout

