import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Sidebar from './Sidebar'
import ChatInput from './ChatInput'
import { Menu, Bell, User, Sun, Moon } from 'lucide-react'

interface MainLayoutProps {
    children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { toggleSidebar, notifications, theme, toggleTheme } = useApp()
    const navigate = useNavigate()
    const location = useLocation()
    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="flex h-screen bg-white dark:bg-dark-bg overflow-hidden transition-colors duration-300">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex items-center justify-between px-4 py-3 border-b border-divider dark:border-dark-border bg-white dark:bg-dark-card transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-surface dark:hover:bg-dark-elevated rounded-lg transition-colors">
                            <Menu size={20} className="dark:text-gray-300" />
                        </button>
                        <div className="lg:hidden flex items-center gap-2">
                            <img src="/logo-new.png" alt="PragenX Logo" className="w-7 h-7 rounded-lg object-contain bg-white dark:bg-transparent" />
                            <span className="font-semibold text-gray-900 dark:text-gray-100">PragenX</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-full transition-all duration-300 hover:scale-105"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun size={20} className="text-amber-400" />
                            ) : (
                                <Moon size={20} />
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/notifications')}
                            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-full transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-card"></span>
                            )}
                        </button>

                        <button
                            onClick={() => location.pathname === '/profile' ? navigate('/dashboard') : navigate('/profile')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${location.pathname === '/profile'
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                : 'bg-primary-50 dark:bg-primary-900/30 text-primary dark:text-primary-300 border-primary-100 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                                }`}
                            aria-label="Profile"
                        >
                            <User size={18} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-surface dark:bg-black transition-colors duration-300">
                    {children}
                </main>

                {!['/bills', '/meetings', '/travel', '/health', '/notifications', '/profile'].includes(location.pathname) && <ChatInput />}
            </div>
        </div>
    )
}
