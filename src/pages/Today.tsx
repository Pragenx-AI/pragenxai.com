import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Calendar, Clock, Check, X, ArrowRight, Users, Receipt, Heart, Grip } from 'lucide-react'

export default function Today() {
    const { bills, meetings, trips, healthReminders, showToast, updateBill, logHealth } = useApp()
    const today = new Date().toISOString().split('T')[0]
    const [currentTime, setCurrentTime] = useState(new Date())

    // State for modal and locally completed items
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleMarkDone = (item: any) => {
        if (item.type === 'bill') {
            updateBill(item.id, { status: 'paid' })
            showToast('PAYMENT AUTHORIZED', 'success')
        } else if (item.type === 'health') {
            logHealth(item.id)
            showToast('HEALTH LOGGED', 'success')
        } else {
            showToast('TASK COMPLETED', 'success')
        }
        setCompletedIds(prev => new Set(prev).add(item.id))
    }

    const isCompleted = (item: any) => {
        if (completedIds.has(item.id)) return true
        if (item.type === 'health' && item.lastLogged) {
            const loggedDate = new Date(item.lastLogged).toISOString().split('T')[0]
            if (loggedDate === today) return true
        }
        return false
    }
    const timelineItems = [
        ...meetings.filter(m => m.date === today).map(m => ({
            type: 'meeting' as const,
            time: m.time,
            title: m.title,
            subtitle: `${m.duration} MIN // SYNC`,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-500/20',
            id: m.id,
            details: {
                purpose: 'TEAM SYNCHRONIZATION',
                advantages: 'ALIGNMENT & PLANNING',
                location: 'CONFERENCE ROOM A'
            }
        })),
        ...bills.filter(b => b.status === 'upcoming' && b.dueDate === today).map(b => ({
            type: 'bill' as const,
            time: '09:00',
            title: b.title,
            subtitle: `£${b.amount.toLocaleString()} // DUE`,
            icon: Receipt,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-200 dark:border-amber-500/20',
            id: b.id,
            details: {
                purpose: 'FINANCIAL TRANSACTION',
                advantages: 'CREDIT HEALTH',
                location: 'BANKING PORTAL'
            }
        })),
        ...trips.filter(t => t.startDate === today).map(t => ({
            type: 'trip' as const,
            time: '06:00',
            title: `Trip to ${t.destination}`,
            subtitle: `${t.startDate} - ${t.endDate}`,
            icon: Calendar,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-200 dark:border-emerald-500/20',
            id: t.id,
            details: {
                purpose: 'BUSINESS TRAVEL',
                advantages: 'EXPANSION',
                location: t.destination.toUpperCase()
            }
        })),
        ...healthReminders.filter(h => h.enabled).map(h => ({
            type: 'health' as const,
            time: h.type === 'water' ? 'ALL DAY' : '07:00',
            title: h.title,
            lastLogged: h.lastLogged,
            subtitle: h.type === 'water' ? '2000ML GOAL' : 'DAILY PROTOCOL',
            icon: Heart,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            border: 'border-rose-200 dark:border-rose-500/20',
            id: h.id,
            details: {
                purpose: 'BIOMETRIC MAINTENANCE',
                advantages: 'OPTIMAL PERFORMANCE',
                location: 'HEALTH SECTOR'
            }
        }))
    ].sort((a, b) => a.time.localeCompare(b.time))

    return (
        <div className="h-full bg-gray-50 dark:bg-black transition-colors duration-500 overflow-hidden relative selection:bg-[#800020] selection:text-white">
            {/* Ambient Background - Subtle in light, Glowing in dark */}
            <div className="absolute inset-0 pointer-events-none">



            </div>

            <div className="h-full overflow-y-auto relative z-10 custom-scrollbar">
                <div className="max-w-5xl mx-auto p-6 md:p-10">

                    {/* Header Section */}
                    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#800020] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#800020]"></span>
                                </span>
                                <span className="text-xs font-bold tracking-widest text-[#800020] uppercase">System Ready</span>
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Today
                            </h1>
                            <div className="flex items-center gap-3 mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <span className="uppercase tracking-wide">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                <span className="text-gray-300 dark:text-gray-700">|</span>
                                <span className="font-semibold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {/* Status Cards */}
                        <div className="flex gap-4">
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl shadow-sm backdrop-blur-sm">
                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Active</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{timelineItems.length}</div>
                            </div>
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl shadow-sm backdrop-blur-sm">
                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Done</div>
                                <div className="text-2xl font-bold text-[#800020]">
                                    {Math.round((completedIds.size / Math.max(timelineItems.length, 1)) * 100)}%
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Timeline Container */}
                    <div className="relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-4 top-4 bottom-10 w-px bg-gray-200 dark:bg-white/10" />

                        <div className="space-y-6">
                            {timelineItems.length === 0 ? (
                                <div className="p-12 text-center bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                                    <Clock className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Clear</h3>
                                    <p className="text-gray-500">No tasks scheduled for today.</p>
                                </div>
                            ) : (
                                timelineItems.map((item, index) => {
                                    const Icon = item.icon
                                    const completed = isCompleted(item)

                                    return (
                                        <div
                                            key={item.id}
                                            className={`relative pl-12 transition-all duration-700 delay-[${index * 100}ms] animate-in fade-in slide-in-from-bottom-4`}
                                        >
                                            {/* Timeline Node */}
                                            <div className={`absolute left-[11px] top-6 w-[11px] h-[11px] rounded-full border-[3px] z-10 transition-colors duration-300 ${completed
                                                ? 'bg-[#800020] border-gray-50 dark:border-black'
                                                : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600'
                                                }`} />

                                            {/* Card */}
                                            <div
                                                onClick={() => setSelectedItem(item)}
                                                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
                                                    ${completed
                                                        ? 'bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-white/5 opacity-60 grayscale'
                                                        : 'bg-white dark:bg-white/[0.04] border-gray-200 dark:border-white/10 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1'
                                                    }`}
                                            >
                                                {/* Left Color Accent Bar */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${completed ? 'bg-gray-300 dark:bg-white/10' : item.color.replace('text-', 'bg-')}`} />

                                                <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">

                                                    {/* Time & Title */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-xs font-bold py-1 px-2 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                                                {item.time}
                                                            </span>
                                                            {completed && (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                                    <Check size={12} /> Completed
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 ${!completed && 'group-hover:text-[#800020] transition-colors'}`}>
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-500 tracking-wider uppercase">
                                                            {item.subtitle}
                                                        </p>
                                                    </div>

                                                    {/* Right Side Actions/Icon */}
                                                    <div className="flex items-center justify-between md:justify-end gap-4">
                                                        <div className={`p-3 rounded-xl ${item.bg} ${item.color} ${item.border} border`}>
                                                            <Icon size={24} strokeWidth={1.5} />
                                                        </div>

                                                        {!completed && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleMarkDone(item); }}
                                                                className="hidden opacity-0 group-hover:block group-hover:opacity-100 transition-all duration-300 px-4 py-2 bg-[#800020] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#600018] flex items-center gap-2"
                                                            >
                                                                Complete <ArrowRight size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Modal - Premium Design */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] bg-gray-900/40 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">
                        {/* Header */}
                        <div className="p-6 md:p-8 bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-1.5 rounded-md ${selectedItem.bg} ${selectedItem.color}`}>
                                        <selectedItem.icon size={16} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                        Details // {selectedItem.id}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                    {selectedItem.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Timeframe</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Clock size={16} className="text-[#800020]" />
                                        {selectedItem.time}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Grip size={16} className="text-[#800020]" />
                                        {selectedItem.details.location}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-2">Objective</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {selectedItem.details.purpose}. Critical path requires immediate attention to ensure {selectedItem.details.advantages.toLowerCase()}.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                                        <span>STATUS: {isCompleted(selectedItem) ? 'COMPLETED' : 'PENDING'}</span>
                                        <span>PRIORITY: HIGH</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        {!isCompleted(selectedItem) && (
                            <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
                                <button
                                    onClick={() => { handleMarkDone(selectedItem); setSelectedItem(null); }}
                                    className="w-full py-4 bg-[#800020] hover:bg-[#600018] text-white font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-[0.98]"
                                >
                                    Initialize Protocol
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
