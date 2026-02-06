import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { X, Users, Calendar, Trash2, AlertTriangle, Mic, MicOff, Video, MessageSquare, FileText, Phone, Globe, Headphones, Monitor } from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

const iconMap = {
    Video,
    Users,
    MessageSquare,
    FileText,
    Phone,
    Globe,
    Headphones,
    Monitor
}

export default function Meetings() {
    const { meetings, addMeeting, deleteMeeting, showToast, integrations } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        duration: '30',
        notes: '',
        integrationId: ''
    })

    const connectedIntegrations = integrations.filter(i => i.status === 'Connected')

    // Voice Assistant State
    const [isVoiceActive, setIsVoiceActive] = useState(false)
    const [voiceStep, setVoiceStep] = useState<'idle' | 'title' | 'date' | 'time' | 'confirm'>('idle')
    const [voiceTranscript, setVoiceTranscript] = useState('')

    // Use Ref for logic flow
    const voiceState = useRef<{
        step: 'idle' | 'title' | 'date' | 'time' | 'confirm',
        data: { title: string, date: string, time: string }
    }>({
        step: 'idle',
        data: { title: '', date: '', time: '' }
    })

    const today = new Date().toISOString().split('T')[0]
    const todayMeetings = meetings.filter(m => m.date === today)
    const upcomingMeetings = meetings.filter(m => m.date > today)

    // Upcoming Meeting Reminder Logic
    useEffect(() => {
        const checkUpcomingMeetings = () => {
            // Check for meetings today or tomorrow
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const tomorrowStr = tomorrow.toISOString().split('T')[0]

            const nearMeetings = meetings.filter(m => m.date === today || m.date === tomorrowStr)

            if (nearMeetings.length > 0) {
                const message = `You have ${nearMeetings.length} meeting${nearMeetings.length > 1 ? 's' : ''} coming up soon.`
                showToast(message, 'info')
            }
        }

        const timer = setTimeout(checkUpcomingMeetings, 1000)
        return () => clearTimeout(timer)
    }, [meetings, showToast, today])

    const hasConflict = (meeting: typeof meetings[0]) => {
        return meetings.some(m =>
            m.id !== meeting.id &&
            m.date === meeting.date &&
            m.time === meeting.time
        )
    }

    const stopVoiceAssistant = () => {
        setIsVoiceActive(false)
        setVoiceStep('idle')
        setVoiceTranscript('')
        voiceState.current = { step: 'idle', data: { title: '', date: '', time: '' } }
        window.speechSynthesis.cancel()
    }

    const processVoiceStep = (text: string) => {
        setVoiceTranscript(text)
        const currentStep = voiceState.current.step
        const currentData = voiceState.current.data

        switch (currentStep) {
            case 'title':
                currentData.title = text
                voiceState.current.step = 'date'
                setVoiceStep('date')
                speak("Got it. When is the meeting?", startListening)
                break

            case 'date':
                let dateStr = text.toLowerCase()
                let targetDate = new Date()

                if (dateStr.includes('tomorrow')) {
                    targetDate.setDate(targetDate.getDate() + 1)
                } else if (dateStr.includes('today')) {
                    // keep today
                } else if (dateStr.includes('next week')) {
                    targetDate.setDate(targetDate.getDate() + 7)
                }
                // Simple date parsing fallback could be added here

                currentData.date = targetDate.toISOString().split('T')[0]

                voiceState.current.step = 'time'
                setVoiceStep('time')
                speak("At what time?", startListening)
                break

            case 'time':
                // heavy simplification: extract numbers or standard time format
                // In a real app, use a library or robust regex.
                // Assuming user says "10 am" or "2 pm" or "14:00"
                let timeStr = text.toLowerCase().replace('.', '').replace(':', '')
                let hours = 9 // default
                let minutes = 0

                const numberMatch = timeStr.match(/(\d+)/)
                if (numberMatch) {
                    let num = parseInt(numberMatch[0])
                    if (timeStr.includes('pm') && num < 12) num += 12
                    else if (timeStr.includes('am') && num === 12) num = 0
                    hours = num
                }

                currentData.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

                voiceState.current.step = 'confirm'
                setVoiceStep('confirm')
                speak(`Confirm scheduling ${currentData.title} on ${currentData.date} at ${currentData.time}? Say confirm.`, startListening)
                break

            case 'confirm':
                if (text.toLowerCase().includes('confirm') || text.toLowerCase().includes('yes')) {
                    addMeeting({
                        title: currentData.title,
                        date: currentData.date,
                        time: currentData.time,
                        duration: 30,
                        notes: 'Added via Voice Assistant'
                    })
                    stopVoiceAssistant()
                    showToast('Meeting scheduled successfully')
                    speak("Meeting scheduled.")
                } else {
                    speak("Cancelled.")
                    stopVoiceAssistant()
                }
                break
        }
    }

    const startListening = () => {
        if (!isVoiceActive) return

        setTimeout(() => {
            listen(
                (text) => processVoiceStep(text),
                (err) => {
                    console.error("Voice Error:", err)
                }
            )
        }, 500)
    }

    const startVoiceAssistant = () => {
        setIsVoiceActive(true)
        window.speechSynthesis.cancel()

        voiceState.current = {
            step: 'title',
            data: { title: '', date: '', time: '' }
        }
        setVoiceStep('title') // UI sync
        setVoiceTranscript("Listening...")

        speak("What is the meeting about?", startListening)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addMeeting({
            title: formData.title,
            date: formData.date,
            time: formData.time,
            duration: parseInt(formData.duration),
            notes: formData.notes,
            integrationId: formData.integrationId || undefined
        })
        setFormData({ title: '', date: '', time: '', duration: '30', notes: '', integrationId: '' })
        setShowForm(false)
        showToast('Meeting added successfully')
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300 relative">
            {isVoiceActive && (
                <div className="fixed inset-0 bg-black/80 dark:bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 transition-all animate-in fade-in">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 animate-pulse">
                        <Mic size={48} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Voice Assistant</h2>
                    <p className="text-gray-300 mb-8 text-center max-w-md">
                        {voiceStep === 'title' && "What is the meeting about?"}
                        {voiceStep === 'date' && "When is the meeting?"}
                        {voiceStep === 'time' && "At what time?"}
                        {voiceStep === 'confirm' && "Please confirm details."}
                    </p>

                    {voiceTranscript && (
                        <div className="bg-white/10 px-6 py-4 rounded-xl mb-8 max-w-lg w-full text-center">
                            <p className="text-lg italic">"{voiceTranscript}"</p>
                        </div>
                    )}

                    <button
                        onClick={stopVoiceAssistant}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full font-medium flex items-center gap-2 transition-colors"
                    >
                        <MicOff size={20} /> Stop Assistant
                    </button>
                </div>
            )}

            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Meetings</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Schedule and manage your meetings</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={startVoiceAssistant}
                            className="p-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:from-primary-500 hover:to-primary-700 shadow-lg shadow-primary-900/40 hover:scale-105 transition-all duration-300"
                            title="Voice Add"
                        >
                            <Mic size={20} />
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-[#800020] hover:bg-[#600018] text-white flex items-center gap-2 font-medium transition-colors rounded-lg shadow-sm"
                        >
                            New meeting
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-300 p-4">
                        <div className="w-full max-w-4xl glass-panel text-gray-900 dark:text-white rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-white/10 shadow-[0_0_50px_rgba(128,0,32,0.1)] dark:shadow-[0_0_50px_rgba(128,0,32,0.15)]">
                            {/* Modal Header */}
                            <div className="px-8 py-6 flex items-center justify-between bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
                                <h2 className="text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                    Schedule Meeting
                                </h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2 rounded-lg bg-[#800020] text-white text-sm font-semibold hover:bg-[#600018] transition-all hover:glow-maroon hover:scale-105 active:scale-95 shadow-lg shadow-maroon/20"
                                    >
                                        Confirm Schedule
                                    </button>
                                    <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10 mx-2"></div>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors group">
                                        <X size={20} className="text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-white transition-colors" />
                                    </button>
                                </div>
                            </div>

                            <div className="laser-line"></div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="space-y-10">

                                    {/* Primary Details Section */}
                                    <div className="space-y-8">
                                        <div className="group">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 block group-focus-within:text-[#800020] transition-colors">Meeting Title</label>
                                            <input
                                                type="text"
                                                placeholder="ENTER MEETING TITLE"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full text-3xl font-light bg-transparent border-none p-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Date & Time</label>
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                                                    <Calendar size={20} className="text-[#800020]" />
                                                    <input
                                                        type="date"
                                                        value={formData.date}
                                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                        className="bg-transparent text-gray-900 dark:text-white font-mono uppercase tracking-wide outline-none w-full dark:[color-scheme:dark]"
                                                        required
                                                    />
                                                    <span className="text-gray-300 dark:text-white/20">|</span>
                                                    <input
                                                        type="time"
                                                        value={formData.time}
                                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                        className="bg-transparent text-gray-900 dark:text-white font-mono uppercase tracking-wide outline-none w-full dark:[color-scheme:dark]"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Attending</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        placeholder="Add required attendees..."
                                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-[#800020]/50 transition-colors pl-12"
                                                    />
                                                    <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#800020] transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-gray-200 dark:border-white/5">

                                        <div className="space-y-3">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Duration</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['15', '30', '45', '60'].map((mins) => (
                                                    <button
                                                        key={mins}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, duration: mins })}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${formData.duration === mins
                                                            ? 'bg-[#800020] border-[#800020] text-white shadow-lg shadow-maroon/20'
                                                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {mins}m
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Platform Sync</label>
                                            <div className="flex flex-wrap gap-3">
                                                {connectedIntegrations.map(integration => {
                                                    const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                                                    return (
                                                        <button
                                                            key={integration.id}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, integrationId: formData.integrationId === integration.id ? '' : integration.id })}
                                                            className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${formData.integrationId === integration.id
                                                                ? 'bg-[#800020]/10 dark:bg-[#800020]/20 border-[#800020] text-[#800020] glow-text'
                                                                : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <Icon size={16} />
                                                            {integration.name}
                                                        </button>
                                                    )
                                                })}
                                                {connectedIntegrations.length === 0 && (
                                                    <div className="text-sm text-gray-500 italic py-2 border border-dashed border-gray-300 dark:border-white/10 rounded-lg px-4 w-full text-center">
                                                        No external calendars connected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="pt-4">
                                        <textarea
                                            placeholder="Add meeting description, agenda, or notes..."
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 p-6 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 border border-gray-200 dark:border-white/5 focus:border-[#800020]/50 focus:outline-none min-h-[120px] resize-none transition-colors"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Today ({todayMeetings.length})</h2>
                    {todayMeetings.length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No meetings today</p>
                    ) : (
                        <div className="space-y-3">
                            {todayMeetings.map(meeting => (
                                <div key={meeting.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between transition-colors duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meeting.integrationId
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            }`}>
                                            {(() => {
                                                const integration = integrations.find(i => i.id === meeting.integrationId)
                                                if (integration) {
                                                    const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                                                    return <Icon size={20} />
                                                }
                                                return <Users size={20} />
                                            })()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">{meeting.title}</h3>
                                                {hasConflict(meeting) && (
                                                    <span className="text-amber-500" title="Time conflict">
                                                        <AlertTriangle size={16} />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {meeting.time} • {meeting.duration} min
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteMeeting(meeting.id)} className="btn btn-ghost p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming ({upcomingMeetings.length})</h2>
                    {upcomingMeetings.length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No upcoming meetings</p>
                    ) : (
                        <div className="space-y-3">
                            {upcomingMeetings.map(meeting => (
                                <div key={meeting.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between transition-colors duration-300 group hover:border-primary/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${meeting.integrationId
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary'
                                            : 'bg-gray-100 dark:bg-dark-elevated text-gray-600 dark:text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary'
                                            }`}>
                                            {(() => {
                                                const integration = integrations.find(i => i.id === meeting.integrationId)
                                                if (integration) {
                                                    const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                                                    return <Icon size={20} />
                                                }
                                                return <Calendar size={20} />
                                            })()}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{meeting.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(meeting.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {meeting.time}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteMeeting(meeting.id)} className="btn btn-ghost p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Past Meetings</h2>
                    {meetings.filter(m => m.date < today).length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No past meetings recorded</p>
                    ) : (
                        <div className="space-y-3">
                            {meetings
                                .filter(m => m.date < today)
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map(meeting => (
                                    <div key={meeting.id} className="card bg-white dark:bg-dark-card border border-gray-50 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-elevated text-gray-400 dark:text-gray-500 flex items-center justify-center">
                                                {(() => {
                                                    const integration = integrations.find(i => i.id === meeting.integrationId)
                                                    if (integration) {
                                                        const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                                                        return <Icon size={20} />
                                                    }
                                                    return <Users size={20} />
                                                })()}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100 line-through decoration-gray-400">{meeting.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(meeting.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteMeeting(meeting.id)} className="btn btn-ghost p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
