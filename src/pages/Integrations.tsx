import { useState } from 'react'
import { Video, Users, MessageSquare, FileText, X, Settings2, Bell, RefreshCw, LogOut, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const iconMap = {
    Video,
    Users,
    MessageSquare,
    FileText
}

export default function Integrations() {
    const { integrations, updateIntegrationStatus, showToast } = useApp()
    const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [connectingId, setConnectingId] = useState<string | null>(null)

    const openSettings = (integration: any) => {
        setSelectedIntegration(integration)
        setIsModalOpen(true)
    }

    const handleConnect = async (integration: any) => {
        setConnectingId(integration.id)
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        updateIntegrationStatus(integration.id, 'Connected')
        setConnectingId(null)
        showToast(`Successfully connected ${integration.name}!`, 'success')
    }

    const handleDisconnect = (integration: any) => {
        updateIntegrationStatus(integration.id, 'Disconnected')
        setIsModalOpen(false)
        showToast(`${integration.name} disconnected successfully.`, 'info')
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-4xl mx-auto p-6 lg:p-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-[#800020] to-gray-600 dark:from-white dark:via-[#ff4d4d] dark:to-gray-400 mb-2">
                        Meeting Integrations
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Connect your ecosystem. Seamlessly sync with your favorite communication platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {integrations.map(integration => {
                        const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                        const isConnecting = connectingId === integration.id

                        return (
                            <div key={integration.id} className="glass-panel group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-maroon/10 dark:hover:shadow-maroon/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 group-hover:scale-110 group-hover:text-[#800020] dark:group-hover:text-white group-hover:shadow-[0_0_20px_rgba(128,0,32,0.2)] transition-all duration-300">
                                            <Icon size={28} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${integration.status === 'Connected'
                                                ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-white/5 dark:text-gray-500 dark:border-white/10'
                                            }`}>
                                            {integration.status}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-wide group-hover:text-[#800020] dark:group-hover:text-white transition-colors">{integration.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 line-clamp-2 leading-relaxed h-10">{integration.description}</p>

                                    <button
                                        onClick={() => {
                                            if (isConnecting) return
                                            if (integration.status === 'Connected') {
                                                openSettings(integration)
                                            } else {
                                                handleConnect(integration)
                                            }
                                        }}
                                        disabled={isConnecting}
                                        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${integration.status === 'Connected'
                                            ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 hover:tracking-widest'
                                            : 'bg-[#800020] text-white hover:bg-[#600018] shadow-lg shadow-maroon/20 hover:shadow-maroon/40 hover:scale-[1.02]'
                                            }`}
                                    >
                                        {isConnecting ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            integration.status === 'Connected' ? 'Manage Settings' : 'Connect'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Settings Modal redesign */}
            {isModalOpen && selectedIntegration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-md glass-panel bg-white/95 dark:bg-black/80 border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-[#800020] shadow-[0_0_15px_rgba(128,0,32,0.15)]">
                                    {(() => {
                                        const Icon = iconMap[selectedIntegration.iconType as keyof typeof iconMap]
                                        return <Icon size={24} />
                                    })()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">{selectedIntegration.name}</h2>
                                    <p className="text-[10px] uppercase tracking-widest text-[#800020] font-bold mt-1">Active Connection</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Auto Sync */}
                            <div className="flex items-center justify-between group">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Auto-sync Data</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Keep meetings up to date</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800020] peer-checked:shadow-[0_0_10px_rgba(128,0,32,0.4)]"></div>
                                </label>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between group">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Status Alerts</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Get notified of issues</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800020] peer-checked:shadow-[0_0_10px_rgba(128,0,32,0.4)]"></div>
                                </label>
                            </div>

                            {/* Advanced Link */}
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#800020]/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 mb-2">
                                    <Settings2 size={16} className="group-hover:rotate-90 transition-transform" />
                                    <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[#800020] transition-colors">Developer Options</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Configure OAuth scopes and webhooks for real-time syncing.</p>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50/50 dark:bg-white/5 flex flex-col gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-sm"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => handleDisconnect(selectedIntegration)}
                                className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                            >
                                <LogOut size={14} />
                                Disconnect Service
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
