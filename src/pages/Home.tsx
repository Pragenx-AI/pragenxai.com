import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import VoiceAssistant from '../components/voice/VoiceAssistant'
import TodaysReminders from '../components/dashboard/TodaysReminders'
import ProactiveQuickActions from '../components/dashboard/ProactiveQuickActions'
import {
    Receipt,
    Calendar,
    Heart,
    Bell,
    X,
    Activity,
    Mic
} from 'lucide-react'

export default function Home() {
    const { bills, meetings, notifications, markNotificationRead, waterIntake, theme } = useApp()
    const navigate = useNavigate()

    const unreadNotifications = notifications.filter(n => !n.read)

    // Get today's items
    const today = new Date().toISOString().split('T')[0]
    const todayMeetings = meetings.filter(m => m.date === today)
    const upcomingBills = bills.filter(b => b.status === 'upcoming').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    const nextBill = upcomingBills[0]



    return (
        <div className="h-full overflow-y-auto relative transition-colors duration-300">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
                {theme === 'dark' ? (
                    <>
                        <div className="absolute -top-[20%] left-[20%] w-[60%] h-[60%] bg-primary-900/20 rounded-full blur-[120px]" />
                        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-900/15 rounded-full blur-[100px]" />
                        <div className="absolute top-[30%] left-[5%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[80px]" />
                    </>
                ) : (
                    <>
                        <div className="absolute -top-[20%] left-[20%] w-[60%] h-[60%] bg-primary-100/30 rounded-full blur-[100px]" />
                        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />
                    </>
                )}
            </div>

            <div className="max-w-6xl mx-auto p-6 lg:p-8 relative z-10 space-y-12">

                {/* Alerts (Toast-like banners) */}
                {unreadNotifications.length > 0 && (
                    <div className="grid gap-4">
                        {unreadNotifications.map(notification => (
                            <div key={notification.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border border-red-100 dark:border-red-900/30 shadow-sm animate-fade-in mx-auto w-full max-w-2xl transition-colors duration-300">
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500 dark:text-red-400 shrink-0">
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{notification.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                                </div>
                                <button
                                    onClick={() => markNotificationRead(notification.id)}
                                    className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-full transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center text-center space-y-8 pt-6">
                    <div className="space-y-3 animate-fade-in-up">
                        <h1 className="text-4xl lg:text-6xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
                            Ready to organize your day?
                        </p>
                    </div>

                    {/* Central Voice Hub */}
                    <div className="relative group p-4">
                        <VoiceAssistant variant="default" />
                    </div>


                </section>

                {/* Today's Highlighed Reminders */}
                <TodaysReminders />

                {/* Proactive Quick Actions */}
                <ProactiveQuickActions />

                {/* Widgets Grid - The "Content Area" */}
                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Overview</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* 1. Bill Widget (Soft Amber) */}
                        <div
                            onClick={() => navigate('/bills')}
                            className="bg-amber-50/60 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-[2rem] p-6 border border-amber-100/50 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white dark:bg-dark-elevated rounded-2xl shadow-sm text-amber-500 group-hover:scale-110 transition-transform">
                                    <Receipt size={24} />
                                </div>
                                {nextBill ? (
                                    <span className="px-3 py-1 bg-white/60 dark:bg-dark-elevated/60 backdrop-blur-sm rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
                                        Due {new Date(nextBill.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-amber-500/20 rounded-full text-[10px] font-bold text-amber-600 uppercase tracking-widest">Setup</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-amber-800/60 dark:text-amber-400/60 uppercase tracking-wide">Upcoming Bills</p>
                                {nextBill ? (
                                    <>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">₹{nextBill.amount.toLocaleString()}</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{nextBill.title}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">No Bills Yet</div>
                                        <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">Tap to add your first bill</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 2. Meeting Widget (Soft Blue) */}
                        <div
                            onClick={() => navigate('/meetings')}
                            className="bg-blue-50/60 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-[2rem] p-6 border border-blue-100/50 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white dark:bg-dark-elevated rounded-2xl shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                                    <Calendar size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${todayMeetings.length > 0 ? 'bg-white/60 text-blue-700' : 'bg-blue-500/20 text-blue-600'}`}>
                                    {todayMeetings.length > 0 ? 'Today' : 'Setup'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-800/60 dark:text-blue-400/60 uppercase tracking-wide">Next Meeting</p>
                                {todayMeetings.length > 0 ? (
                                    <>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{todayMeetings[0].time}</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{todayMeetings[0].title}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Free Schedule</div>
                                        <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1 font-medium">Connect your calendar</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 3. Wellness Widget (Soft Emerald) */}
                        <div
                            onClick={() => navigate('/health')}
                            className="bg-emerald-50/60 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-[2rem] p-6 border border-emerald-100/50 dark:border-emerald-800/30 hover:border-emerald-200 dark:hover:border-emerald-700/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white dark:bg-dark-elevated rounded-2xl shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Activity size={24} />
                                </div>
                                <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                    {waterIntake > 0 ? 'Daily' : 'Setup'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-800/60 dark:text-emerald-400/60 uppercase tracking-wide">Water Intake</p>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{waterIntake}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">glasses</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-2 bg-emerald-200/50 dark:bg-emerald-900/30 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min((waterIntake / 8) * 100, 100)}%` }}></div>
                                </div>
                                {waterIntake === 0 && <p className="text-xs text-emerald-600/80 font-medium mt-2">Start your wellness habit</p>}
                            </div>
                        </div>

                        {/* 4. Quick Actions Widget (White) */}
                        <div className="bg-white dark:bg-dark-card rounded-[2rem] p-6 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Quick Add</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => navigate('/bills')}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 dark:bg-dark-elevated hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary dark:hover:text-primary-light transition-colors text-gray-600 dark:text-gray-400 group"
                                >
                                    <Receipt size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">Bill</span>
                                </button>
                                <button
                                    onClick={() => navigate('/meetings')}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 dark:bg-dark-elevated hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-400 group"
                                >
                                    <Calendar size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">Meeting</span>
                                </button>
                                <button
                                    onClick={() => navigate('/health')}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 dark:bg-dark-elevated hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-gray-600 dark:text-gray-400 group"
                                >
                                    <Heart size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">Health</span>
                                </button>
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 dark:bg-dark-elevated hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-gray-600 dark:text-gray-400 group"
                                >
                                    <Mic size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">Ask AI</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                <div className="h-10"></div>
            </div>
        </div>
    )
}

