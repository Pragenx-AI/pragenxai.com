import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Calendar, Receipt, ArrowRight, Clock, Sparkles, Plus, Plane, Heart, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type ReminderItem =
    | { type: 'meeting'; date: string; time: string; title: string; id: string | number }
    | { type: 'bill'; date: string; time: null; title: string; id: string | number; amount: number }

export default function TodaysReminders() {
    const { bills, meetings } = useApp()
    const navigate = useNavigate()
    const [showAddMenu, setShowAddMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowAddMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const today = new Date().toISOString().split('T')[0]

    const todayMeetings = meetings.filter(m => m.date === today)
    const upcomingBills = bills.filter(b => b.status === 'upcoming')

    const reminders: ReminderItem[] = [
        ...todayMeetings.map(m => ({ type: 'meeting' as const, date: m.date, time: m.time, title: m.title, id: m.id })),
        ...upcomingBills.map(b => ({ type: 'bill' as const, date: b.dueDate, time: null, title: b.title, id: b.id, amount: b.amount }))
    ].sort((a, b) => {
        const dateA = new Date(a.date + (a.time ? 'T' + a.time : ''))
        const dateB = new Date(b.date + (b.time ? 'T' + b.time : ''))
        return dateA.getTime() - dateB.getTime()
    }).slice(0, 4)

    const addActions = [
        { label: 'Bills', icon: Receipt, path: '/bills', color: 'text-amber-500' },
        { label: 'Meetings', icon: Calendar, path: '/meetings', color: 'text-blue-500' },
        { label: 'Travel', icon: Plane, path: '/travel', color: 'text-purple-500' },
        { label: 'Health', icon: Heart, path: '/health', color: 'text-rose-500' },
    ]

    if (reminders.length === 0) {
        return (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 dark:from-primary/10 dark:to-primary-light/10 border border-primary/10 dark:border-primary-light/10 rounded-[2.5rem] p-8 lg:p-10 text-center relative overflow-hidden group">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-10 flex flex-col items-center max-w-md mx-auto space-y-6">
                        <div className="p-4 bg-white dark:bg-dark-card rounded-3xl shadow-xl shadow-primary/10 scale-110 mb-2">
                            <Sparkles className="text-primary" size={32} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 italic tracking-tight">Your agenda is clear!</h2>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Ready to take control? Tap the microphone or use the actions below to set up your first reminder.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={() => navigate('/chat')}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                            >
                                Ask Pragenx
                            </button>

                            {/* Add Reminder Dropdown */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowAddMenu(!showAddMenu)}
                                    className="px-6 py-3 bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 font-bold border border-gray-100 dark:border-dark-border rounded-2xl hover:bg-gray-50 dark:hover:bg-dark-elevated shadow-sm transition-all flex items-center gap-2"
                                >
                                    Add Reminder <ChevronDown size={18} className={`transition-transform duration-300 ${showAddMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showAddMenu && (
                                    <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="py-1">
                                            {addActions.map((action) => (
                                                <button
                                                    key={action.label}
                                                    onClick={() => {
                                                        navigate(action.path)
                                                        setShowAddMenu(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-elevated hover:text-primary transition-colors text-left"
                                                >
                                                    <action.icon size={18} className={action.color} />
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Today's Reminders</h2>
                <button
                    onClick={() => navigate('/today')}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium flex items-center gap-1 transition-colors"
                >
                    View All <ArrowRight size={14} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reminders.map((item) => (
                    <div
                        key={`${item.type}-${item.id}`}
                        onClick={() => navigate(item.type === 'meeting' ? '/meetings' : '/bills')}
                        className="group relative bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg dark:hover:shadow-dark-bg/50 hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-0.5"
                    >
                        {/* Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-primary/80 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-50 dark:bg-dark-elevated text-gray-500 dark:text-gray-400 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                                {item.type === 'meeting' ? <Calendar size={18} /> : <Receipt size={18} />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary dark:group-hover:text-primary-light transition-colors">{item.title}</h3>
                                <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                                    <Clock size={12} />
                                    <span>{item.type === 'meeting' ? item.time : item.date}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                {item.type === 'bill' && (
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">₹{item.amount.toLocaleString()}</span>
                                )}
                                {item.date === today && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 rounded-md">
                                        Due Today
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

