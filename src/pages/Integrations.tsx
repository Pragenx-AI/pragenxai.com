import { useState } from 'react'
import { Video, Users, MessageSquare, FileText, X, Settings2, Bell, RefreshCw, LogOut, Loader2, Phone, Globe, Headphones, Monitor } from 'lucide-react'
import { useApp } from '../context/AppContext'

const iconMap = {
    Video,
    Users,
    MessageSquare,
    FileText,
    Phone,
    Globe,
    Headphones,
    Monitor
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
        <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-7xl mx-auto p-6 lg:p-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight uppercase text-[#5a1a1a] dark:text-gray-100 mb-4">
                        Meeting Integrations
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Connect your ecosystem. Seamlessly sync with your favorite communication platforms.
                    </p>
                </div>

                {/* Connected Services Section */}
                {integrations.filter(i => i.status === 'Connected').length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                                Connected Services
                            </h2>
                            <span className="text-xs text-gray-400">
                                ({integrations.filter(i => i.status === 'Connected').length})
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {integrations
                                .filter(integration => integration.status === 'Connected')
                                .map(integration => {
                                    const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                                    return (
                                        <div
                                            key={integration.id}
                                            className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-green-500/20 dark:border-green-500/30 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/5 rounded-bl-[2rem] -mr-6 -mt-6 z-0 pointer-events-none" />

                                            <div className="flex items-center gap-3 mb-3 relative z-10">
                                                <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                                                    <Icon size={18} strokeWidth={2} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{integration.name}</h3>
                                                </div>
                                                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                                            </div>

                                            <button
                                                onClick={() => openSettings(integration)}
                                                className="w-full py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all mt-auto relative z-10"
                                            >
                                                SETTINGS
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                )}

                {/* Available to Connect Section */}
                {integrations.filter(i => i.status !== 'Connected').length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                Available to Connect
                            </h2>
                            <span className="text-xs text-gray-400">
                                ({integrations.filter(i => i.status !== 'Connected').length})
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {integrations
                                .filter(integration => integration.status !== 'Connected')
                                .map(integration => {
                                    const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                                    const isConnecting = connectingId === integration.id

                                    return (
                                        <div
                                            key={integration.id}
                                            className="bg-gray-50 dark:bg-dark-card/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100 dark:border-white/5 opacity-90 hover:opacity-100"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <Icon size={18} strokeWidth={1.5} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-400 truncate">{integration.name}</h3>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{integration.description}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => !isConnecting && handleConnect(integration)}
                                                disabled={isConnecting}
                                                className="w-full py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-[#800020] text-white hover:bg-[#600018] shadow-sm shadow-[#800020]/20 transition-all mt-auto flex items-center justify-center gap-2"
                                            >
                                                {isConnecting ? (
                                                    <>
                                                        <Loader2 size={10} className="animate-spin" />
                                                        CONNECTING...
                                                    </>
                                                ) : (
                                                    'CONNECT'
                                                )}
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Modal */}
            {isModalOpen && selectedIntegration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#800020]">
                                    {(() => {
                                        const Icon = iconMap[selectedIntegration.iconType as keyof typeof iconMap]
                                        return <Icon size={24} />
                                    })()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedIntegration.name}</h2>
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
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Auto-sync Data</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Keep meetings up to date</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800020]"></div>
                                </label>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between group">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Status Alerts</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Get notified of issues</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800020]"></div>
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

                        <div className="p-8 bg-gray-50 dark:bg-white/5 flex flex-col gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-sm"
                            >
                                SAVE CHANGES
                            </button>
                            <button
                                onClick={() => handleDisconnect(selectedIntegration)}
                                className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                            >
                                <LogOut size={14} />
                                DISCONNECT SERVICE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
