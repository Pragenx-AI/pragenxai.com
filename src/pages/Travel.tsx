import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, Plane, Calendar, Trash2, CloudSun, Mic, MicOff } from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

export default function Travel() {
    const { trips, addTrip, deleteTrip, showToast } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        notes: ''
    })

    // Voice Assistant State
    const [isVoiceActive, setIsVoiceActive] = useState(false)
    const [voiceStep, setVoiceStep] = useState<'idle' | 'destination' | 'start' | 'end' | 'confirm'>('idle')
    const [voiceTranscript, setVoiceTranscript] = useState('')

    const voiceState = useRef<{
        step: 'idle' | 'destination' | 'start' | 'end' | 'confirm',
        data: { destination: string, startDate: string, endDate: string }
    }>({
        step: 'idle',
        data: { destination: '', startDate: '', endDate: '' }
    })

    const today = new Date().toISOString().split('T')[0]
    const upcomingTrips = trips.filter(t => t.startDate >= today)
    const pastTrips = trips.filter(t => t.startDate < today)

    // Upcoming Trip Reminder Logic
    useEffect(() => {
        const checkUpcomingTrips = () => {
            // Check trips starting in the next 3 days
            const nextFewDays = new Date()
            nextFewDays.setDate(nextFewDays.getDate() + 3)

            const nearTrips = trips.filter(t => {
                const tripDate = new Date(t.startDate)
                const todayDate = new Date()
                return tripDate >= todayDate && tripDate <= nextFewDays
            })

            if (nearTrips.length > 0) {
                const message = `You have a trip to ${nearTrips[0].destination} coming up soon.`
                showToast(message, 'info')
            }
        }

        const timer = setTimeout(checkUpcomingTrips, 1000)
        return () => clearTimeout(timer)
    }, [trips, showToast])


    const getDaysUntil = (date: string) => {
        const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return days
    }

    const stopVoiceAssistant = () => {
        setIsVoiceActive(false)
        setVoiceStep('idle')
        setVoiceTranscript('')
        voiceState.current = { step: 'idle', data: { destination: '', startDate: '', endDate: '' } }
        window.speechSynthesis.cancel()
    }

    const processVoiceStep = (text: string) => {
        setVoiceTranscript(text)
        const currentStep = voiceState.current.step
        const currentData = voiceState.current.data

        switch (currentStep) {
            case 'destination':
                currentData.destination = text
                voiceState.current.step = 'start'
                setVoiceStep('start')
                speak("Great. When does the trip start?", startListening)
                break

            case 'start':
                let startD = new Date()
                if (text.toLowerCase().includes('tomorrow')) startD.setDate(startD.getDate() + 1)
                else if (text.toLowerCase().includes('next week')) startD.setDate(startD.getDate() + 7)
                // else try simple parse or keep default today for this demo

                currentData.startDate = startD.toISOString().split('T')[0]

                voiceState.current.step = 'end'
                setVoiceStep('end')
                speak("And when does it end?", startListening)
                break

            case 'end':
                let endD = new Date(currentData.startDate)
                if (text.toLowerCase().includes('days')) {
                    const daysMatch = text.match(/\d+/)
                    if (daysMatch) endD.setDate(endD.getDate() + parseInt(daysMatch[0]))
                } else {
                    // default 3 days
                    endD.setDate(endD.getDate() + 3)
                }

                currentData.endDate = endD.toISOString().split('T')[0]

                voiceState.current.step = 'confirm'
                setVoiceStep('confirm')
                speak(`Confirm trip to ${currentData.destination} from ${currentData.startDate}? Say confirm.`, startListening)
                break

            case 'confirm':
                if (text.toLowerCase().includes('confirm') || text.toLowerCase().includes('yes')) {
                    addTrip({
                        destination: currentData.destination,
                        startDate: currentData.startDate,
                        endDate: currentData.endDate,
                        notes: 'Added via Voice Assistant'
                    })
                    stopVoiceAssistant()
                    showToast('Trip added successfully')
                    speak("Trip added.")
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
            step: 'destination',
            data: { destination: '', startDate: '', endDate: '' }
        }
        setVoiceStep('destination')
        setVoiceTranscript("Listening...")

        speak("Where are you planning to go?", startListening)
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addTrip({
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            notes: formData.notes
        })
        setFormData({ destination: '', startDate: '', endDate: '', notes: '' })
        setShowForm(false)
        showToast('Trip added successfully')
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
                        {voiceStep === 'destination' && "Where are you planning to go?"}
                        {voiceStep === 'start' && "When does the trip start?"}
                        {voiceStep === 'end' && "When does it end?"}
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
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Travel</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Plan and track your trips</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={startVoiceAssistant}
                            className="p-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:from-primary-500 hover:to-primary-700 shadow-lg shadow-primary-900/40 hover:scale-105 transition-all duration-300"
                            title="Voice Add"
                        >
                            <Mic size={20} />
                        </button>
                        <button onClick={() => setShowForm(true)} className="btn btn-primary">
                            <Plus size={18} className="mr-2" />
                            Add Trip
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="card mb-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Plan New Trip</h3>
                            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-surface dark:hover:bg-dark-elevated rounded transition-colors">
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Destination"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100 dark:placeholder-gray-500"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>
                            <textarea
                                placeholder="Notes (optional)"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100 dark:placeholder-gray-500"
                                rows={2}
                            />
                            <button type="submit" className="btn btn-primary w-full">
                                Add Trip
                            </button>
                        </form>
                    </div>
                )}

                {/* Weather Alert */}
                <div className="card mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <CloudSun className="text-blue-500 dark:text-blue-400" size={24} />
                        <div>
                            <h3 className="font-medium text-blue-900 dark:text-blue-100">Weather Alert</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Check weather at your destination before traveling</p>
                        </div>
                    </div>
                </div>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Trips ({upcomingTrips.length})</h2>
                    {upcomingTrips.length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No upcoming trips</p>
                    ) : (
                        <div className="space-y-3">
                            {upcomingTrips.map(trip => (
                                <div key={trip.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 transition-colors duration-300">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                                <Plane size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{trip.destination}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </p>
                                                {trip.notes && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{trip.notes}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                                {getDaysUntil(trip.startDate)} days
                                            </span>
                                            <button onClick={() => deleteTrip(trip.id)} className="btn btn-ghost p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Past Trips ({pastTrips.length})</h2>
                    {pastTrips.length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No past trips</p>
                    ) : (
                        <div className="space-y-3">
                            {pastTrips.map(trip => (
                                <div key={trip.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 opacity-60 transition-colors duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-elevated text-gray-500 dark:text-gray-400 flex items-center justify-center">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{trip.destination}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
