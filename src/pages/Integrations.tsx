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
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Meeting Integrations</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Connect your favorite tools to schedule and manage meetings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {integrations.map(integration => {
                        const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                        const isConnecting = connectingId === integration.id

                        return (
                            <div key={integration.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[2rem] p-6 transition-all hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-none">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark-elevated text-gray-600 dark:text-gray-400 flex items-center justify-center">
                                        <Icon size={24} />
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${integration.status === 'Connected' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                        {integration.status}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">{integration.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">{integration.description}</p>
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
                                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${integration.status === 'Connected'
                                        ? 'bg-gray-100 dark:bg-dark-elevated text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        : 'bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        integration.status === 'Connected' ? 'Manage Settings' : 'Connect Service'
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Settings Modal */}
            {isModalOpen && selectedIntegration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-elevated flex items-center justify-center text-gray-900 dark:text-gray-100">
                                    {(() => {
                                        const Icon = iconMap[selectedIntegration.iconType as keyof typeof iconMap]
                                        return <Icon size={20} />
                                    })()}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">{selectedIntegration.name} Settings</h2>
                                    <p className="text-xs text-green-500 font-medium">Active Connection</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-xl transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Auto Sync */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Auto-sync Data</p>
                                        <p className="text-xs text-gray-500">Keep meetings up to date</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-elevated peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Status Alerts</p>
                                        <p className="text-xs text-gray-500">Get notified of issues</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-elevated peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            {/* Advanced Link */}
                            <div className="p-4 bg-gray-50 dark:bg-dark-elevated rounded-2xl border border-gray-100 dark:border-dark-border">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mb-1">
                                    <Settings2 size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Developer Options</span>
                                </div>
                                <p className="text-xs text-gray-500">Configure OAuth scopes and webhooks for real-time syncing.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-dark-elevated/50 flex flex-col gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[1.25rem] text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-dark-elevated transition-all"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => handleDisconnect(selectedIntegration)}
                                className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-all"
                            >
                                <LogOut size={16} />
                                Disconnect Service
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
