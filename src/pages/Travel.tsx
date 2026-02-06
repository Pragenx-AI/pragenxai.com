import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, Plane, Calendar, Trash2, CloudSun, Mic, MicOff, Train, Car, Bus, Users, MapPin, Thermometer, Droplets, Wind, ExternalLink, Hotel, Briefcase, Crown, Armchair } from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

export default function Travel() {
    const { trips, addTrip, deleteTrip, showToast } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        destination: '',
        departureCity: '',
        startDate: '',
        endDate: '',
        tripType: 'roundtrip' as 'oneway' | 'roundtrip' | 'multicity',
        transportMode: 'flight' as 'flight' | 'train' | 'car' | 'bus',
        travelClass: 'economy' as 'economy' | 'business' | 'first',
        travelers: 1,
        needsAccommodation: false,
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


    const handleSubmit = () => {
        if (!formData.destination || !formData.startDate) {
            showToast('Please fill in destination and travel dates', 'error')
            return
        }
        addTrip({
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate || formData.startDate,
            notes: `From: ${formData.departureCity || 'N/A'} | ${formData.transportMode.toUpperCase()} | ${formData.travelClass} class | ${formData.travelers} traveler(s)${formData.needsAccommodation ? ' | Needs accommodation' : ''}${formData.notes ? ` | ${formData.notes}` : ''}`
        })
        setFormData({
            destination: '',
            departureCity: '',
            startDate: '',
            endDate: '',
            tripType: 'roundtrip',
            transportMode: 'flight',
            travelClass: 'economy',
            travelers: 1,
            needsAccommodation: false,
            notes: ''
        })
        setShowForm(false)
        showToast('Trip planned successfully!')
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
                    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-300 p-4">
                        <div className="w-full max-w-4xl glass-panel text-gray-900 dark:text-white rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-white/10 shadow-[0_0_50px_rgba(128,0,32,0.1)] dark:shadow-[0_0_50px_rgba(128,0,32,0.15)]">
                            {/* Modal Header */}
                            <div className="px-8 py-6 flex items-center justify-between bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
                                <h2 className="text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                    Plan Your Journey
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
                                        className="px-6 py-2 rounded-lg bg-[#800020] text-white text-sm font-semibold hover:bg-[#600018] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-maroon/20"
                                    >
                                        Confirm Trip
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

                                    {/* Primary Locations */}
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="group">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 block group-focus-within:text-[#800020] transition-colors">From</label>
                                                <div className="relative">
                                                    <MapPin size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formData.departureCity ? 'text-[#800020]' : 'text-gray-400'}`} />
                                                    <input
                                                        type="text"
                                                        placeholder="Departure City"
                                                        value={formData.departureCity}
                                                        onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-4 pl-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-[#800020]/50 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div className="group">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 block group-focus-within:text-[#800020] transition-colors">To</label>
                                                <div className="relative">
                                                    <Plane size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#800020]" />
                                                    <input
                                                        type="text"
                                                        placeholder="Destination"
                                                        value={formData.destination}
                                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                                        className="w-full text-xl font-medium bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-4 pl-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-[#800020]/50 transition-colors"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trip Type */}
                                        <div className="space-y-3">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Trip Type</label>
                                            <div className="flex flex-wrap gap-3">
                                                {[
                                                    { value: 'oneway', label: 'One Way' },
                                                    { value: 'roundtrip', label: 'Round Trip' },
                                                    { value: 'multicity', label: 'Multi-City' }
                                                ].map((type) => (
                                                    <button
                                                        key={type.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, tripType: type.value as any })}
                                                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all border ${formData.tripType === type.value
                                                            ? 'bg-[#800020] border-[#800020] text-white shadow-lg shadow-maroon/20'
                                                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Departure Date</label>
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                                                    <Calendar size={20} className="text-[#800020]" />
                                                    <input
                                                        type="date"
                                                        value={formData.startDate}
                                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                        className="bg-transparent text-gray-900 dark:text-white font-mono uppercase tracking-wide outline-none w-full dark:[color-scheme:dark]"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {formData.tripType !== 'oneway' && (
                                                <div className="space-y-2">
                                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Return Date</label>
                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                                                        <Calendar size={20} className="text-gray-400" />
                                                        <input
                                                            type="date"
                                                            value={formData.endDate}
                                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                            className="bg-transparent text-gray-900 dark:text-white font-mono uppercase tracking-wide outline-none w-full dark:[color-scheme:dark]"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Transportation & Class */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-white/5">
                                        <div className="space-y-3">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Transportation</label>
                                            <div className="flex flex-wrap gap-3">
                                                {[
                                                    { value: 'flight', icon: Plane, label: 'Flight' },
                                                    { value: 'train', icon: Train, label: 'Train' },
                                                    { value: 'car', icon: Car, label: 'Car' },
                                                    { value: 'bus', icon: Bus, label: 'Bus' }
                                                ].map((mode) => {
                                                    const Icon = mode.icon
                                                    return (
                                                        <button
                                                            key={mode.value}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, transportMode: mode.value as any })}
                                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${formData.transportMode === mode.value
                                                                ? 'bg-[#800020]/10 dark:bg-[#800020]/20 border-[#800020] text-[#800020]'
                                                                : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <Icon size={16} />
                                                            {mode.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Class</label>
                                            <div className="flex flex-wrap gap-3">
                                                {[
                                                    { value: 'economy', icon: Armchair, label: 'Economy' },
                                                    { value: 'business', icon: Briefcase, label: 'Business' },
                                                    { value: 'first', icon: Crown, label: 'First' }
                                                ].map((cls) => {
                                                    const Icon = cls.icon
                                                    return (
                                                        <button
                                                            key={cls.value}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, travelClass: cls.value as any })}
                                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${formData.travelClass === cls.value
                                                                ? 'bg-[#800020]/10 dark:bg-[#800020]/20 border-[#800020] text-[#800020]'
                                                                : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <Icon size={16} />
                                                            {cls.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Travelers & Accommodation */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-white/5">
                                        <div className="space-y-3">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Travelers</label>
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                                <Users size={20} className="text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, travelers: Math.max(1, formData.travelers - 1) })}
                                                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xl font-bold text-gray-900 dark:text-white w-8 text-center">{formData.travelers}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, travelers: formData.travelers + 1 })}
                                                    className="w-8 h-8 rounded-full bg-[#800020] flex items-center justify-center text-white hover:bg-[#600018] transition-colors font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Accommodation</label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, needsAccommodation: !formData.needsAccommodation })}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${formData.needsAccommodation
                                                    ? 'bg-[#800020]/10 dark:bg-[#800020]/20 border-[#800020] text-[#800020]'
                                                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400'
                                                    }`}
                                            >
                                                <Hotel size={20} />
                                                <span className="font-medium">{formData.needsAccommodation ? 'Hotel Needed' : 'No Hotel'}</span>
                                            </button>
                                        </div>

                                        {/* Weather Preview */}
                                        {formData.destination && (
                                            <div className="space-y-3">
                                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Weather Preview</label>
                                                <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
                                                            <CloudSun size={20} className="text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <Thermometer size={14} className="text-orange-500" />
                                                                <span className="font-bold text-gray-900 dark:text-white">28°C</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Partly Cloudy</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1"><Droplets size={12} /> 45%</span>
                                                        <span className="flex items-center gap-1"><Wind size={12} /> 12 km/h</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Flight Search Links */}
                                    {formData.transportMode === 'flight' && formData.destination && (
                                        <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3 block">Search Flights On</label>
                                            <div className="flex flex-wrap gap-3">
                                                {[
                                                    { name: 'MakeMyTrip', url: 'https://www.makemytrip.com' },
                                                    { name: 'Skyscanner', url: 'https://www.skyscanner.com' },
                                                    { name: 'Google Flights', url: 'https://www.google.com/flights' },
                                                    { name: 'Kayak', url: 'https://www.kayak.com' }
                                                ].map((site) => (
                                                    <a
                                                        key={site.name}
                                                        href={site.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-[#800020]/30 transition-all"
                                                    >
                                                        {site.name}
                                                        <ExternalLink size={14} />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Map Preview */}
                                    {formData.destination && (
                                        <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3 block">Destination Map</label>
                                            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg">
                                                <iframe
                                                    title="Destination Map"
                                                    width="100%"
                                                    height="200"
                                                    style={{ border: 0 }}
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    src={`https://www.google.com/maps?q=${encodeURIComponent(formData.destination)}&output=embed`}
                                                />
                                            </div>
                                            <div className="flex gap-3 mt-3">
                                                <a
                                                    href={`https://www.google.com/maps/search/${encodeURIComponent(formData.destination)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                                                >
                                                    Open in Google Maps <ExternalLink size={12} />
                                                </a>
                                                <a
                                                    href={`https://www.google.com/maps/dir/${encodeURIComponent(formData.departureCity || '')}/${encodeURIComponent(formData.destination)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-[#800020]/10 dark:bg-[#800020]/20 border border-[#800020]/30 rounded-lg text-xs font-medium text-[#800020] hover:bg-[#800020]/20 transition-all"
                                                >
                                                    Get Directions <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    <div className="pt-4">
                                        <textarea
                                            placeholder="Add trip notes, itinerary, or special requirements..."
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 p-6 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 border border-gray-200 dark:border-white/5 focus:border-[#800020]/50 focus:outline-none min-h-[100px] resize-none transition-colors"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
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
