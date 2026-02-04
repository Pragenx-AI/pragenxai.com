import { useState, KeyboardEvent, useRef, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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
    MoreHorizontal
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
    const [message, setMessage] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [isSupported, setIsSupported] = useState(true)
    const [showAttachMenu, setShowAttachMenu] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const { addChatMessage, showToast, pendingQuestion, setPendingQuestion } = useApp()
    const navigate = useNavigate()
    const recognitionRef = useRef<SpeechRecognition | null>(null)

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

    // Handle pending questions from other pages
    useEffect(() => {
        if (pendingQuestion) {
            setMessage(pendingQuestion)
            setPendingQuestion(null)
            // If we are not on the chat page, redirect there
            if (window.location.pathname !== '/chat') {
                navigate('/chat')
            }
        }
    }, [pendingQuestion, setPendingQuestion, navigate])

    const handleSubmit = () => {
        if (!message.trim()) return

        addChatMessage({ role: 'user', content: message })
        setMessage('')

        // Always ensure we are on the chat page after sending
        if (window.location.pathname !== '/chat') {
            navigate('/chat')
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handlePromptClick = (prompt: string) => {
        setPendingQuestion(prompt)
        navigate('/chat')
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
            showToast(`Selected ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`, 'info')
            setShowAttachMenu(false)
        }
    }

    const triggerFileUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="border-t border-divider dark:border-dark-border bg-white dark:bg-dark-card p-4 transition-colors duration-300 relative">
            {/* Suggested prompts */}
            <div className="flex flex-wrap gap-2 mb-3">
                {suggestedPrompts.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                     bg-surface dark:bg-dark-elevated text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary dark:hover:text-primary-light
                     border border-divider dark:border-dark-border transition-colors"
                    >
                        <Sparkles size={14} />
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Attachment Menu Popover */}
            {showAttachMenu && (
                <div ref={menuRef} className="absolute bottom-20 left-4 w-60 bg-white dark:bg-dark-elevated rounded-xl shadow-xl border border-divider dark:border-dark-border z-50 overflow-hidden animate-fade-in-up">
                    <div className="p-1 space-y-0.5">
                        <button onClick={triggerFileUpload} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                            <Paperclip size={18} className="text-gray-500" />
                            Add photos & files
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                            <ImageIcon size={18} className="text-gray-500" />
                            Create image
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                            <Search size={18} className="text-gray-500" />
                            Deep research
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                            <ShoppingBag size={18} className="text-gray-500" />
                            Shopping research
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                            <Bot size={18} className="text-gray-500" />
                            Agent mode
                        </button>
                        <div className="h-px bg-divider dark:bg-dark-border my-1" />
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                            <MoreHorizontal size={18} className="text-gray-500" />
                            More
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

            {/* Unified Input Bar */}
            <div className={`flex items-end gap-2 p-2 rounded-3xl border transition-all duration-200 ${isListening ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-divider dark:border-dark-border bg-surface dark:bg-dark-elevated focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'}`}>

                {/* Plus Button */}
                <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors mb-0.5"
                    aria-label="Add attachment"
                >
                    <Plus size={20} />
                </button>

                {/* Text Area */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask PragenX..."
                    rows={1}
                    className="flex-1 bg-transparent border-none resize-none py-3 px-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 max-h-32"
                    style={{ minHeight: '44px' }}
                />

                {/* Right Actions */}
                <div className="flex items-center gap-1 mb-0.5">
                    {/* Voice Input */}
                    {isSupported && (
                        <button
                            onClick={toggleVoiceInput}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-border'
                                }`}
                        >
                            <Mic size={20} />
                        </button>
                    )}

                    {/* Send Button (Only visible if there is text, or always visible? Screenshot implies maybe not always) */}
                    {/* Keeping it visible but styled consistently or matching screenshot if possible. Screenshot shows a black circle with sound wave? 
                        The user didn't ask for the sound wave explicitly, but "as same as in the image".
                        I'll keep the Send button but maybe circular like the input buttons.
                    */}
                    <button
                        onClick={handleSubmit}
                        disabled={!message.trim()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${message.trim()
                            ? 'bg-primary text-white hover:bg-primary-dark'
                            : 'bg-gray-200 dark:bg-dark-border text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

