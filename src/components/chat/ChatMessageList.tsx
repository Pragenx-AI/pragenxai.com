import { useRef, useEffect } from 'react'
import { ChatMessage } from '../../context/AppContext'
import WeatherWidget from './WeatherWidget'
import { Copy, Edit2 } from 'lucide-react'

interface ChatMessageListProps {
    messages: ChatMessage[]
    className?: string
}

export default function ChatMessageList({ messages, className = '' }: ChatMessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className={`space-y-12 max-w-5xl mx-auto ${className}`}>
            {messages.map((msg, index) => (
                <div
                    key={msg.id || index}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
                >
                    {/* User Message */}
                    {msg.role === 'user' && (
                        <div className="flex flex-col items-end group">
                            <div className="bg-[#f4f4f4] dark:bg-white/5 text-gray-800 dark:text-gray-100 rounded-[2rem] px-6 py-2.5 shadow-sm max-w-[85%] lg:max-w-[70%]">
                                <p className="text-[15px] leading-relaxed lowercase font-medium">{msg.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Copy">
                                    <Copy size={16} />
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Edit">
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Assistant Message */}
                    {msg.role === 'assistant' && (
                        <div className="w-full flex flex-col items-start space-y-4">
                            {msg.weatherData && (
                                <WeatherWidget data={msg.weatherData} />
                            )}
                            <div className="max-w-[90%] lg:max-w-[85%]">
                                <p className="text-[16px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}
