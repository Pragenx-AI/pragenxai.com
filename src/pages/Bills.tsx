import { useState, useRef, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, Receipt, Check, Trash2, Mic, MicOff, Search, ArrowUpRight, Wallet, Calendar, PoundSterling } from 'lucide-react'
import { speak, listen } from '../utils/voiceAssistant'

export default function Bills() {
    const { bills, addBill, updateBill, deleteBill, showToast } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [filterCategory, setFilterCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        dueDate: '',
        category: 'Utilities'
    })

    // Stats Calculation
    const stats = useMemo(() => {
        const upcoming = bills.filter(b => b.status === 'upcoming')
        const paid = bills.filter(b => b.status === 'paid')
        return {
            totalUpcoming: upcoming.reduce((sum, b) => sum + b.amount, 0),
            totalPaid: paid.reduce((sum, b) => sum + b.amount, 0),
            upcomingCount: upcoming.length,
            paidCount: paid.length
        }
    }, [bills])

    const filteredBills = useMemo(() => {
        return bills.filter(b => {
            const matchesCategory = filterCategory === 'All' || b.category === filterCategory
            const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [bills, filterCategory, searchQuery])

    const categories = ['All', 'Utilities', 'Loan', 'Entertainment', 'Insurance', 'Other']

    // Voice Assistant State
    const [isVoiceActive, setIsVoiceActive] = useState(false)
    const [voiceStep, setVoiceStep] = useState<'idle' | 'title' | 'amount' | 'date' | 'confirm'>('idle')
    const [voiceTranscript, setVoiceTranscript] = useState('')

    const voiceState = useRef<{
        step: 'idle' | 'title' | 'amount' | 'date' | 'confirm',
        data: { title: string, amount: string, date: string }
    }>({
        step: 'idle',
        data: { title: '', amount: '', date: '' }
    })

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
                voiceState.current.step = 'amount'
                setVoiceStep('amount')
                speak("Got it. How much is the bill amount?", startListening)
                break
            case 'amount':
                const amountMatch = text.match(/\d+/)
                if (amountMatch) {
                    currentData.amount = amountMatch[0]
                    voiceState.current.step = 'date'
                    setVoiceStep('date')
                    speak("And when is the bill due?", startListening)
                } else {
                    speak("I didn't catch the number. Please say the amount again.", startListening)
                }
                break
            case 'date':
                let targetDate = new Date()
                if (text.toLowerCase().includes('tomorrow')) targetDate.setDate(targetDate.getDate() + 1)
                else if (text.toLowerCase().includes('next week')) targetDate.setDate(targetDate.getDate() + 7)
                currentData.date = targetDate.toISOString().split('T')[0]
                voiceState.current.step = 'confirm'
                setVoiceStep('confirm')
                speak(`Confirm adding ${currentData.title} bill for ${currentData.amount} rupees due on ${targetDate.toLocaleDateString()}?`, startListening)
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
        if (!isVoiceActive) return
        setTimeout(() => {
            listen(
                (text) => processVoiceStep(text),
                (err) => console.error("Voice Error:", err)
            )
        }, 500)
    }

    const startVoiceAssistant = () => {
        setIsVoiceActive(true)
        window.speechSynthesis.cancel()
        voiceState.current = { step: 'title', data: { title: '', amount: '', date: '' } }
        setVoiceStep('title')
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
        <div className="h-full overflow-y-auto relative bg-gray-50/50 dark:bg-dark-bg transition-colors duration-300">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Voice Assistant Overlay */}
            {isVoiceActive && (
                <div className="fixed inset-0 bg-black/80 dark:bg-black/90 z-[100] flex flex-col items-center justify-center text-white p-6 backdrop-blur-md animate-in fade-in">
                    <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                        <Mic size={48} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">PragenX Voice</h2>
                    <p className="text-gray-300 mb-8 text-center max-w-md text-xl font-medium">
                        {voiceStep === 'title' && "What is the bill for?"}
                        {voiceStep === 'amount' && "How much is the bill?"}
                        {voiceStep === 'date' && "When is it due?"}
                        {voiceStep === 'confirm' && "Confirm details to save."}
                    </p>
                    {voiceTranscript && (
                        <div className="bg-white/10 px-8 py-4 rounded-[2rem] mb-12 max-w-lg w-full text-center border border-white/10">
                            <p className="text-xl italic opacity-90">"{voiceTranscript}"</p>
                        </div>
                    )}
                    <button onClick={stopVoiceAssistant} className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full font-bold flex items-center gap-3 transition-all transform hover:scale-105">
                        <MicOff size={24} /> Stop Assistant
                    </button>
                </div>
            )}

            {/* Modal Overlay for Add Bill */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-dark-border">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Add New Bill</h3>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-full transition-colors">
                                    <X size={24} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Receipt size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Bill title (e.g. Rent, Internet)"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-dark-elevated border border-gray-100 dark:border-dark-border rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <PoundSterling size={18} />
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-dark-elevated border border-gray-100 dark:border-dark-border rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-dark-elevated border border-gray-100 dark:border-dark-border rounded-2xl py-4 px-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                                            >
                                                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs uppercase">Due</div>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-dark-elevated border border-gray-100 dark:border-dark-border rounded-2xl py-4 pl-16 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-95">
                                    Save Bill
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto p-6 lg:p-10 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Finance Hub</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Keep your payments and budget on track.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={startVoiceAssistant}
                            className="p-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:from-primary-500 hover:to-primary-700 shadow-lg shadow-primary-900/40 hover:scale-105 transition-all duration-300"
                            title="Voice Add"
                        >
                            <Mic size={20} />
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5"
                        >
                            <Plus size={20} />
                            Add New Bill
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-dark-border shadow-sm group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl">
                                <Wallet size={20} />
                            </div>
                            <div className="p-1 px-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-bold">UPCOMING</div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">£{stats.totalUpcoming.toLocaleString()}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{stats.upcomingCount} bills pending</p>
                    </div>

                    <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-dark-border shadow-sm group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl">
                                <Check size={20} />
                            </div>
                            <div className="p-1 px-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-bold">PAID</div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">£{stats.totalPaid.toLocaleString()}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{stats.paidCount} successfully paid</p>
                    </div>

                    <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-[2rem] border border-primary/20 p-2 lg:col-span-2 flex items-center gap-6">
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-primary">Optimization Tip</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                You have {stats.upcomingCount} bills due this month. Consider setting up auto-pay for utilities to avoid late fees.
                            </p>
                        </div>
                        <ArrowUpRight className="text-primary opacity-20" size={48} />
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find a bill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:border-primary outline-none transition-all font-medium shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilterCategory(c)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterCategory === c ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-elevated'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bills List */}
                <div className="space-y-4">
                    {filteredBills.length === 0 ? (
                        <div className="bg-white dark:bg-dark-card border-2 border-dashed border-gray-100 dark:border-dark-border rounded-[2.5rem] py-20 text-center animate-in fade-in duration-700">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-elevated rounded-full flex items-center justify-center mx-auto mb-6">
                                <Receipt className="text-gray-300 dark:text-gray-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No bills found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Try a different search or add a new bill.</p>
                        </div>
                    ) : (
                        filteredBills.sort((a, b) => a.status === 'upcoming' ? -1 : 1).map(bill => (
                            <div
                                key={bill.id}
                                className={`group relative bg-white dark:bg-dark-card border rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 transform hover:-translate-y-1 ${bill.status === 'upcoming' ? 'border-amber-100/50 dark:border-amber-900/30 shadow-lg shadow-gray-100/50 dark:shadow-none hover:border-amber-400 hover:shadow-xl' : 'border-gray-50 dark:border-dark-border opacity-70 border-dashed'}`}
                            >
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${bill.status === 'upcoming' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                                        {bill.status === 'upcoming' ? <Receipt size={28} /> : <Check size={28} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className={`text-xl font-bold tracking-tight truncate ${bill.status === 'paid' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                                            {bill.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5 font-medium">
                                            <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-0.5 bg-gray-50 dark:bg-dark-elevated rounded-md uppercase tracking-wider">{bill.category}</span>
                                            <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                                                <Calendar size={12} />
                                                {bill.status === 'upcoming' ? `Due ${new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : `Paid`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold tracking-tighter ${bill.status === 'upcoming' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                                            £{bill.amount.toLocaleString()}
                                        </div>
                                        {bill.status === 'upcoming' && (
                                            <div className="text-[10px] font-bold text-amber-500 uppercase mt-0.5 animate-pulse">Action Required</div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {bill.status === 'upcoming' && (
                                            <button
                                                onClick={() => updateBill(bill.id, { status: 'paid' })}
                                                className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-600 transition-all transform hover:scale-110 active:scale-95"
                                                title="Mark as Paid"
                                            >
                                                <Check size={20} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteBill(bill.id)}
                                            className="p-3 bg-white dark:bg-dark-elevated text-gray-400 hover:text-red-500 border border-gray-100 dark:border-dark-border rounded-xl transition-all transform hover:scale-110"
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}


