import { useState, useRef, useEffect, ChangeEvent } from 'react'

import { useApp } from '../../context/AppContext'
import {
    Send,
    Sparkles,
    Mic,
    Plus,
    Image as ImageIcon,
    Paperclip,
    Search,
    ShoppingBag,
    Bot,
    MoreHorizontal,
    RefreshCcw
} from 'lucide-react'

const suggestedPrompts = [
    "What's due today?",
    "Any bills coming up?",
    "Prepare my day",
    "Upcoming meetings?",
]

// Web Speech API types (unchanged)
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
}

interface SpeechRecognitionResultList {
    length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
    isFinal: boolean
    length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    abort(): void
    onresult: (event: SpeechRecognitionEvent) => void
    onerror: (event: Event) => void
    onend: () => void
    onstart: () => void
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition
        webkitSpeechRecognition: new () => SpeechRecognition
    }
}

export default function ChatInput() {
    const {
        addChatMessage,
        chatMessages,
        startNewChat,
        showToast,
        pendingQuestion,
        setPendingQuestion
    } = useApp()
    const [message, setMessage] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [isSupported, setIsSupported] = useState(true)
    const [showAttachMenu, setShowAttachMenu] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Initialize speech recognition (unchanged logic)
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setIsSupported(false)
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            setIsListening(true)
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = ''
            let interimTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscript += result[0].transcript
                } else {
                    interimTranscript += result[0].transcript
                }
            }

            setMessage(finalTranscript || interimTranscript)
        }

        recognition.onerror = () => {
            setIsListening(false)
            showToast('Voice input error. Please try again.', 'error')
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current = recognition

        return () => {
            recognition.abort()
        }
    }, [showToast])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowAttachMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    // Handle pending questions from other pages
    useEffect(() => {
        if (pendingQuestion) {
            setMessage(pendingQuestion)
            setPendingQuestion(null)
        }
    }, [pendingQuestion, setPendingQuestion])

    const handleSubmit = () => {
        if (!message.trim()) return

        addChatMessage({ role: 'user', content: message, silent: true })
        setMessage('')
    }


    const handlePromptClick = (prompt: string) => {
        addChatMessage({ role: 'user', content: prompt, silent: true })
    }

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return

        if (isListening) {
            recognitionRef.current.stop()
        } else {
            try {
                recognitionRef.current.start()
            } catch {
                showToast('Please allow microphone access', 'error')
            }
        }
    }

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            // In a real app, this would handle file upload logic
            showToast(`Selected ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')} `, 'info')
            setShowAttachMenu(false)
        }
    }

    const triggerFileUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="bg-white dark:bg-dark-card transition-colors duration-300 relative flex flex-col gap-4 p-4">


            {/* Suggested prompts */}
            {chatMessages.length === 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                    {suggestedPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handlePromptClick(prompt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                         bg-surface dark:bg-dark-elevated text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors border border-divider dark:border-dark-border shadow-sm"
                        >
                            <Sparkles size={12} className="text-[#800020]" />
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Attachment Menu Popover */}
            {showAttachMenu && (
                <div
                    ref={menuRef}
                    className="absolute left-6 w-64 bg-white dark:bg-dark-elevated rounded-2xl shadow-2xl border border-divider dark:border-dark-border z-50 overflow-hidden animate-in fade-in duration-300 bottom-full mb-4 slide-in-from-bottom-2"
                >
                    <div className="p-1.5 space-y-0.5">
                        <button onClick={triggerFileUpload} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-colors">
                            <Paperclip size={18} className="text-gray-500" />
                            <span>Add photos & files</span>
                        </button>
                        <button
                            onClick={() => { showToast('Image generation coming soon!', 'info'); setShowAttachMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-colors"
                        >
                            <ImageIcon size={18} className="text-gray-500" />
                            <span>Create image</span>
                        </button>
                        <button
                            onClick={() => { showToast('Deep research mode activated!', 'info'); setShowAttachMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-colors"
                        >
                            <Search size={18} className="text-gray-500" />
                            <span>Deep research</span>
                        </button>
                        <button
                            onClick={() => { showToast('Shopping research mode activated!', 'info'); setShowAttachMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-colors"
                        >
                            <ShoppingBag size={18} className="text-gray-500" />
                            <span>Shopping research</span>
                        </button>
                        <button
                            onClick={() => { showToast('Agent mode activated!', 'info'); setShowAttachMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-colors"
                        >
                            <Bot size={18} className="text-gray-500" />
                            <span>Agent mode</span>
                        </button>
                        <div className="h-px bg-divider dark:bg-dark-border my-1 mx-2" />
                        <button
                            onClick={() => { showToast('More options coming soon!', 'info'); setShowAttachMenu(false); }}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <MoreHorizontal size={18} className="text-gray-500" />
                                <span>More</span>
                            </div>
                            <Plus size={14} className="text-gray-400 rotate-45" />
                        </button>
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileUpload}
            />

            {/* Futuristic PragenX-style Pill Input Bar - Completely Borderless */}
            <div className={`flex items-end gap-3 p-3 pl-4 pr-4 rounded-[1.75rem] transition-all duration-500 backdrop-blur-md ${isListening
                ? 'bg-red-50/10 ring-0'
                : 'bg-white/80 dark:bg-black/60 focus-within:bg-white dark:focus-within:bg-black shadow-none border-0'
                }`}>

                {/* Circular Plus Button */}
                <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all hover:scale-110 mb-0.5"
                    aria-label="Add attachment"
                >
                    <Plus size={18} strokeWidth={2.5} />
                </button>

                {/* Textarea for better UX (auto-expanding) */}
                <textarea
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        // Auto-expand logic
                        e.target.style.height = 'auto'
                        e.target.style.height = `${e.target.scrollHeight}px`
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                        }
                    }}
                    placeholder="Ask something"
                    rows={1}
                    className="flex-1 bg-transparent border-0 py-1.5 px-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:border-0 outline-none appearance-none text-[16px] resize-none max-h-[200px] overflow-y-auto leading-relaxed selection:bg-[#800020]/20 hide-scrollbar"
                    style={{ height: '36px' }}
                />

                {/* Right Actions */}
                <div className="flex items-center gap-2 mb-0.5">
                    {chatMessages.length > 0 && (
                        <button
                            onClick={startNewChat}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#800020] hover:bg-gray-100 dark:hover:bg-white/5 transition-all outline-none"
                            title="New Chat"
                        >
                            <RefreshCcw size={18} />
                        </button>
                    )}

                    {/* Mic Icon */}
                    {isSupported && (
                        <button
                            onClick={toggleVoiceInput}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-border'
                                } `}
                        >
                            <Mic size={18} />
                        </button>
                    )}

                    {/* Replace Waveform with Send Button */}
                    <button
                        onClick={handleSubmit}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 outline-none ${message.trim()
                            ? 'bg-[#800020] text-white shadow-md scale-105'
                            : 'bg-gray-100 dark:bg-dark-border text-gray-400 dark:text-gray-600 opacity-80'
                            }`}
                        aria-label="Send message"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

