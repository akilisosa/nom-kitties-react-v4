'use client'
import { useState } from 'react'
import Image from 'next/image'
import SideNav from './SideNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const [title, setTitle] = useState('Nom Kitties')

  return (
    <div className="app-container">
      <nav className={`side-nav ${isSideNavOpen ? 'open' : ''}`}>
        <header className="nav-header">
          <h1>Nom Kitties</h1>
        </header>
        <div className="nav-content">
          <SideNav />
        </div>
      </nav>

      <main className="main-content">
        <header className="main-header">
          <button 
            className="menu-button"
            onClick={() => setIsSideNavOpen(!isSideNavOpen)}
          >
            ☰
          </button>
          <div className="title-container">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={30}
              height={30}
              className="header-logo"
            />
            <h1>{title}</h1>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  )
}
