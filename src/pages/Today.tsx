import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Receipt, Calendar, Users, Heart, CheckCircle, Clock, Check, X } from 'lucide-react'

export default function Today() {
    const { bills, meetings, trips, healthReminders, showToast, updateBill, logHealth } = useApp()
    const today = new Date().toISOString().split('T')[0]

    // State for modal and locally completed items
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

    const handleMarkDone = (item: any) => {
        if (item.type === 'bill') {
            updateBill(item.id, { status: 'paid' })
            showToast('Bill marked as paid! Payment recorded.', 'success')
        } else if (item.type === 'health') {
            logHealth(item.id)
            showToast('Great job! Healthy habit tracked.', 'success')
        } else {
            showToast('Task marked as completed!', 'success')
        }
        // Add to local completed state to update UI immediately
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
            subtitle: `${new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • ${m.time} - ${new Date(new Date(`2000-01-01T${m.time}`).getTime() + m.duration * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} • ${m.duration} min`,
            icon: Users,
            color: 'bg-primary/10 text-primary',
            id: m.id,
            details: {
                purpose: 'Sync with the team on project progress.',
                advantages: 'Clear blockers, align on goals, and improve team cohesion.',
                location: 'Conference Room A'
            }
        })),
        ...bills.filter(b => b.status === 'upcoming' && b.dueDate === today).map(b => ({
            type: 'bill' as const,
            time: '09:00',
            title: b.title,
            subtitle: `${new Date(b.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • Due by 5:00 PM • £${b.amount.toLocaleString()}`,
            icon: Receipt,
            color: 'bg-amber-50 text-amber-600',
            id: b.id,
            details: {
                purpose: 'Payment for essential utilities/services.',
                advantages: 'Avoid late fees, maintain service continuity, and improve credit score.',
                location: 'Online Portal'
            }
        })),
        ...trips.filter(t => t.startDate === today).map(t => ({
            type: 'trip' as const,
            time: '06:00',
            title: `Trip to ${t.destination}`,
            subtitle: `${new Date(t.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${new Date(t.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • Travel`,
            icon: Calendar,
            color: 'bg-green-50 text-green-600',
            id: t.id,
            details: {
                purpose: 'Traveling for business/leisure.',
                advantages: 'Exposure to new environments, networking, or relaxation.',
                location: t.destination
            }
        })),
        ...healthReminders.filter(h => h.enabled).map(h => ({
            type: 'health' as const,
            time: h.type === 'water' ? 'All Day' : '07:00',
            title: h.title,
            lastLogged: h.lastLogged,
            subtitle: h.type === 'water'
                ? 'All Day • Hydration Goal: 2000ml'
                : `${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • 07:00 AM - 07:45 AM • Morning Routine`,
            icon: Heart,
            color: 'bg-pink-50 text-pink-600',
            id: h.id,
            details: {
                purpose: h.type === 'water' ? 'Maintain optimal hydration levels.' : 'Physical exercise and mental preparation.',
                advantages: h.type === 'water' ? 'Improves skin health, kidney function, and energy.' : 'Boosts metabolism, improves mood, and strengthens muscles.',
                location: h.type === 'water' ? 'Everywhere' : 'Local Park / Gym'
            }
        }))
    ].sort((a, b) => a.time.localeCompare(b.time))

    return (
        <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-dark-bg relative transition-colors duration-300">
            {/* Ambient Lighting Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-100/30 dark:bg-primary-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-normal" />

            <div className="max-w-4xl mx-auto p-6 lg:p-8 relative z-10">
                <header className="mb-8 animate-fade-in-up">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Today</h1>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className="text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">{timelineItems.length} Tasks</span>
                    </p>
                </header>

                {timelineItems.length === 0 ? (
                    <div className="glass-card rounded-[2rem] p-12 text-center border border-white/60 dark:border-dark-border shadow-xl shadow-gray-100/50 dark:shadow-none dark:bg-dark-card transition-colors duration-300">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} className="text-green-500 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">All caught up</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Enjoy your free time!</p>
                    </div>
                ) : (
                    <div className="relative pl-8 lg:pl-10 border-l border-gray-200/60 dark:border-dark-border transition-all">
                        <div className="space-y-4">
                            {timelineItems.map((item, index) => {
                                const Icon = item.icon
                                const completed = isCompleted(item)
                                return (
                                    <div key={`${item.type}-${item.id}`} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                        {/* Timeline Node */}
                                        <div className={`absolute -left-[45px] lg:-left-[53px] top-8 w-6 h-6 rounded-full border-[3px] shadow-sm z-10 transition-all duration-300 ${completed ? 'bg-green-500 border-green-500' : 'bg-white dark:bg-dark-card border-primary-100 dark:border-primary-800 group-hover:border-primary-400 group-hover:scale-125'}`} >
                                            {completed && <Check size={14} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                        </div>

                                        {/* Card - Now Clickable */}
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className={`w-full text-left group/card relative backdrop-blur-xl rounded-2xl p-5 border shadow-sm transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 ${completed ? 'bg-gray-50/80 dark:bg-dark-elevated/80 border-gray-100 dark:border-dark-border grayscale-[0.5]' : 'bg-white/80 dark:bg-dark-card/90 border-white/60 dark:border-dark-border hover:shadow-md'}`}
                                        >

                                            {/* Hover Gradient Overlay */}
                                            {!completed && <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-primary-50/30 dark:to-primary-900/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />}

                                            {/* Time Tag */}
                                            <div className="absolute top-5 right-5 px-2.5 py-0.5 bg-white dark:bg-dark-elevated rounded-full text-[10px] font-semibold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-dark-border shadow-sm">
                                                {item.time}
                                            </div>

                                            <div className="flex items-start gap-4 relative z-10">
                                                <div className={`p-3 rounded-xl ${item.color} dark:bg-opacity-30 shadow-sm group-hover/card:scale-105 transition-transform duration-300`}>
                                                    <Icon size={20} strokeWidth={2} />
                                                </div>

                                                <div className="flex-1 py-0.5">
                                                    <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${completed && 'line-through text-gray-500 dark:text-gray-500'}`}>{item.title}</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-medium">{item.subtitle}</p>

                                                    {/* Quick Actions (Appear on Hover) */}
                                                    <div className={`flex items-center gap-2 mt-3 transition-all duration-300 ${completed ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0'}`}>
                                                        {!completed ? (
                                                            <div
                                                                role="button"
                                                                onClick={(e) => { e.stopPropagation(); handleMarkDone(item); }}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-semibold shadow hover:bg-gray-800 dark:hover:bg-white transition-colors hover:scale-105"
                                                            >
                                                                <Check size={12} /> Mark Done
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold">
                                                                <Check size={12} /> Completed
                                                            </div>
                                                        )}
                                                        <div className="p-1.5 rounded-lg bg-white dark:bg-dark-elevated border border-gray-100 dark:border-dark-border text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-700 transition-colors shadow-sm">
                                                            <Clock size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Detailed Modal Overlay */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/30 dark:bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div
                        className="bg-white dark:bg-dark-card rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-up transition-colors duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className={`h-32 ${selectedItem.color.replace('text-', 'bg-').replace('50', '100')} dark:opacity-80 relative transition-colors`}>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 p-2 bg-white/50 dark:bg-dark-card/50 hover:bg-white dark:hover:bg-dark-card rounded-full transition-colors backdrop-blur-sm shadow-sm"
                            >
                                <X size={20} className="text-gray-600 dark:text-gray-300" />
                            </button>

                            {/* Floating Icon */}
                            <div className="absolute -bottom-8 left-8 p-4 rounded-2xl bg-white dark:bg-dark-card shadow-lg transition-colors duration-300">
                                <selectedItem.icon size={32} className={selectedItem.color.split(' ')[1]} />
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="pt-12 pb-8 px-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedItem.title}</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">{selectedItem.subtitle.split('•')[0]}</p>
                            </div>

                            <div className="mt-8 space-y-6">
                                {/* Purpose Section */}
                                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Purpose</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-dark-elevated p-4 rounded-2xl border border-gray-100 dark:border-dark-border transition-colors duration-300">
                                        {selectedItem.details.purpose}
                                    </p>
                                </div>

                                {/* Advantages Section */}
                                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Advantages</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-primary-50/50 dark:bg-primary-900/20 p-4 rounded-2xl border border-primary-100/50 dark:border-primary-800/50 transition-colors duration-300">
                                        {selectedItem.details.advantages}
                                    </p>
                                </div>

                                {/* Metadata Grid */}
                                <div className="flex gap-4 pt-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                    <div className="flex-1 p-3 bg-gray-50 dark:bg-dark-elevated rounded-2xl border border-gray-100 dark:border-dark-border text-center transition-colors duration-300">
                                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase disabled:tracking-wider mb-1">Time</div>
                                        <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{selectedItem.time}</div>
                                    </div>
                                    <div className="flex-1 p-3 bg-gray-50 dark:bg-dark-elevated rounded-2xl border border-gray-100 dark:border-dark-border text-center transition-colors duration-300">
                                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-1">Location</div>
                                        <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{selectedItem.details.location}</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="mt-8 w-full py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 dark:hover:bg-white hover:scale-[1.02] transition-all active:scale-95"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom spacer */}
            <div className="h-20" />
        </div>
    )
}
