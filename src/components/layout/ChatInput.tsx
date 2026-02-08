import { useState, useRef, useEffect } from 'react'

import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import {
    Send,
    Mic,
    Plus,
    History,
    Paperclip,
    Image as ImageIcon
} from 'lucide-react'


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
        showToast,
        pendingQuestion,
        setPendingQuestion
    } = useApp()
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [isVoiceMessage, setIsVoiceMessage] = useState(false)
    const [showAttachMenu, setShowAttachMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Initialize speech recognition (unchanged logic)
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
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
            setIsVoiceMessage(true)
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

        addChatMessage({ role: 'user', content: message, silent: !isVoiceMessage })
        setMessage('')
        setIsVoiceMessage(false)

        // Redirect to GPT page if not already there
        if (window.location.pathname !== '/chat') {
            navigate('/chat')
        }
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


    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="relative flex flex-col">

                {/* Attach Menu */}
                {showAttachMenu && (
                    <div
                        ref={menuRef}
                        className="absolute bottom-full left-4 mb-4 w-60 bg-white dark:bg-dark-elevated rounded-3xl shadow-2xl border border-divider dark:border-white/10 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors text-gray-700 dark:text-gray-200 group">
                                <div className="p-1.5 bg-gray-50 dark:bg-white/5 rounded-lg group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                                    <Paperclip size={18} />
                                </div>
                                <span className="font-medium text-sm">Add photos & files</span>
                            </button>

                            <div className="h-px bg-divider dark:bg-white/5 my-1 mx-2" />

                            <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors text-gray-700 dark:text-gray-200 group">
                                <div className="p-1.5 bg-gray-50 dark:bg-white/5 rounded-lg group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                                    <ImageIcon size={18} />
                                </div>
                                <span className="font-medium text-sm">Create image</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Bar Container */}
                <div className={`relative flex items-center bg-[#f4f4f4] dark:bg-white/5 rounded-[2.5rem] px-4 py-2 transition-all duration-500 shadow-sm border border-transparent focus-within:bg-white dark:focus-within:bg-dark-elevated focus-within:shadow-md focus-within:border-gray-200 dark:focus-within:border-white/10 ${isListening ? 'ring-2 ring-red-500/20' : ''}`}>
                    {/* Add button on the left */}
                    <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="Add attachment"
                    >
                        <Plus size={22} />
                    </button>

                    {/* Text Input */}
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                            setIsVoiceMessage(false)
                            e.target.style.height = 'auto'
                            e.target.style.height = `${e.target.scrollHeight}px`
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="ask anything"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[16px] text-gray-800 dark:text-gray-200 placeholder-gray-500 py-3 px-2 resize-none max-h-48 hide-scrollbar leading-relaxed lowercase"
                        style={{ height: '44px' }}
                    />

                    {/* Right side icons */}
                    <div className="flex items-center gap-1 border-l-0 border-none">
                        {/* History Button */}
                        <button
                            onClick={() => navigate('/history')}
                            className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            title="History"
                        >
                            <History size={20} />
                        </button>

                        {/* Mic Button */}
                        <button
                            onClick={toggleVoiceInput}
                            className={`p-2.5 rounded-full transition-all duration-300 ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                                }`}
                            aria-label="Toggle voice input"
                        >
                            <Mic size={20} />
                        </button>

                        {/* Send Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!message.trim()}
                            className={`p-2.5 rounded-full transition-all duration-300 ${message.trim()
                                ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                }`}
                            aria-label="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

