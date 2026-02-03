import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface Bill {
    id: string
    title: string
    amount: number
    dueDate: string
    status: 'upcoming' | 'paid' | 'overdue'
    category: string
}

export interface Meeting {
    id: string
    title: string
    date: string
    time: string
    duration: number
    notes?: string
}

export interface Trip {
    id: string
    destination: string
    startDate: string
    endDate: string
    notes?: string
}

export interface HealthReminder {
    id: string
    type: 'water' | 'exercise' | 'medication' | 'habit'
    title: string
    enabled: boolean
    lastLogged?: string
}

export interface Record {
    id: string
    name: string
    type: string
    size: number
    uploadedAt: string
    tags: string[]
}

export interface Notification {
    id: string
    type: 'bill' | 'meeting' | 'travel' | 'health' | 'system'
    title: string
    message: string
    read: boolean
    createdAt: string
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

export interface User {
    email: string
}

interface AppState {
    userName: string
    isAuthenticated: boolean
    user: User | null
    bills: Bill[]
    meetings: Meeting[]
    trips: Trip[]
    healthReminders: HealthReminder[]
    records: Record[]
    notifications: Notification[]
    chatMessages: ChatMessage[]
    sidebarOpen: boolean
    waterIntake: number
    theme: 'light' | 'dark'
}

interface AppContextType extends AppState {
    setUserName: (name: string) => void
    login: (email: string, password: string) => boolean
    logout: () => void
    addBill: (bill: Omit<Bill, 'id'>) => void
    updateBill: (id: string, updates: Partial<Bill>) => void
    deleteBill: (id: string) => void
    addMeeting: (meeting: Omit<Meeting, 'id'>) => void
    deleteMeeting: (id: string) => void
    addTrip: (trip: Omit<Trip, 'id'>) => void
    deleteTrip: (id: string) => void
    toggleHealthReminder: (id: string) => void
    logHealth: (id: string) => void
    addRecord: (record: Omit<Record, 'id' | 'uploadedAt'>) => void
    deleteRecord: (id: string) => void
    markNotificationRead: (id: string) => void
    clearNotification: (id: string) => void
    clearAllNotifications: () => void
    addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
    clearChat: () => void
    startNewChat: () => void
    toggleSidebar: () => void
    addWater: () => void
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void
    toggleTheme: () => void
    setTheme: (theme: 'light' | 'dark') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const generateId = () => Math.random().toString(36).substr(2, 9)

const initialState: AppState = {
    userName: 'User',
    isAuthenticated: false,
    user: null,
    bills: [
        { id: '1', title: 'Home Loan EMI', amount: 25000, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'upcoming', category: 'Loan' },
        { id: '2', title: 'Electricity Bill', amount: 2500, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'upcoming', category: 'Utilities' },
        { id: '3', title: 'Netflix Subscription', amount: 649, dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'paid', category: 'Entertainment' },
    ],
    meetings: [
        { id: '1', title: 'Team Standup', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 30, notes: 'Daily sync' },
        { id: '2', title: 'Client Review', date: new Date().toISOString().split('T')[0], time: '14:00', duration: 60, notes: 'Q1 review' },
        { id: '3', title: 'Project Planning', date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00', duration: 45 },
    ],
    trips: [
        { id: '1', destination: 'Mumbai', startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], notes: 'Business trip' },
    ],
    healthReminders: [
        { id: '1', type: 'water', title: 'Drink Water', enabled: true },
        { id: '2', type: 'exercise', title: 'Morning Walk', enabled: true },
        { id: '3', type: 'medication', title: 'Vitamins', enabled: false },
        { id: '4', type: 'habit', title: 'Meditation', enabled: true },
    ],
    records: [
        { id: '1', name: 'Passport.pdf', type: 'application/pdf', size: 2500000, uploadedAt: new Date().toISOString(), tags: ['travel', 'identity'] },
        { id: '2', name: 'Insurance_Policy.pdf', type: 'application/pdf', size: 1500000, uploadedAt: new Date().toISOString(), tags: ['insurance'] },
    ],
    notifications: [
        { id: '1', type: 'bill', title: 'Bill Reminder', message: 'Home Loan EMI due in 2 days', read: false, createdAt: new Date().toISOString() },
        { id: '2', type: 'meeting', title: 'Meeting Soon', message: 'Team Standup in 30 minutes', read: false, createdAt: new Date().toISOString() },
        { id: '3', type: 'health', title: 'Health Tip', message: 'Remember to drink water!', read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    ],
    chatMessages: [],
    sidebarOpen: true,
    waterIntake: 0,
    theme: 'light',
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>(() => {
        const saved = localStorage.getItem('pragenx-state')
        return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
    })
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null)

    useEffect(() => {
        localStorage.setItem('pragenx-state', JSON.stringify(state))
    }, [state])

    // Apply theme class to HTML element
    useEffect(() => {
        const root = document.documentElement
        if (state.theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [state.theme])

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type })
    }

    const setUserName = (name: string) => setState(s => ({ ...s, userName: name }))

    const login = (email: string, password: string) => {
        if (email === 'user@gmail.com' && password !== '') {
            setState(s => ({ ...s, isAuthenticated: true, user: { email } }))
            showToast('Welcome back!', 'success')
            return true
        }
        showToast('Invalid credentials', 'error')
        return false
    }

    const logout = () => {
        setState(s => ({ ...s, isAuthenticated: false, user: null }))
        showToast('Signed out successfully')
    }

    const addBill = (bill: Omit<Bill, 'id'>) => {
        setState(s => ({ ...s, bills: [...s.bills, { ...bill, id: generateId() }] }))
        showToast('Bill added!')
    }

    const updateBill = (id: string, updates: Partial<Bill>) => {
        setState(s => ({ ...s, bills: s.bills.map(b => b.id === id ? { ...b, ...updates } : b) }))
        showToast('Bill updated!')
    }

    const deleteBill = (id: string) => {
        setState(s => ({ ...s, bills: s.bills.filter(b => b.id !== id) }))
        showToast('Bill deleted!')
    }

    const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
        setState(s => ({ ...s, meetings: [...s.meetings, { ...meeting, id: generateId() }] }))
        showToast('Meeting added!')
    }

    const deleteMeeting = (id: string) => {
        setState(s => ({ ...s, meetings: s.meetings.filter(m => m.id !== id) }))
        showToast('Meeting deleted!')
    }

    const addTrip = (trip: Omit<Trip, 'id'>) => {
        setState(s => ({ ...s, trips: [...s.trips, { ...trip, id: generateId() }] }))
        showToast('Trip added!')
    }

    const deleteTrip = (id: string) => {
        setState(s => ({ ...s, trips: s.trips.filter(t => t.id !== id) }))
        showToast('Trip deleted!')
    }

    const toggleHealthReminder = (id: string) => {
        setState(s => ({
            ...s,
            healthReminders: s.healthReminders.map(h => h.id === id ? { ...h, enabled: !h.enabled } : h)
        }))
    }

    const logHealth = (id: string) => {
        setState(s => ({
            ...s,
            healthReminders: s.healthReminders.map(h => h.id === id ? { ...h, lastLogged: new Date().toISOString() } : h)
        }))
        showToast('Logged!')
    }

    const addRecord = (record: Omit<Record, 'id' | 'uploadedAt'>) => {
        setState(s => ({
            ...s,
            records: [...s.records, { ...record, id: generateId(), uploadedAt: new Date().toISOString() }]
        }))
        showToast('File uploaded!')
    }

    const deleteRecord = (id: string) => {
        setState(s => ({ ...s, records: s.records.filter(r => r.id !== id) }))
        showToast('Record deleted!')
    }

    const markNotificationRead = (id: string) => {
        setState(s => ({
            ...s,
            notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }))
    }

    const clearNotification = (id: string) => {
        setState(s => ({ ...s, notifications: s.notifications.filter(n => n.id !== id) }))
    }

    const clearAllNotifications = () => {
        setState(s => ({ ...s, notifications: [] }))
        showToast('All notifications cleared!')
    }

    const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage = { ...message, id: generateId(), timestamp: new Date().toISOString() }
        setState(s => ({ ...s, chatMessages: [...s.chatMessages, newMessage] }))

        if (message.role === 'user') {
            setTimeout(() => {
                const response = generateAIResponse(message.content, state)
                setState(s => ({
                    ...s,
                    chatMessages: [...s.chatMessages, { id: generateId(), role: 'assistant', content: response, timestamp: new Date().toISOString() }]
                }))
            }, 500)
        }
    }

    const clearChat = () => {
        setState(s => ({ ...s, chatMessages: [] }))
    }

    const startNewChat = () => {
        setState(s => ({
            ...s,
            chatMessages: [{
                id: generateId(),
                role: 'assistant',
                content: 'Hi! I\'m Pragenx. How can I help you today?',
                timestamp: new Date().toISOString()
            }]
        }))
    }

    const toggleSidebar = () => {
        setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen }))
    }

    const addWater = () => {
        setState(s => ({ ...s, waterIntake: s.waterIntake + 1 }))
        showToast('Water logged! 💧')
    }

    const toggleTheme = () => {
        setState(s => {
            const newTheme = s.theme === 'light' ? 'dark' : 'light'
            showToast(`Switched to ${newTheme} mode`, 'info')
            return { ...s, theme: newTheme }
        })
    }

    const setTheme = (theme: 'light' | 'dark') => {
        setState(s => ({ ...s, theme }))
    }

    return (
        <AppContext.Provider value={{
            ...state,
            setUserName,
            login,
            logout,
            addBill,
            updateBill,
            deleteBill,
            addMeeting,
            deleteMeeting,
            addTrip,
            deleteTrip,
            toggleHealthReminder,
            logHealth,
            addRecord,
            deleteRecord,
            markNotificationRead,
            clearNotification,
            clearAllNotifications,
            addChatMessage,
            clearChat,
            startNewChat,
            toggleSidebar,
            addWater,
            showToast,
            toggleTheme,
            setTheme,
        }}>
            {children}
            {toast && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-xl border z-50 animate-fade-in-up flex items-center gap-3 font-medium ${toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
                    toast.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' :
                        'bg-primary-50 border-primary-100 text-primary-900'
                    }`}>
                    {toast.type === 'success' && <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-sm">✓</span>}
                    {toast.message}
                </div>
            )}
        </AppContext.Provider>
    )
}

function generateAIResponse(userMessage: string, state: AppState): string {
    const lower = userMessage.toLowerCase()
    const today = new Date().toISOString().split('T')[0]
    const todayMeetings = state.meetings.filter(m => m.date === today)
    const upcomingBills = state.bills.filter(b => b.status === 'upcoming')

    if (lower.includes('prepare') || lower.includes('day') || lower.includes('today')) {
        let response = `Good morning! Here's your day:\n\n`
        response += `📅 Meetings:\n`
        if (todayMeetings.length > 0) {
            todayMeetings.forEach(m => { response += `• ${m.time} - ${m.title} (${m.duration} min)\n` })
        } else {
            response += `• No meetings today\n`
        }
        response += `\n💰 Bills:\n`
        if (upcomingBills.length > 0) {
            response += `• EMI due in ${Math.ceil((new Date(upcomingBills[0].dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days - ₹${upcomingBills[0].amount.toLocaleString()}\n`
        }
        response += `\n💚 Health:\n• Remember to drink water!\n• Morning walk pending`
        return response
    }

    if (lower.includes('bill') || lower.includes('due')) {
        if (upcomingBills.length === 0) return 'You have no upcoming bills!'
        return `You have ${upcomingBills.length} upcoming bills:\n` + upcomingBills.map(b => `• ${b.title}: ₹${b.amount.toLocaleString()} due ${b.dueDate}`).join('\n')
    }

    if (lower.includes('meeting')) {
        if (todayMeetings.length === 0) return 'No meetings scheduled for today.'
        return `Today's meetings:\n` + todayMeetings.map(m => `• ${m.time} - ${m.title}`).join('\n')
    }

    return `I understand you said: "${userMessage}". I can help you with bills, meetings, travel, health reminders, and more. Try asking "Prepare my day" or "What bills are due?"`
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error('useApp must be used within AppProvider')
    return context
}
