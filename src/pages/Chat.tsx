import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import VoiceAssistant from '../components/voice/VoiceAssistant'

export default function Chat() {
    const { chatMessages } = useApp()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    return (
        <div className="h-full flex flex-col">
            {/* Voice Assistant Header - large and prominent */}
            <div className="p-4 lg:p-6 bg-surface dark:bg-black transition-colors duration-300">
                <VoiceAssistant variant="large" />
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <p>Start a conversation...</p>
                    </div>
                ) : (
                    chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] lg:max-w-[60%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                ? 'bg-primary text-white rounded-br-md shadow-md shadow-primary/20'
                                : 'bg-white dark:bg-dark-elevated text-gray-800 dark:text-gray-200 rounded-bl-md border border-divider dark:border-dark-border shadow-sm'
                                }`}>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}
