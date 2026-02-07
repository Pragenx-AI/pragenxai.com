import { useApp } from '../context/AppContext'
import { Bell, Receipt, Users, Plane, Heart, Info, Check, Trash2, X } from 'lucide-react'

export default function Notifications() {
    const { notifications, markNotificationRead, clearNotification, clearAllNotifications } = useApp()

    const today = new Date().toISOString().split('T')[0]
    const todayNotifications = notifications.filter(n => n.createdAt.split('T')[0] === today)
    const earlierNotifications = notifications.filter(n => n.createdAt.split('T')[0] !== today)

    const getIcon = (type: string) => {
        switch (type) {
            case 'bill': return Receipt
            case 'meeting': return Users
            case 'travel': return Plane
            case 'health': return Heart
            default: return Info
        }
    }

    const getColor = (type: string) => {
        switch (type) {
            case 'bill': return 'bg-amber-100 text-amber-600'
            case 'meeting': return 'bg-primary/10 text-primary'
            case 'travel': return 'bg-green-100 text-green-600'
            case 'health': return 'bg-pink-100 text-pink-600'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Notifications</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{notifications.filter(n => !n.read).length} unread</p>
                    </div>
                    {notifications.length > 0 && (
                        <button onClick={clearAllNotifications} className="btn btn-ghost text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                            <Trash2 size={18} className="mr-2" />
                            Clear All
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="card text-center py-12 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                        <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">All caught up!</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">No notifications at the moment</p>
                    </div>
                ) : (
                    <>
                        {todayNotifications.length > 0 && (
                            <section className="mb-8">
                                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Today</h2>
                                <div className="space-y-3">
                                    {todayNotifications.map(notification => {
                                        const Icon = getIcon(notification.type)
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`card flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm transition-colors ${!notification.read && 'border-l-4 border-l-primary'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(notification.type)}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{notification.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                        {new Date(notification.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markNotificationRead(notification.id)}
                                                            className="btn btn-ghost p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => clearNotification(notification.id)}
                                                        className="btn btn-ghost p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                                        title="Dismiss"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        )}

                        {earlierNotifications.length > 0 && (
                            <section>
                                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Earlier</h2>
                                <div className="space-y-3">
                                    {earlierNotifications.map(notification => {
                                        const Icon = getIcon(notification.type)
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`card flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm transition-colors ${notification.read && 'opacity-60'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(notification.type)}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{notification.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                        {new Date(notification.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => clearNotification(notification.id)}
                                                    className="btn btn-ghost p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
