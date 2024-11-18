import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoMenu, IoClose } from 'react-icons/io5';

export default function Navbar({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <IoMenu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-4">
                <Image
                  src="/favicon.ico"
                  alt="Logo"
                  width={30}
                  height={30}
                  className="mr-4"
                />
                <span className="font-semibold text-xl">{title}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation Drawer */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Nom Kitties</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Dashboard
            </Link>

            <Link
              href="/online-game"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Play Online
            </Link>

            <Link
              href="/online-game"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Feline Forum
            </Link>
            <Link
              href="/local-game"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Local Game
            </Link>
            <Link
              href="/learn-more"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Learn More
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
