import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Mic, Volume2, Loader2, Check, Plane, Receipt, Users } from 'lucide-react'

// Web Speech API types
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

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking'

interface VoiceAssistantProps {
    variant?: 'default' | 'large' | 'compact'
}

type FlowType = 'none' | 'travel' | 'bill' | 'meeting'

interface FlowData {
    type: FlowType
    step: number
    data: any
    transcript: string
}

export default function VoiceAssistant({ variant = 'default' }: VoiceAssistantProps) {
    const [voiceState, setVoiceState] = useState<VoiceState>('idle')
    const [transcript, setTranscript] = useState('')
    const [isSupported, setIsSupported] = useState(true)
    const [flow, setFlow] = useState<FlowData | null>(null)

    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

    const {
        addChatMessage,
        addBill,
        addMeeting,
        addTrip,
        showToast
    } = useApp()
    const navigate = useNavigate()

    const speakResponse = useCallback((text: string, onEnd?: () => void) => {
        if (!('speechSynthesis' in window)) return

        // Cancel any current speech immediately
        window.speechSynthesis.cancel()

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text)

            // CRITICAL: Keep a global reference to prevent GC on macOS
            ; (window as any)._utterance = utterance
        synthRef.current = utterance

        // Voice selection - Samantha is the gold standard for reliability on macOS
        const voices = window.speechSynthesis.getVoices()
        const preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English')) ||
            voices.find(v => v.lang.startsWith('en-US')) ||
            voices[0]

        if (preferredVoice) utterance.voice = preferredVoice
        utterance.rate = 1.05
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onstart = () => {
            console.log("🔊 AI Voice Engaged")
            setVoiceState('speaking')
        }

        utterance.onend = () => {
            console.log("✅ AI Voice Finished")
            setVoiceState('idle')
            delete (window as any)._utterance
            if (onEnd) onEnd()
        }

        utterance.onerror = (e) => {
            console.error("❌ AI Voice Error:", e)
            setVoiceState('idle')
            delete (window as any)._utterance
        }

        // Standard sequence: Resume -> Speak
        window.speechSynthesis.resume()
        window.speechSynthesis.speak(utterance)
    }, [])

    const startListening = useCallback(() => {
        if (recognitionRef.current && voiceState === 'idle') {
            try {
                // "Unlock" speech synthesis on first user interaction
                if ('speechSynthesis' in window) {
                    const silent = new SpeechSynthesisUtterance('')
                    silent.volume = 0
                    window.speechSynthesis.speak(silent)
                }

                recognitionRef.current.start()
            } catch (e) {
                console.error("Recognition Start Error", e)
            }
        }
    }, [voiceState])

    const handleVoiceCommand = useCallback((command: string) => {
        setVoiceState('processing')
        addChatMessage({ role: 'user', content: command })
        const cmd = command.toLowerCase()

        // If a flow is active, process next step (high priority for structured data collection)
        if (flow) {
            processActiveFlow(cmd)
            return
        }

        // Detect new structured flows (keep these for complex data entry)
        if (cmd.includes('travel') || cmd.includes('trip')) {
            startTravelFlow(cmd)
        } else if (cmd.includes('add a bill') || cmd.includes('create a bill')) {
            startBillFlow(cmd)
        } else if (cmd.includes('schedule a meeting')) {
            startMeetingFlow(cmd)
        } else {
            // General AI response handles the 18 specific questions and other queries
            // Redirect to GPT page if not already there
            if (window.location.pathname !== '/chat') {
                navigate('/chat')
            }
        }
    }, [flow, addChatMessage])

    const handleVoiceCommandRef = useRef(handleVoiceCommand)
    useEffect(() => {
        handleVoiceCommandRef.current = handleVoiceCommand
    }, [handleVoiceCommand])

    // Pre-load voices for synthesis
    useEffect(() => {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                window.speechSynthesis.getVoices()
            }
            loadVoices()
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices
            }
        }
    }, [])

    // Initialize speech recognition
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
            setVoiceState('listening')
            setTranscript('')
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

            setTranscript(finalTranscript || interimTranscript)

            if (finalTranscript) {
                // Use the ref to call handleVoiceCommand
                handleVoiceCommandRef.current(finalTranscript)
            }
        }

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error", event)
            setVoiceState('idle')
        }

        recognition.onend = () => {
            setVoiceState(prev => (prev === 'listening' ? 'idle' : prev))
        }

        recognitionRef.current = recognition
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort()
            }
        }
    }, [])

    // Speak assistant responses automatically
    const { chatMessages } = useApp()
    // Initialize with the ID of the last message so we don't auto-speak on mount
    const lastMessageRef = useRef<string | null>(chatMessages[chatMessages.length - 1]?.id || null)

    useEffect(() => {
        const lastMessage = chatMessages[chatMessages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.id !== lastMessageRef.current) {
            lastMessageRef.current = lastMessage.id

            // Only speak if the message is NOT marked as silent
            if (!lastMessage.silent) {
                speakResponse(lastMessage.content, () => {
                    // Optional: auto-start listening for a conversational feel
                    // startListening() 
                })
            }
        }
    }, [chatMessages, speakResponse])

    const startTravelFlow = (cmd: string) => {
        // Entity extraction
        const destination = cmd.match(/to\s+([a-zA-Z\s]+)/)?.[1]?.trim() || 'Ireland'
        const isTomorrow = cmd.includes('tomorrow')
        let time = cmd.match(/(\d+)\s*(am|pm|a|p)/i)?.[0] || '09:00'

        const tripDate = new Date()
        if (isTomorrow) tripDate.setDate(tripDate.getDate() + 1)

        const newFlow: FlowData = {
            type: 'travel',
            step: 3, // Destination and Date partially extracted, let's go to confirm or ask for more
            data: {
                destination,
                startDate: tripDate.toISOString().split('T')[0],
                endDate: new Date(tripDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time
            },
            transcript: cmd
        }
        setFlow(newFlow)

        speakResponse(`Setting up a trip to ${destination} for ${isTomorrow ? 'tomorrow' : 'the future'} at ${time}. Shall I confirm?`, startListening)
    }

    const startBillFlow = (cmd: string) => {
        const amount = cmd.match(/(\d+)/)?.[1] || ''
        const newFlow: FlowData = {
            type: 'bill',
            step: 1,
            data: { title: 'New Bill', amount, dueDate: '' },
            transcript: cmd
        }
        setFlow(newFlow)
        if (!amount) {
            speakResponse("How much is the bill?", startListening)
        } else {
            speakResponse(`Setting up a bill for ${amount} rupees. What is it for?`, startListening)
        }
    }

    const startMeetingFlow = (cmd: string) => {
        const title = cmd.match(/with\s+([a-zA-Z\s]+)/)?.[1]?.trim() || 'Meeting'
        const newFlow: FlowData = {
            type: 'meeting',
            step: 1,
            data: { title, date: new Date().toISOString().split('T')[0], time: '10:00' },
            transcript: cmd
        }
        setFlow(newFlow)
        speakResponse(`Scheduling a meeting: ${title}. When should it be?`, startListening)
    }

    const processActiveFlow = (cmd: string) => {
        const current = { ...flow! }

        if (cmd.includes('confirm') || cmd.includes('yes') || cmd.includes('yeah') || cmd.includes('save')) {
            saveFlow(current)
            return
        }

        if (cmd.includes('cancel') || cmd.includes('stop')) {
            setFlow(null)
            speakResponse("Action cancelled.")
            return
        }

        // Step through based on type
        if (current.type === 'travel') {
            // In a real app, refine parsing here. For demo, we assume the next input might be a correction
            if (cmd.includes('days')) {
                // update duration...
            }
            speakResponse("Got it. Say confirm to save your trip.", startListening)
        } else if (current.type === 'bill') {
            if (current.step === 1) {
                current.data.title = cmd
                current.step = 2
                setFlow(current)
                speakResponse(`Confirming bill for ${current.data.title} at ${current.data.amount} rupees. Correct?`, startListening)
            }
        } else if (current.type === 'meeting') {
            // ... etc
            speakResponse("Okay, scheduled. Say confirm to finish.", startListening)
        }
    }

    const saveFlow = (current: FlowData) => {
        if (current.type === 'travel') {
            addTrip(current.data)
            showToast(`Trip to ${current.data.destination} added!`, 'success')
            speakResponse(`Trip to ${current.data.destination} is set! Redirecting you now.`, () => {
                setFlow(null)
                navigate('/travel')
            })
        } else if (current.type === 'bill') {
            addBill({ ...current.data, status: 'upcoming', category: 'Other' })
            showToast('Bill added!', 'success')
            speakResponse("Bill saved. Redirecting to your bills.", () => {
                setFlow(null)
                navigate('/bills')
            })
        } else if (current.type === 'meeting') {
            addMeeting({ ...current.data, duration: 30 })
            showToast('Meeting added!', 'success')
            speakResponse("Meeting scheduled. Redirecting.", () => {
                setFlow(null)
                navigate('/meetings')
            })
        }
    }

    const stopVoiceAssistant = () => {
        setVoiceState('idle')
        setTranscript('')
        setFlow(null)
        window.speechSynthesis.cancel()
    }

    return (
        <div className={`relative transition-all duration-500 ease-out w-full max-w-2xl mx-auto ${flow ? 'mt-4' : ''
            }`}>
            {/* Main Interactive Card */}
            <div className={`bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-gray-100 dark:border-dark-border shadow-2xl transition-all duration-500 overflow-hidden ${flow ? 'scale-105' : 'hover:scale-[1.02]'
                }`}>

                {/* Visual Steps Area - Only shows when flow is active */}
                {flow && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                {flow.type === 'travel' && <Plane size={24} />}
                                {flow.type === 'bill' && <Receipt size={24} />}
                                {flow.type === 'meeting' && <Users size={24} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                                    {flow.type === 'travel' ? 'Plan New Trip' : flow.type === 'bill' ? 'New Bill Reminder' : 'Schedule Meeting'}
                                </h3>
                                <p className="text-sm text-gray-500 uppercase font-semibold tracking-widest mt-0.5">Step {flow.step} of 3</p>
                            </div>
                        </div>

                        {/* Steps UI */}
                        <div className="grid gap-4">
                            <div className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${flow.data.destination || flow.data.title ? 'bg-primary/5 border border-primary/20' : 'bg-gray-50 dark:bg-dark-elevated border border-transparent'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${flow.data.destination || flow.data.title ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-dark-border text-gray-400'}`}>
                                        <Check size={12} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {flow.type === 'travel' ? 'Destination' : 'Title'}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {flow.data.destination || flow.data.title || '...'}
                                </span>
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${flow.data.startDate || flow.data.amount ? 'bg-primary/5 border border-primary/20' : 'bg-gray-50 dark:bg-dark-elevated border border-transparent'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${flow.data.startDate || flow.data.amount ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-dark-border text-gray-400'}`}>
                                        <Check size={12} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {flow.type === 'travel' ? 'Date' : 'Detail'}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {flow.type === 'travel' ? flow.data.startDate : flow.data.amount || '...'}
                                </span>
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${flow.step >= 3 ? 'bg-primary/5 border border-primary/20' : 'bg-gray-50 dark:bg-dark-elevated border border-transparent'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${flow.step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-dark-border text-gray-400'}`}>
                                        <Check size={12} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {flow.step >= 3 ? 'Ready to Confirm' : 'Collecting...'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Central Hub UI */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={voiceState === 'idle' ? startListening : stopVoiceAssistant}
                        className={`relative group rounded-full flex items-center justify-center transition-all duration-700 ${voiceState === 'listening' ? 'bg-red-500 scale-110 shadow-2xl shadow-red-500/40' :
                            voiceState === 'speaking' ? 'bg-green-500' :
                                'bg-primary-600 hover:bg-primary-700 active:scale-95'
                            } ${flow ? 'w-24 h-24' : variant === 'compact' ? 'w-24 h-24' : 'w-36 h-36'}`}
                    >
                        {/* Interactive Ripple Effects on Hover */}
                        {voiceState === 'idle' && (
                            <>
                                <span className="absolute inset-0 rounded-full bg-primary-400/20 scale-100 group-hover:animate-pulse-ring transition-transform" />
                                <span className="absolute inset-0 rounded-full bg-primary-400/10 scale-100 group-hover:animate-pulse-ring transition-transform" style={{ animationDelay: '0.5s' }} />
                                <span className="absolute inset-0 rounded-full bg-primary-400/5 scale-100 group-hover:animate-pulse-ring transition-transform" style={{ animationDelay: '1s' }} />
                            </>
                        )}

                        {voiceState === 'listening' ? (
                            <>
                                <Mic size={flow || variant === 'compact' ? 32 : 48} className="text-white" />
                                <span className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-20" />
                            </>
                        ) : voiceState === 'processing' ? (
                            <Loader2 size={flow || variant === 'compact' ? 32 : 48} className="text-white animate-spin" />
                        ) : voiceState === 'speaking' ? (
                            <Volume2 size={flow || variant === 'compact' ? 32 : 48} className="text-white animate-bounce" />
                        ) : (
                            <Mic size={flow || variant === 'compact' ? 32 : 48} className="text-white group-hover:scale-110 transition-all duration-500 ease-out" />
                        )}

                        {/* Ambient Glow */}
                        {voiceState === 'idle' && (
                            <div className="absolute -inset-8 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                        )}
                    </button>

                    <h4 className={`mt-6 ${variant === 'compact' ? 'text-lg' : 'text-xl'} font-bold tracking-tight transition-colors ${voiceState === 'listening' ? 'text-red-500 animate-pulse' :
                        voiceState === 'speaking' ? 'text-green-500' :
                            'text-gray-900 dark:text-gray-100'
                        }`}>
                        {voiceState === 'listening' ? 'Listening...' :
                            voiceState === 'processing' ? 'Thinking...' :
                                voiceState === 'speaking' ? 'AI Speaking' :
                                    flow ? 'Continue speaking...' : 'Tap to speak'}
                    </h4>

                    {transcript && (
                        <div className="mt-4 px-6 py-3 bg-gray-50 dark:bg-dark-elevated rounded-2xl border border-gray-100 dark:border-dark-border animate-in fade-in zoom-in duration-300">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic text-center leading-relaxed">
                                "{transcript}"
                            </p>
                        </div>
                    )}



                    {flow && (
                        <div className="mt-8 flex gap-3 w-full animate-in slide-in-from-bottom-4 duration-500">
                            <button
                                onClick={stopVoiceAssistant}
                                className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 dark:bg-dark-elevated text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => saveFlow(flow)}
                                className="flex-1 py-4 px-6 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                            >
                                Save Now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Support Info */}
            {!isSupported && (
                <div className="mt-6 text-center text-sm text-red-500 font-medium">
                    Speech recognition is not supported in this browser.
                </div>
            )}
        </div>
    )
}
