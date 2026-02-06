import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, Users, Calendar, Trash2, AlertTriangle, Mic, MicOff, Video, MessageSquare, FileText } from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

const iconMap = {
    Video,
    Users,
    MessageSquare,
    FileText
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
                        <div className="flex rounded-lg overflow-hidden shadow-sm">
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-4 py-2 bg-[#4B5CC4] hover:bg-[#3d4bb1] text-white flex items-center gap-2 font-medium transition-colors"
                            >
                                <Plus size={18} />
                                New meeting
                            </button>
                            <div className="w-[1px] bg-[#3d4bb1]"></div>
                            <button className="px-2 py-2 bg-[#4B5CC4] hover:bg-[#3d4bb1] text-white transition-colors">
                                <X size={16} className="rotate-45" />
                            </button>
                        </div>
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-[#F5F5F5] dark:bg-[#111111] z-[60] flex flex-col animate-in slide-in-from-bottom duration-300">
                        {/* Modal Header */}
                        <div className="bg-white dark:bg-[#1F1F1F] px-6 py-3 flex items-center justify-between border-b border-gray-200 dark:border-dark-border">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 italic">PragenX Meetings</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-1.5 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-1.5 rounded bg-[#4B5CC4] text-white text-sm font-semibold hover:bg-[#3d4bb1] transition-colors"
                                >
                                    Save
                                </button>
                                <div className="w-[1px] h-6 bg-gray-200 dark:border-dark-border mx-1"></div>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="space-y-6 bg-white dark:bg-[#1F1F1F] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                                    {/* Row 1: Title */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add title</label>
                                        <input
                                            type="text"
                                            placeholder="Enter meeting title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full text-xl font-normal bg-transparent border-b border-gray-200 dark:border-dark-border pb-2 focus:border-blue-500 focus:outline-none dark:text-gray-100 placeholder-gray-400"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Row 2: Participants */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add required attendees</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Invite someone..."
                                                className="w-full bg-transparent border-b border-gray-200 dark:border-dark-border pb-2 focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                            />
                                            <Users size={18} className="absolute right-2 top-0 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Row 3: Date & Time */}
                                    <div className="flex items-center gap-6 pt-2">
                                        <div className="flex-1 flex items-center gap-4 bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                                            <Calendar size={20} className="text-[#800020]" />
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="bg-transparent font-medium dark:text-gray-100 outline-none"
                                                    required
                                                />
                                                <input
                                                    type="time"
                                                    value={formData.time}
                                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                    className="bg-transparent font-medium dark:text-gray-100 outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <X size={16} className="text-gray-400" />
                                        <div className="w-32">
                                            <select
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-black/20 p-4 rounded-lg font-medium dark:text-gray-100 outline-none appearance-none"
                                            >
                                                <option value="15">15 min</option>
                                                <option value="30">30 min</option>
                                                <option value="45">45 min</option>
                                                <option value="60">1 hour</option>
                                                <option value="90">1.5 hours</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Row 4: Location/Service */}
                                    <div className="grid grid-cols-2 gap-8 pt-2">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add location</label>
                                            <input
                                                type="text"
                                                placeholder="Search for a location"
                                                className="w-full bg-transparent border-b border-gray-200 dark:border-dark-border pb-2 focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sync with service</label>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {connectedIntegrations.map(integration => {
                                                    const Icon = iconMap[integration.iconType as keyof typeof iconMap]
                                                    return (
                                                        <button
                                                            key={integration.id}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, integrationId: formData.integrationId === integration.id ? '' : integration.id })}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${formData.integrationId === integration.id
                                                                ? 'bg-[#800020]/10 border-[#800020] text-[#800020]'
                                                                : 'bg-gray-50 dark:bg-black/20 border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-dark-border'
                                                                }`}
                                                        >
                                                            <Icon size={14} />
                                                            {integration.name}
                                                        </button>
                                                    )
                                                })}
                                                {connectedIntegrations.length === 0 && (
                                                    <p className="text-xs text-amber-500 py-1">No integrations connected.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 5: Notes */}
                                    <div className="flex flex-col gap-2 pt-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add a description</label>
                                        <textarea
                                            placeholder="Type details for this new meeting"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full bg-[#F9F9F9] dark:bg-black/30 p-4 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none dark:text-gray-100 min-h-[120px] resize-none"
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
