import { useRef, useEffect } from 'react'
import { ChatMessage } from '../../context/AppContext'

interface ChatMessageListProps {
    messages: ChatMessage[]
    className?: string
}

export default function ChatMessageList({ messages, className = '' }: ChatMessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className={`space-y-6 ${className}`}>
            {messages.map((msg, index) => (
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
    )
}
