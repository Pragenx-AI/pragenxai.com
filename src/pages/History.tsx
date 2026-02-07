import { useApp } from '../context/AppContext'
import { Clock, History as HistoryIcon, Receipt, Users, Plane, Heart, Filter, Search } from 'lucide-react'

export default function History() {
    const { healthLogs } = useApp()

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'bill': return Receipt
            case 'meeting': return Users
            case 'travel': return Plane
            case 'health': return Heart
            default: return HistoryIcon
        }
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-5xl mx-auto p-6 lg:p-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
                        Activity History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl font-light leading-relaxed">
                        Track your digital footprint. A comprehensive timeline of your actions and events.
                    </p>
                </div>

                <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-card p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 px-2">
                        <Clock size={20} className="text-[#800020]" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Recent Activity</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 text-gray-400 hover:text-[#800020] hover:bg-red-50 dark:hover:bg-white/5 rounded-xl transition-all">
                            <Search size={20} />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-[#800020] hover:bg-red-50 dark:hover:bg-white/5 rounded-xl transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {healthLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-gray-300 dark:text-gray-600">
                            <HistoryIcon size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history recorded</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Your activities will appear here as you use the application.</p>
                    </div>
                ) : (
                    <div className="relative space-y-8 pl-4 lg:pl-8 before:absolute before:inset-y-0 before:left-4 lg:before:left-8 before:w-px before:bg-gray-200 dark:before:bg-white/10">
                        {healthLogs.slice().reverse().map((log) => {
                            const Icon = getActivityIcon(log.type)
                            return (
                                <div key={log.id} className="relative pl-8 lg:pl-12 group">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-0 lg:left-4 -translate-x-1/2 top-6 w-8 h-8 rounded-full border-4 border-gray-50 dark:border-dark-bg flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110 
                                        ${log.type === 'bill' ? 'bg-amber-100 text-amber-600' :
                                            log.type === 'health' ? 'bg-red-100 text-red-600' :
                                                log.type === 'meeting' ? 'bg-primary/10 text-primary' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        <div className="w-2 h-2 rounded-full bg-current"></div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="bg-white dark:bg-dark-card rounded-[2rem] p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-white/5 transition-all duration-300 group-hover:-translate-y-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg
                                                    ${log.type === 'bill' ? 'bg-amber-500 shadow-amber-500/20' :
                                                        log.type === 'health' ? 'bg-[#800020] shadow-maroon/20' :
                                                            log.type === 'meeting' ? 'bg-primary shadow-primary/20' :
                                                                'bg-gray-500'
                                                    }`}>
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-1
                                                        ${log.type === 'bill' ? 'bg-amber-50 text-amber-700' :
                                                            log.type === 'health' ? 'bg-red-50 text-red-700' :
                                                                log.type === 'meeting' ? 'bg-primary/5 text-primary' :
                                                                    'bg-gray-50 text-gray-700'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {log.action} {log.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl self-start md:self-center whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>

                                        {log.details && (
                                            <div className="pl-16">
                                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl text-sm border border-gray-100 dark:border-white/5">
                                                    {log.details}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
