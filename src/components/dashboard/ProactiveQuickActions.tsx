import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
    Calendar,
    Receipt,
    Clock,
    Plane,
    Activity,
    FileText,
    Settings,
    Sparkles,
    CheckCircle2,
    ChevronDown,
    ChevronUp
} from 'lucide-react'

interface QuickAction {
    label: string
    icon: any
    category: string
}

const ACTIONS: QuickAction[] = [
    // DAILY / GREETING
    { label: "Plan my day", icon: Clock, category: "Daily" },
    { label: "What should I focus on today?", icon: Sparkles, category: "Daily" },
    // BILLS & FINANCE
    { label: "Any bills or EMIs coming up soon?", icon: Receipt, category: "Finance" },
    { label: "Show my upcoming payments", icon: Receipt, category: "Finance" },
    // MEETINGS & WORK
    { label: "Do I have any meetings today?", icon: Calendar, category: "Work" },
    { label: "Are there any meeting conflicts?", icon: Calendar, category: "Work" },
    // TRAVEL
    { label: "Do I have any upcoming trips?", icon: Plane, category: "Travel" },
    { label: "Any travel reminders I should know about?", icon: Plane, category: "Travel" },
    // HEALTH & HABITS
    { label: "Have I logged water today?", icon: Activity, category: "Health" },
    { label: "Remind me to stay hydrated", icon: Activity, category: "Health" },
    // RECORDS & DOCUMENTS
    { label: "Show my recent records", icon: FileText, category: "Records" },
    { label: "Do I need to upload any documents?", icon: FileText, category: "Records" },
    // AI MEMORY / PREFERENCES
    { label: "Remember how I like reminders", icon: Settings, category: "PragenX Memory" },
    { label: "Change my reminder style", icon: Settings, category: "PragenX Memory" },
    // AUTOMATION-STYLE
    { label: "Automatically remind me before bills", icon: CheckCircle2, category: "Automation" },
    { label: "Watch for schedule conflicts", icon: CheckCircle2, category: "Automation" },
    // END-OF-DAY / REFLECTION
    { label: "Give me today’s summary", icon: Clock, category: "Reflection" },
    { label: "Prepare tomorrow’s plan", icon: Clock, category: "Reflection" },
]

export default function ProactiveQuickActions() {
    const { setPendingQuestion } = useApp()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const handleAction = (label: string) => {
        setPendingQuestion(label)
        navigate('/chat')
    }

    const displayedActions = isOpen ? ACTIONS : ACTIONS.slice(0, 3)

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Quick Actions</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {isOpen ? "Explore all proactive assistant actions." : "Here’s what I can help you with right now."}
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm flex items-center gap-2 px-4 group"
                >
                    <span className="text-xs font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                        {isOpen ? "See Less" : `+${ACTIONS.length - 3} More`}
                    </span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedActions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAction(action.label)}
                        className="flex items-center gap-4 p-5 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[1.5rem] text-left hover:border-primary/30 dark:hover:border-primary-light/30 hover:shadow-lg hover:shadow-primary/5 transition-all group animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                        <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <action.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{action.category}</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                {action.label}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}
