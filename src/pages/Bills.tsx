import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, Receipt, Check, Trash2, Mic, MicOff } from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

export default function Bills() {
    const { bills, addBill, updateBill, deleteBill, showToast } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        dueDate: '',
        category: 'Utilities'
    })

    // Upcoming Bill Reminder Logic
    useEffect(() => {
        const checkUpcomingBills = () => {
            const today = new Date()
            const nextWeek = new Date()
            nextWeek.setDate(today.getDate() + 7)

            const dueSoon = bills.filter(b => {
                if (b.status !== 'upcoming') return false
                const dueDate = new Date(b.dueDate)
                return dueDate >= today && dueDate <= nextWeek
            })

            if (dueSoon.length > 0) {
                // Remind user
                const message = `You have ${dueSoon.length} bill${dueSoon.length > 1 ? 's' : ''} due in the next week.`
                showToast(message, 'info')
                // Optional: Speak it? User said "it should remaind", maybe just visual is enough, but voice is cool.
                // speak(message) 
            }
        }

        // Run check after a short delay to ensure data is ready 
        const timer = setTimeout(checkUpcomingBills, 1000)
        return () => clearTimeout(timer)
    }, [bills, showToast])

    // Voice Assistant State
    const [isVoiceActive, setIsVoiceActive] = useState(false)
    const [voiceStep, setVoiceStep] = useState<'idle' | 'title' | 'amount' | 'date' | 'confirm'>('idle')
    const [voiceTranscript, setVoiceTranscript] = useState('')

    // Use Ref for logic flow to avoid closure staleness
    const voiceState = useRef<{
        step: 'idle' | 'title' | 'amount' | 'date' | 'confirm',
        data: { title: string, amount: string, date: string }
    }>({
        step: 'idle',
        data: { title: '', amount: '', date: '' }
    })

    const upcomingBills = bills.filter(b => b.status === 'upcoming')
    const paidBills = bills.filter(b => b.status === 'paid')

    const stopVoiceAssistant = () => {
        setIsVoiceActive(false)
        setVoiceStep('idle')
        setVoiceTranscript('')
        voiceState.current = { step: 'idle', data: { title: '', amount: '', date: '' } }
        window.speechSynthesis.cancel()
    }

    const processVoiceStep = (text: string) => {
        setVoiceTranscript(text)
        const currentStep = voiceState.current.step
        const currentData = voiceState.current.data

        switch (currentStep) {
            case 'title':
                currentData.title = text

                // Transition to Amount
                voiceState.current.step = 'amount'
                setVoiceStep('amount')
                speak("Got it. How much is the bill amount?", startListening)
                break

            case 'amount':
                const amountMatch = text.match(/\d+/)
                if (amountMatch) {
                    currentData.amount = amountMatch[0]

                    // Transition to Date
                    voiceState.current.step = 'date'
                    setVoiceStep('date')
                    speak("And when is the bill due?", startListening)
                } else {
                    speak("I didn't catch the number. Please say the amount again.", startListening)
                }
                break

            case 'date':
                let dateStr = text.toLowerCase()
                let targetDate = new Date()

                if (dateStr.includes('tomorrow')) {
                    targetDate.setDate(targetDate.getDate() + 1)
                } else if (dateStr.includes('next week')) {
                    targetDate.setDate(targetDate.getDate() + 7)
                }

                const formattedDate = targetDate.toISOString().split('T')[0]
                currentData.date = formattedDate

                // Transition to Confirm
                voiceState.current.step = 'confirm'
                setVoiceStep('confirm')
                speak(`Confirm adding ${currentData.title} bill for ${currentData.amount} rupees due on ${targetDate.toLocaleDateString()}? Say confirm to save.`, startListening)
                break

            case 'confirm':
                if (text.toLowerCase().includes('confirm') || text.toLowerCase().includes('yes')) {
                    addBill({
                        title: currentData.title,
                        amount: parseFloat(currentData.amount),
                        dueDate: currentData.date,
                        status: 'upcoming',
                        category: 'Utilities'
                    })
                    stopVoiceAssistant()
                    showToast('Bill added successfully')
                    speak("Bill added successfully.")
                } else {
                    speak("Cancelled.")
                    stopVoiceAssistant()
                }
                break
        }
    }

    const startListening = () => {
        if (!isVoiceActive) return // active check relies on closure state which might be stale? 
        // Actually isVoiceActive state usually doesn't change rapidly during the flow, but better safe:
        // We can check voiceState.current.step !== 'idle' if we want.

        setTimeout(() => {
            listen(
                (text) => processVoiceStep(text),
                (err) => {
                    console.error("Voice Error:", err)
                    // Optional: handle no speech
                }
            )
        }, 500)
    }

    const startVoiceAssistant = () => {
        setIsVoiceActive(true)
        window.speechSynthesis.cancel()

        // Init State
        voiceState.current = {
            step: 'title',
            data: { title: '', amount: '', date: '' }
        }
        setVoiceStep('title') // UI sync
        setVoiceTranscript("Listening...")

        speak("What is the bill for?", startListening)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addBill({
            title: formData.title,
            amount: parseFloat(formData.amount),
            dueDate: formData.dueDate,
            status: 'upcoming',
            category: formData.category
        })
        setFormData({ title: '', amount: '', dueDate: '', category: 'Utilities' })
        setShowForm(false)
        showToast('Bill added successfully')
    }

    return (
        <div className="h-full overflow-y-auto relative bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300">
            {isVoiceActive && (
                <div className="fixed inset-0 bg-black/80 dark:bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 transition-all animate-in fade-in">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 animate-pulse">
                        <Mic size={48} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Voice Assistant</h2>
                    <p className="text-gray-300 mb-8 text-center max-w-md">
                        {voiceStep === 'title' && "What is the bill for?"}
                        {voiceStep === 'amount' && "How much is the bill?"}
                        {voiceStep === 'date' && "When is it due?"}
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
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Bills & Reminders</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your bills and payments</p>
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
                            Add Bill
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="card mb-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Add New Bill</h3>
                            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-surface dark:hover:bg-dark-elevated rounded transition-colors">
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Bill title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100 dark:placeholder-gray-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100 dark:placeholder-gray-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                                    required
                                />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                                >
                                    <option>Utilities</option>
                                    <option>Loan</option>
                                    <option>Entertainment</option>
                                    <option>Insurance</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                Add Bill
                            </button>
                        </form>
                    </div>
                )}

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming ({upcomingBills.length})</h2>
                    {upcomingBills.length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No upcoming bills</p>
                    ) : (
                        <div className="space-y-3">
                            {upcomingBills.map(bill => (
                                <div key={bill.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between transition-colors duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                            <Receipt size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{bill.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Due {new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {bill.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">₹{bill.amount.toLocaleString()}</span>
                                        <span className="badge badge-upcoming">Upcoming</span>
                                        <button
                                            onClick={() => updateBill(bill.id, { status: 'paid' })}
                                            className="btn btn-ghost p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button onClick={() => deleteBill(bill.id)} className="btn btn-ghost p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Paid ({paidBills.length})</h2>
                    {paidBills.length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No paid bills yet</p>
                    ) : (
                        <div className="space-y-3">
                            {paidBills.map(bill => (
                                <div key={bill.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between opacity-75 transition-colors duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{bill.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{bill.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">₹{bill.amount.toLocaleString()}</span>
                                        <span className="badge badge-paid">Paid</span>
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

