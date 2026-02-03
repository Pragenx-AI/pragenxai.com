import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useState, useEffect } from 'react'
import {
    MessageSquarePlus,
    Home,
    CalendarDays,
    Receipt,
    Users,
    Plane,
    Heart,
    FileText,
    Settings,
    X,
    LogOut,
    MoreHorizontal,
    Check,
    Trash2,
    PanelLeft
} from 'lucide-react'

const navItems = [
    { icon: MessageSquarePlus, label: 'GPT', path: '/chat', action: 'newChat' },
    { icon: Home, label: 'Home', path: '/' },
    { icon: CalendarDays, label: 'Today', path: '/today' },
    { icon: Receipt, label: 'Bills & Reminders', path: '/bills' },
    { icon: Users, label: 'Meetings', path: '/meetings' },
    { icon: Plane, label: 'Travel', path: '/travel' },
    { icon: Heart, label: 'Health', path: '/health' },
    { icon: FileText, label: 'Records', path: '/records' },
    { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const { sidebarOpen, toggleSidebar, notifications, startNewChat, bills, meetings, updateBill, deleteBill, deleteMeeting, logout } = useApp()
    const unreadCount = notifications.filter(n => !n.read).length

    const handleNavClick = (item: typeof navItems[0]) => {
        if (item.action === 'newChat') {
            startNewChat()
        }
        if (window.innerWidth < 1024) {
            toggleSidebar()
        }
    }

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    const toggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setActiveMenuId(activeMenuId === id ? null : id)
    }

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation() // Prevent navigation
        action()
        setActiveMenuId(null)
    }

    return (
        <>
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-40 backdrop-blur-sm" onClick={toggleSidebar} />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-surface dark:bg-dark-card border-r border-divider dark:border-dark-border flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
                } overflow-hidden`}>
                <div className={`flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center'} py-4 border-b border-divider dark:border-dark-border h-16`}>

                    {/* Open State: Logo + Text */}
                    <div className={`flex items-center gap-2 ${!sidebarOpen && 'hidden'}`}>
                        <img src="/logo-new.png" alt="Pragenx AI Logo" className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-transparent" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">PRAGENX AI</span>
                    </div>

                    {/* Toggle Button - Visible in both states (desktop) */}
                    <button
                        onClick={toggleSidebar}
                        className={`p-1 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded transition-colors text-gray-500 dark:text-gray-400 
                        ${!sidebarOpen ? 'lg:flex hidden' : 'lg:flex hidden'} 
                        ${!sidebarOpen && 'w-full h-full items-center justify-center'}
                        `}
                    >
                        <PanelLeft size={20} className={!sidebarOpen ? 'rotate-180' : ''} />
                    </button>

                    {/* Mobile Close Button - Only visible on mobile when open */}
                    <button onClick={toggleSidebar} className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded transition-colors md:hidden block">
                        <X size={20} className="dark:text-gray-400" />
                    </button>

                    {/* Note: I removed the duplicate 'Collapsed state logo' to strictly follow 'logo should also collapse' 
                        and prioritize the toggle button for reopening. 
                    */}
                </div>

                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1 px-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isNotifications = item.label === 'Notifications'

                            return (
                                <li key={item.label}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => handleNavClick(item)}
                                        className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                      ${isActive && item.action !== 'newChat'
                                                ? 'bg-primary text-white font-medium shadow-lg shadow-primary/20'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-dark-elevated hover:text-primary dark:hover:text-primary-light'
                                            }
                    `}
                                    >
                                        <div className="relative">
                                            <Icon size={20} />
                                        </div>
                                        <span className={`flex-1 ${!sidebarOpen && 'lg:hidden'}`}>{item.label}</span>
                                        {isNotifications && unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </NavLink>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Your Reminders Section */}
                    {(bills.filter(b => b.status === 'upcoming').length > 0 || meetings.length > 0) && (
                        <div className={`mt-6 px-4 ${!sidebarOpen && 'lg:hidden'}`}>
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">Your Reminders</h3>
                            <ul className="space-y-1">
                                {bills.filter(b => b.status === 'upcoming').slice(0, 3).map(bill => (
                                    <li key={bill.id} className="group/item flex items-center justify-between pr-2 rounded-md hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors relative">
                                        <NavLink
                                            to="/bills"
                                            className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 overflow-hidden"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover/item:scale-125 transition-transform flex-shrink-0" />
                                            <span className="truncate">{bill.title}</span>
                                        </NavLink>
                                        <button
                                            onClick={(e) => toggleMenu(e, `bill-${bill.id}`)}
                                            className={`p-1 hover:bg-gray-200 dark:hover:bg-dark-border rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all ${activeMenuId === `bill-${bill.id}` ? 'opacity-100 bg-gray-200 dark:bg-dark-border' : 'opacity-0 group-hover/item:opacity-100'}`}
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeMenuId === `bill-${bill.id}` && (
                                            <div className="absolute right-0 top-8 w-32 bg-white dark:bg-dark-elevated rounded-lg shadow-lg border border-gray-100 dark:border-dark-border z-50 overflow-hidden animate-fade-in-up">
                                                <button
                                                    onClick={(e) => handleAction(e, () => updateBill(bill.id, { status: 'paid' }))}
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border hover:text-primary transition-colors flex items-center gap-2"
                                                >
                                                    <Check size={12} /> Mark Paid
                                                </button>
                                                <button
                                                    onClick={(e) => handleAction(e, () => deleteBill(bill.id))}
                                                    className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 size={12} /> Dismiss
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                                {meetings.filter(m => m.date >= new Date().toISOString().split('T')[0]).sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()).slice(0, 3).map(meeting => (
                                    <li key={meeting.id} className="group/item flex items-center justify-between pr-2 rounded-md hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors relative">
                                        <NavLink
                                            to="/meetings"
                                            className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 overflow-hidden"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/item:scale-125 transition-transform flex-shrink-0" />
                                            <span className="truncate">{meeting.title}</span>
                                        </NavLink>
                                        <button
                                            onClick={(e) => toggleMenu(e, `meeting-${meeting.id}`)}
                                            className={`p-1 hover:bg-gray-200 dark:hover:bg-dark-border rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all ${activeMenuId === `meeting-${meeting.id}` ? 'opacity-100 bg-gray-200 dark:bg-dark-border' : 'opacity-0 group-hover/item:opacity-100'}`}
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeMenuId === `meeting-${meeting.id}` && (
                                            <div className="absolute right-0 top-8 w-32 bg-white dark:bg-dark-elevated rounded-lg shadow-lg border border-gray-100 dark:border-dark-border z-50 overflow-hidden animate-fade-in-up">
                                                <button
                                                    onClick={(e) => handleAction(e, () => deleteMeeting(meeting.id))}
                                                    className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 size={12} /> Dismiss
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </nav>

                <div className={`p-4 border-t border-divider dark:border-dark-border flex flex-col gap-4 ${!sidebarOpen && 'lg:hidden'}`}>
                    <p className="text-xs text-gray-400 dark:text-gray-500 pl-1">PRAGENX AI v1.0</p>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full text-left"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
