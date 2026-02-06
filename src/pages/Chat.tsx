import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import ChatInput from '../components/layout/ChatInput'

export default function Chat() {
    const { chatMessages } = useApp()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-white dark:bg-black transition-colors duration-300 overflow-hidden relative">
            {chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
                    <div className="w-full max-w-2xl flex flex-col items-center gap-12">
                        <h2 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                            Experience the Power of <span className="text-[#800020]">PragenX</span>
                        </h2>

                        <div className="w-full max-w-xl">
                            <ChatInput />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={msg.id || index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`flex gap-3 max-w-[85%] lg:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${msg.role === 'user'
                                        ? 'bg-[#800020] text-white'
                                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {msg.role === 'user' ? 'U' : 'PX'}
                                    </div>
                                    <div className={`rounded-2xl px-5 py-4 ${msg.role === 'user'
                                        ? 'bg-[#800020] text-white rounded-tr-none shadow-lg shadow-[#800020]/20'
                                        : 'bg-white dark:bg-dark-elevated text-gray-800 dark:text-gray-200 rounded-tl-none border border-divider dark:border-dark-border shadow-sm'
                                        }`}>
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Bottom Search Bar when active */}
                    <div className="border-t border-divider dark:border-dark-border bg-white dark:bg-dark-card animate-in slide-in-from-bottom duration-300">
                        <ChatInput />
                    </div>
                </>
            )}
        </div>
    )
}
