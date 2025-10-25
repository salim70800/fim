import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'الرئيسية', href: '/' },
    { name: 'أفلام', href: '/movies' },
    { name: 'مسلسلات', href: '/series' },
    { name: 'أنمي', href: '/anime' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Right side in RTL */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold font-display">
              <span className="text-primary-500">سينما</span>
              <span className="text-neutral-200">تك</span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-body font-medium transition-all duration-fast relative ${
                  isActive(item.href)
                    ? 'text-neutral-200'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-primary-500"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Search Icon - Left side in RTL */}
          <div className="flex items-center gap-4">
            <Link
              to="/search"
              className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 rounded-lg transition-all duration-fast"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 rounded-lg transition-all duration-fast"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-700/50">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 text-body font-medium rounded-lg transition-all duration-fast ${
                    isActive(item.href)
                      ? 'text-neutral-200 bg-neutral-800'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
