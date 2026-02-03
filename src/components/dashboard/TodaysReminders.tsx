import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Calendar, Receipt, ArrowRight, Clock } from 'lucide-react'

type ReminderItem =
    | { type: 'meeting'; date: string; time: string; title: string; id: string | number }
    | { type: 'bill'; date: string; time: null; title: string; id: string | number; amount: number }

export default function TodaysReminders() {
    const { bills, meetings } = useApp()
    const navigate = useNavigate()

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

    if (reminders.length === 0) return null

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

