import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Droplets, Heart, Pill, Sparkles, Plus, Check, Mic, MicOff } from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

export default function Health() {
    const { healthReminders, toggleHealthReminder, logHealth, waterIntake, addWater, showToast } = useApp()

    // Voice Assistant State
    const [isVoiceActive, setIsVoiceActive] = useState(false)
    const [voiceTranscript, setVoiceTranscript] = useState('')

    const waterGoal = 8
    const waterProgress = (waterIntake / waterGoal) * 100

    // Proactive Health Reminders
    useEffect(() => {
        const checkHealth = () => {
            const today = new Date().toISOString().split('T')[0]
            if (waterIntake < 4) {
                showToast('Stay hydrated! You have only logged ' + waterIntake + ' glasses today.', 'info')
            }

            const pendingReminders = healthReminders.filter(r => {
                if (!r.enabled || !r.lastLogged) return r.enabled
                const lastDate = new Date(r.lastLogged).toISOString().split('T')[0]
                return lastDate !== today
            })

            if (pendingReminders.length > 0) {
                showToast(`You have ${pendingReminders.length} healthy habits to log today.`, 'info')
            }
        }

        const timer = setTimeout(checkHealth, 2000)
        return () => clearTimeout(timer)
    }, [waterIntake, healthReminders, showToast])

    const getIcon = (type: string) => {
        switch (type) {
            case 'water': return Droplets
            case 'exercise': return Heart
            case 'medication': return Pill
            default: return Sparkles
        }
    }

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
            showToast('Water intake logged via voice')
        } else if (cmd.includes('exercise') || cmd.includes('workout')) {
            const gymReminder = healthReminders.find(r => r.type === 'exercise')
            if (gymReminder) logHealth(gymReminder.id)
            speak("Exercise logged. Great job!", stopVoiceAssistant)
            showToast('Exercise logged via voice')
        } else if (cmd.includes('medication') || cmd.includes('pill') || cmd.includes('medicine')) {
            const medReminder = healthReminders.find(r => r.type === 'medication')
            if (medReminder) logHealth(medReminder.id)
            speak("Medication logged.", stopVoiceAssistant)
            showToast('Medication logged via voice')
        } else {
            speak("I didn't catch that. You can say log water, log exercise, or log medication.", () => {
                setTimeout(startListening, 500)
            })
        }
    }

    const startListening = () => {
        if (!isVoiceActive) return
        listen(
            (text) => processVoiceCommand(text),
            (err) => console.error("Voice Error:", err)
        )
    }

    const startVoiceAssistant = () => {
        setIsVoiceActive(true)
        window.speechSynthesis.cancel()
        setVoiceTranscript("Listening...")
        speak("How can I help with your health tracking? You can log water, exercise, or medication.", startListening)
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300 relative">
            {isVoiceActive && (
                <div className="fixed inset-0 bg-black/80 dark:bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 transition-all animate-in fade-in">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 animate-pulse">
                        <Mic size={48} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Health Assistant</h2>
                    <p className="text-gray-300 mb-8 text-center max-w-md">
                        "Log my water", "Log exercise", "Mark medicine as done"
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Health</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your wellness habits</p>
                    </div>
                    <button
                        onClick={startVoiceAssistant}
                        className="p-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:from-primary-500 hover:to-primary-700 shadow-lg shadow-primary-900/40 hover:scale-105 transition-all duration-300"
                        title="Voice Add"
                    >
                        <Mic size={20} />
                    </button>
                </div>

                {/* Water Tracker */}
                <section className="mb-8">
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${waterIntake >= waterGoal ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                    {waterIntake >= waterGoal ? <Check size={24} /> : <Droplets size={24} />}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Water Intake</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {waterIntake >= waterGoal ? 'Goal completed!' : `${waterIntake} of ${waterGoal} glasses today`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={addWater}
                                disabled={waterIntake >= waterGoal}
                                className={`btn ${waterIntake >= waterGoal ? 'bg-green-600 text-white cursor-default hover:bg-green-600' : 'btn-primary'}`}
                            >
                                {waterIntake >= waterGoal ? (
                                    <>
                                        <Check size={18} className="mr-2" />
                                        Completed
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} className="mr-2" />
                                        Log Glass
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className={`relative h-4 rounded-full overflow-hidden ${waterIntake >= waterGoal ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                            <div
                                className={`absolute inset-y-0 left-0 transition-all duration-500 rounded-full ${waterIntake >= waterGoal ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(waterProgress, 100)}%` }}
                            />
                        </div>

                        {/* Glass indicators */}
                        <div className="flex justify-between mt-4">
                            {Array.from({ length: waterGoal }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-10 rounded-lg flex items-center justify-center transition-colors ${i < waterIntake
                                        ? (waterIntake >= waterGoal ? 'bg-green-500 text-white' : 'bg-blue-500 text-white')
                                        : (waterIntake >= waterGoal ? 'bg-green-50 dark:bg-green-900/10 text-green-200 dark:text-green-800' : 'bg-blue-50 dark:bg-blue-900/10 text-blue-200 dark:text-blue-800')
                                        }`}
                                >
                                    <Droplets size={16} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Health Reminders */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Daily Reminders</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {healthReminders.map(reminder => {
                            const Icon = getIcon(reminder.type)
                            return (
                                <div key={reminder.id} className={`card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 transition-colors duration-300 ${!reminder.enabled && 'opacity-60'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reminder.type === 'water' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                reminder.type === 'exercise' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                    reminder.type === 'medication' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                                        'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                                }`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">{reminder.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{reminder.type}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleHealthReminder(reminder.id)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${reminder.enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-elevated'
                                                }`}
                                        >
                                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${reminder.enabled ? 'left-6' : 'left-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                    {reminder.enabled && (
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => logHealth(reminder.id)}
                                                className="btn btn-secondary text-sm flex-1 dark:bg-dark-elevated dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-border"
                                            >
                                                <Check size={16} className="mr-1" />
                                                Log Done
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>
        </div>
    )
}
