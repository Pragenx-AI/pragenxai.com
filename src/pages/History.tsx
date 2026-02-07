import { useApp } from '../context/AppContext'
import { MessageSquare, Trash2, ArrowRight, Search, Filter, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function History() {
    const { chatSessions, loadChatSession, deleteChatSession } = useApp()
    const navigate = useNavigate()

    const handleSessionClick = (sessionId: string) => {
        loadChatSession(sessionId)
        navigate('/chat')
    }

    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation()
        deleteChatSession(sessionId)
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-5xl mx-auto p-6 lg:p-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
                        Chat History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl font-light leading-relaxed">
                        revisiting your past conversations with the AI assistant.
                    </p>
                </div>

                <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-card p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 px-2">
                        <MessageSquare size={20} className="text-[#800020]" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Recent Conversations</span>
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

                {chatSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-gray-300 dark:text-gray-600">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No conversations yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Start a new chat to see your history here.</p>
                        <button
                            onClick={() => navigate('/chat')}
                            className="mt-6 px-6 py-3 bg-[#800020] hover:bg-[#600018] text-white rounded-xl font-medium transition-colors"
                        >
                            Start Chat
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {chatSessions.slice().reverse().map((session) => (
                            <div
                                key={session.id}
                                onClick={() => handleSessionClick(session.id)}
                                className="group relative bg-white dark:bg-dark-card rounded-[2rem] p-6 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0">
                                            <MessageSquare size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-[#800020] transition-colors">
                                                {session.title || 'Untitled Conversation'}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                                {session.messages[session.messages.length - 1]?.content || 'No messages'}
                                            </p>
                                            <div className="flex items-center gap-3 mt-3 text-xs font-medium text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(session.lastModified).toLocaleString('en-IN', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                <span>{session.messages.length} messages</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDeleteSession(e, session.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            title="Delete conversation"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="p-2 text-gray-300 dark:text-gray-600">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
