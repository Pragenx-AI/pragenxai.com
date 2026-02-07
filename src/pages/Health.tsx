import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, Medication } from '../context/AppContext'
import {
    Droplets, Heart, Pill, Sparkles, Plus, Check, Mic, MicOff,
    Activity, Moon, Brain, PlusCircle, Trash2, Clock,
    TrendingUp, Info, X
} from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

type HealthTab = 'dashboard' | 'medications' | 'vitals' | 'sleep'

export default function Health() {
    const {
        healthReminders, waterIntake, addWater, showToast,
        medications, takeMedication, deleteMedication, addMedication,
        healthLogs, sleepLogs, moodLogs, setPendingQuestion
    } = useApp()

    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState<HealthTab>('dashboard')
    const [isVoiceActive, setIsVoiceActive] = useState(false)
    const [voiceTranscript, setVoiceTranscript] = useState('')
    const [showAddMedModal, setShowAddMedModal] = useState(false)

    // Form state for new medication
    const [newMedData, setNewMedData] = useState<Omit<Medication, 'id' | 'takenToday' | 'streak'>>({
        name: '',
        dosage: '',
        frequency: 'daily',
        timeOfDay: 'morning',
        startDate: new Date().toISOString().split('T')[0],
        notes: ''
    })

    const waterGoal = 8
    const waterProgress = (waterIntake / waterGoal) * 100

    useEffect(() => {
        const checkHealth = () => {
            const today = new Date().toISOString().split('T')[0]
            if (waterIntake < 4 && activeTab === 'dashboard') {
                showToast('Stay hydrated! You have only logged ' + waterIntake + ' glasses today.', 'info')
            }

            const pendingReminders = healthReminders.filter(r => {
                if (!r.enabled || !r.lastLogged) return r.enabled
                const lastDate = new Date(r.lastLogged).toISOString().split('T')[0]
                return lastDate !== today
            })

            if (pendingReminders.length > 0 && activeTab === 'dashboard') {
                showToast(`You have ${pendingReminders.length} healthy habits to log today.`, 'info')
            }
        }

        const timer = setTimeout(checkHealth, 2000)
        return () => clearTimeout(timer)
    }, [waterIntake, healthReminders, showToast, activeTab])

    const stopVoiceAssistant = () => {
        setIsVoiceActive(false)
        setVoiceTranscript('')
        window.speechSynthesis.cancel()
    }

    const processVoiceCommand = (text: string) => {
        setVoiceTranscript(text)
        const cmd = text.toLowerCase()

        if (cmd.includes('water') || cmd.includes('drank')) {
            addWater()
            speak("Logged one glass of water. Stay hydrated!", stopVoiceAssistant)
        } else if (cmd.includes('medication') || cmd.includes('pill') || cmd.includes('medicine')) {
            const pendingMed = medications.find(m => !m.takenToday)
            if (pendingMed) {
                takeMedication(pendingMed.id)
                speak(`Logged ${pendingMed.name}. Great streak of ${pendingMed.streak + 1} days!`, stopVoiceAssistant)
            } else {
                speak("All your scheduled medications are already logged for today.", stopVoiceAssistant)
            }
        } else {
            speak("I didn't catch that. Try saying log my water or mark my medicine as taken.", () => {
                setTimeout(startListening, 500)
            })
        }
    }

    const startListening = () => {
        if (!isVoiceActive) return
        listen((text) => processVoiceCommand(text), (err) => console.error("Voice Error:", err))
    }

    const startVoiceAssistant = () => {
        setIsVoiceActive(true)
        window.speechSynthesis.cancel()
        setVoiceTranscript("Listening...")
        speak("How can I help with your health tracking?", startListening)
    }

    const handleAddMedication = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMedData.name) return
        addMedication(newMedData)
        setShowAddMedModal(false)
        setNewMedData({
            name: '',
            dosage: '',
            frequency: 'daily',
            timeOfDay: 'morning',
            startDate: new Date().toISOString().split('T')[0],
            notes: ''
        })
    }

    const handleAnalyzePatterns = () => {
        const latestSleep = sleepLogs.length > 0 ? sleepLogs[sleepLogs.length - 1] : null
        const latestMood = moodLogs.length > 0 ? moodLogs[moodLogs.length - 1] : null
        const medsSummary = medications.map(m => `${m.name}: ${m.takenToday ? 'Taken' : 'Pending'}`).join(', ')

        let analysisPrompt = `Can you analyze my health patterns based on the following data?
- Hydration: ${waterIntake} glasses (Goal: ${waterGoal})
- Medication Adherence: ${medsSummary}`

        if (latestSleep) {
            analysisPrompt += `\n- Latest Sleep: ${Math.floor(latestSleep.duration / 60)}h ${latestSleep.duration % 60}m (Quality: ${latestSleep.quality}/5)`
        }

        if (latestMood) {
            analysisPrompt += `\n- Current Mood: ${latestMood.mood} (Energy Level: ${latestMood.energy}%)`
        }

        setPendingQuestion(analysisPrompt)
        navigate('/chat')
    }

    const tabs: { id: HealthTab; label: string; icon: any }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'medications', label: 'Meds', icon: Pill },
        { id: 'vitals', label: 'Vitals', icon: Heart },
        { id: 'sleep', label: 'Sleep', icon: Moon },
    ]

    return (
        <div className="h-full overflow-y-auto bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300 relative">
            {isVoiceActive && (
                <div className="fixed inset-0 bg-black/80 dark:bg-black/90 z-[100] flex flex-col items-center justify-center text-white p-6 transition-all animate-in fade-in">
                    <div className="w-24 h-24 rounded-full bg-[#800020]/20 flex items-center justify-center mb-8 animate-pulse border border-[#800020]/50">
                        <Mic size={48} className="text-[#800020]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Health Assistant</h2>
                    {voiceTranscript && (
                        <div className="bg-white/10 px-6 py-4 rounded-xl mb-8 max-w-lg w-full text-center border border-white/10">
                            <p className="text-lg italic">"{voiceTranscript}"</p>
                        </div>
                    )}
                    <button onClick={stopVoiceAssistant} className="px-6 py-3 bg-[#800020] hover:bg-[#900020] rounded-full font-medium flex items-center gap-2 transition-all">
                        <MicOff size={20} /> Stop Assistant
                    </button>
                </div>
            )}

            {showAddMedModal && (
                <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10">
                        <div className="p-8 bg-gradient-to-br from-[#800020] to-[#500010] text-white">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-bold">Add Medication</h2>
                                <button onClick={() => setShowAddMedModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-white/70 text-sm">Organize your treatment schedule</p>
                        </div>
                        <form onSubmit={handleAddMedication} className="p-8 space-y-6">
                            <div>
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Medication Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newMedData.name}
                                    onChange={e => setNewMedData({ ...newMedData, name: e.target.value })}
                                    placeholder="e.g. Vitamin D3"
                                    className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#800020] transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Dosage</label>
                                    <input
                                        type="text"
                                        required
                                        value={newMedData.dosage}
                                        onChange={e => setNewMedData({ ...newMedData, dosage: e.target.value })}
                                        placeholder="e.g. 500mg"
                                        className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#800020] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Time of Day</label>
                                    <select
                                        value={newMedData.timeOfDay}
                                        onChange={e => setNewMedData({ ...newMedData, timeOfDay: e.target.value as any })}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#800020] transition-all"
                                    >
                                        <option value="morning">Morning</option>
                                        <option value="afternoon">Afternoon</option>
                                        <option value="evening">Evening</option>
                                        <option value="night">Night</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Notes</label>
                                <textarea
                                    value={newMedData.notes}
                                    onChange={e => setNewMedData({ ...newMedData, notes: e.target.value })}
                                    placeholder="e.g. Take with breakfast"
                                    className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#800020] transition-all h-24"
                                />
                            </div>
                            <button type="submit" className="w-full py-4 bg-[#800020] text-white rounded-2xl font-bold shadow-lg shadow-[#800020]/20 hover:bg-[#900020] hover:scale-[1.02] transition-all">
                                Save Medication
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto p-6 lg:p-10">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Health Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Holistic wellness & proactive tracking</p>
                    </div>
                    <button
                        onClick={startVoiceAssistant}
                        className="w-12 h-12 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 flex items-center justify-center text-[#800020] hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
                    >
                        <Mic size={24} />
                    </button>
                </header>

                <div className="flex p-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-2xl mb-8 shadow-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all
                                ${activeTab === tab.id
                                    ? 'bg-[#800020] text-white shadow-lg'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                                            <Droplets size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Hydration</h3>
                                            <p className="text-sm text-gray-500">{waterIntake} / {waterGoal} glasses</p>
                                        </div>
                                    </div>
                                    <button onClick={addWater} className="p-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="relative h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-700 rounded-full"
                                        style={{ width: `${Math.min(waterProgress, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Pill size={20} className="text-[#800020]" />
                                        Next Medication
                                    </h3>
                                    <button onClick={() => setActiveTab('medications')} className="text-xs font-bold text-[#800020] uppercase tracking-wider hover:underline">View All</button>
                                </div>
                                {medications.filter(m => !m.takenToday).length > 0 ? (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl">
                                        <div className="max-w-[60%]">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{medications.filter(m => !m.takenToday)[0].name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{medications.filter(m => !m.takenToday)[0].timeOfDay} • {medications.filter(m => !m.takenToday)[0].dosage}</p>
                                        </div>
                                        <button
                                            onClick={() => takeMedication(medications.filter(m => !m.takenToday)[0].id)}
                                            className="px-4 py-2 bg-[#800020] text-white rounded-xl text-xs font-bold hover:bg-[#900020] transition-all shadow-md"
                                        >
                                            Take Now
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl">
                                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                            <Check size={18} />
                                        </div>
                                        <p className="text-sm font-medium text-green-700 dark:text-green-400">All meds taken today!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Activity size={20} className="text-[#800020]" />
                                Health Activity Log
                            </h3>
                            <div className="space-y-4">
                                {healthLogs.filter(log => log.type === 'health').length === 0 ? (
                                    <div className="text-center py-10">
                                        <Sparkles size={40} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                                        <p className="text-gray-400 dark:text-gray-500">No health logs recorded today</p>
                                    </div>
                                ) : (
                                    healthLogs
                                        .filter(log => log.type === 'health')
                                        .slice(-5)
                                        .reverse()
                                        .map(log => (
                                            <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-50 dark:border-white/5 hover:border-[#800020]/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-dark-elevated text-[#800020] flex items-center justify-center shadow-sm">
                                                        <Check size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{log.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{log.action} • {log.details}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400">
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'medications' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Medications</h2>
                            <button
                                onClick={() => setShowAddMedModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#800020] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#800020]/20 hover:scale-105 transition-all"
                            >
                                <Plus size={18} /> Add New
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {medications.map(med => (
                                <div key={med.id} className="group p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-[#800020]/5 transition-all relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${med.takenToday ? 'bg-green-500' : 'bg-[#800020]'}`} />

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${med.takenToday ? 'bg-green-50 dark:bg-green-900/10 text-green-500' : 'bg-[#800020]/5 dark:bg-[#800020]/10 text-[#800020]'}`}>
                                                <Pill size={28} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{med.name}</h3>
                                                    {med.takenToday && <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-100 dark:border-green-800/30">Taken</span>}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300 font-semibold"><Clock size={12} /> {med.timeOfDay.charAt(0).toUpperCase() + med.timeOfDay.slice(1)}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Info size={12} /> {med.dosage}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-[#800020] dark:text-[#a00020] font-bold">🔥 {med.streak} day streak</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => deleteMedication(med.id)}
                                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                disabled={med.takenToday}
                                                onClick={() => takeMedication(med.id)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md
                                                    ${med.takenToday
                                                        ? 'bg-gray-100 dark:bg-dark-elevated text-gray-400 cursor-default'
                                                        : 'bg-[#800020] text-white hover:bg-[#900020] hover:-translate-y-0.5 shadow-[#800020]/20'}`}
                                            >
                                                <Check size={18} />
                                                {med.takenToday ? 'Completed' : 'Take Now'}
                                            </button>
                                        </div>
                                    </div>
                                    {med.notes && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-start gap-2 text-xs text-gray-500 italic font-medium">
                                            <Info size={14} className="mt-0.5 shrink-0" />
                                            <p>{med.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'vitals' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
                                { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10' },
                                { label: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                            ].map((vital, i) => (
                                <div key={i} className="p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm text-center">
                                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${vital.bg} ${vital.color} flex items-center justify-center shadow-inner`}>
                                        <vital.icon size={24} />
                                    </div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{vital.label}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{vital.value}</span>
                                        <span className="text-xs text-gray-400 font-bold uppercase">{vital.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <TrendingUp size={20} className="text-[#800020]" />
                                    Vitals History
                                </h3>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-all">
                                    <PlusCircle size={16} /> Log Measurement
                                </button>
                            </div>
                            <div className="h-48 flex items-end justify-between gap-4 px-2">
                                {[35, 45, 30, 60, 40, 55, 50].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                        <div className="w-full bg-gray-50 dark:bg-white/5 rounded-t-xl group relative cursor-pointer h-32 flex items-end overflow-hidden">
                                            <div
                                                className="w-full bg-[#800020] opacity-30 group-hover:opacity-60 transition-all rounded-t-lg"
                                                style={{ height: `${h}%` }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="bg-gray-900 dark:bg-white text-white dark:text-black py-1 px-2 rounded text-[10px] font-bold">{70 + h}bpm</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Day {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sleep' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-primary/5 text-primary flex items-center justify-center shadow-inner">
                                    <Moon size={32} />
                                </div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Last Night's Sleep</h3>
                                <div className="flex items-baseline justify-center gap-1 mb-4">
                                    <span className="text-4xl font-black text-gray-900 dark:text-white">7h 23m</span>
                                </div>
                                <div className="flex justify-center gap-1 mb-6">
                                    {[1, 2, 3, 4].map(s => <Sparkles key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                                    <Sparkles size={16} className="text-gray-200 dark:text-gray-700" />
                                </div>
                                <button
                                    onClick={handleAnalyzePatterns}
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                                >
                                    Analyze Patterns
                                </button>
                            </div>

                            <div className="p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-sm">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Brain size={20} className="text-[#800020]" />
                                    Today's Mood
                                </h3>
                                <div className="grid grid-cols-5 gap-3 mb-8">
                                    {['😊', '🙂', '😐', '🙁', '😢'].map((emoji, i) => (
                                        <button key={i} className="aspect-square rounded-2xl bg-transparent text-2xl flex items-center justify-center hover:scale-125 hover:drop-shadow-xl transition-all duration-300 focus:outline-none active:scale-95 group">
                                            <span className="filter grayscale-[0.2] group-hover:grayscale-0 transition-all">{emoji}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                                        <span>Energy Level</span>
                                        <span className="text-[#800020]">70%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full">
                                        <div className="h-full w-[70%] bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

