'use client'
import Link from 'next/link'

export default function SideNav() {
  return (
    <nav className="side-navigation">
      {/* Replace with your navigation items */}
      <Link href="/">Home</Link>
      <Link href="/game">Game</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  )
}
