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
    integrationId?: string
}

export interface Integration {
    id: string
    name: string
    status: 'Connected' | 'Disconnected'
    iconType: 'Video' | 'Users' | 'MessageSquare' | 'FileText' | 'Phone' | 'Globe' | 'Headphones' | 'Monitor'
    description: string
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

export interface Medication {
    id: string
    name: string
    dosage: string
    frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed'
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    startDate: string
    endDate?: string
    refillDate?: string
    notes?: string
    takenToday: boolean
    streak: number
}

export interface VitalLog {
    id: string
    type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'weight' | 'temperature' | 'oxygen'
    value: string
    unit: string
    timestamp: string
    notes?: string
}

export interface SleepLog {
    id: string
    bedtime: string
    wakeTime: string
    quality: 1 | 2 | 3 | 4 | 5
    duration: number // in minutes
    date: string
    notes?: string
}

export interface MoodLog {
    id: string
    mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible'
    energy: number // 1-100
    stress: 'low' | 'medium' | 'high'
    timestamp: string
    notes?: string
}

export interface ActivityLog {
    id: string
    type: 'bill' | 'meeting' | 'travel' | 'health'
    title: string
    action: string
    timestamp: string
    details?: string
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
    silent?: boolean
}

export interface ChatSession {
    id: string
    title: string
    messages: ChatMessage[]
    lastModified: string
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
    healthLogs: ActivityLog[]
    medications: Medication[]
    vitalLogs: VitalLog[]
    sleepLogs: SleepLog[]
    moodLogs: MoodLog[]
    records: Record[]
    notifications: Notification[]
    chatMessages: ChatMessage[]
    chatSessions: ChatSession[]
    currentSessionId: string | null
    sidebarOpen: boolean
    waterIntake: number
    theme: 'light' | 'dark'
    pendingQuestion: string | null
    userLocation: string
    integrations: Integration[]
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
    addMedication: (medication: Omit<Medication, 'id' | 'takenToday' | 'streak'>) => void
    takeMedication: (id: string) => void
    deleteMedication: (id: string) => void
    logVitals: (vital: Omit<VitalLog, 'id' | 'timestamp'>) => void
    logSleep: (sleep: Omit<SleepLog, 'id'>) => void
    logMood: (mood: Omit<MoodLog, 'id' | 'timestamp'>) => void
    addRecord: (record: Omit<Record, 'id' | 'uploadedAt'>) => void
    deleteRecord: (id: string) => void
    markNotificationRead: (id: string) => void
    clearNotification: (id: string) => void
    clearAllNotifications: () => void
    addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
    clearChat: () => void
    startNewChat: () => void
    loadChatSession: (id: string) => void
    deleteChatSession: (id: string) => void
    toggleSidebar: () => void
    addWater: () => void
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void
    toggleTheme: () => void
    setTheme: (theme: 'light' | 'dark') => void
    setPendingQuestion: (question: string | null) => void
    setUserLocation: (location: string) => void
    updateIntegrationStatus: (id: string, status: 'Connected' | 'Disconnected') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const generateId = () => Math.random().toString(36).substr(2, 9)

const initialState: AppState = {
    userName: 'User',
    isAuthenticated: false,
    user: null,
    bills: [
        { id: '1', title: 'Home Loan EMI', amount: 2500, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'upcoming', category: 'Loan' },
        { id: '2', title: 'Electricity Bill', amount: 150, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'upcoming', category: 'Utilities' },
        { id: '3', title: 'Netflix Subscription', amount: 15, dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'paid', category: 'Entertainment' },
    ],
    meetings: [
        { id: '1', title: 'Team Standup', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 30, notes: 'Daily sync' },
        { id: '2', title: 'Client Review', date: new Date().toISOString().split('T')[0], time: '14:00', duration: 60, notes: 'Q1 review' },
        { id: '3', title: 'Project Planning', date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00', duration: 45 },
    ],
    trips: [],
    healthReminders: [
        { id: '1', type: 'water', title: 'Drink Water', enabled: true },
        { id: '2', type: 'exercise', title: 'Daily Workout', enabled: true },
        { id: '3', type: 'medication', title: 'Vitamin C', enabled: true },
        { id: '4', type: 'habit', title: 'Read a Book', enabled: false },
    ],
    healthLogs: [],
    medications: [
        { id: '1', name: 'Vitamin D3', dosage: '1000 IU', frequency: 'daily', timeOfDay: 'morning', startDate: new Date().toISOString().split('T')[0], takenToday: false, streak: 5, notes: 'Take with breakfast' },
        { id: '2', name: 'Omega-3', dosage: '500mg', frequency: 'daily', timeOfDay: 'evening', startDate: new Date().toISOString().split('T')[0], takenToday: false, streak: 12, notes: 'Take with dinner' },
        { id: '3', name: 'Metformin', dosage: '500mg', frequency: 'twice_daily', timeOfDay: 'morning', startDate: new Date().toISOString().split('T')[0], takenToday: false, streak: 30, notes: 'Take 30 min before meals' },
    ],
    vitalLogs: [],
    sleepLogs: [],
    moodLogs: [],
    records: [
        { id: '1', name: 'Identity_Card.pdf', type: 'application/pdf', size: 1200000, uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), tags: ['Identity', 'Essential'] },
        { id: '2', name: 'Rent_Agreement.pdf', type: 'application/pdf', size: 2500000, uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), tags: ['Home', 'Legal'] },
    ],
    notifications: [],
    chatMessages: [],
    chatSessions: [],
    currentSessionId: null,
    sidebarOpen: true,
    waterIntake: 0,
    theme: 'light',
    pendingQuestion: null,
    userLocation: 'Mumbai, India',
    integrations: [
        { id: 'gmeet', name: 'Google Meet', iconType: 'Video', status: 'Connected', description: 'Schedule and join video calls' },
        { id: 'teams', name: 'Microsoft Teams', iconType: 'Users', status: 'Connected', description: 'Connect with your workplace' },
        { id: 'zoom', name: 'Zoom Meet', iconType: 'Video', status: 'Connected', description: 'Direct scheduling for Zoom calls' },
        { id: 'webex', name: 'Cisco Webex', iconType: 'Video', status: 'Connected', description: 'Enterprise video conferencing' },
        { id: 'skype', name: 'Skype', iconType: 'Video', status: 'Connected', description: 'Video and voice calls' },
        { id: 'goto', name: 'GoTo Meeting', iconType: 'Video', status: 'Connected', description: 'A secure, professional online meeting platform' },
        { id: 'jitsi', name: 'Jitsi Meet', iconType: 'Monitor', status: 'Connected', description: 'An open-source, fully encrypted video solution' },
        { id: 'whereby', name: 'Whereby', iconType: 'Globe', status: 'Connected', description: 'Browser-based meetings with no app download' },
        { id: 'slack_huddles', name: 'Slack Huddles', iconType: 'Headphones', status: 'Connected', description: 'Built-in audio and video calling for teams' },
        { id: 'zoho', name: 'Zoho Meeting', iconType: 'Video', status: 'Connected', description: 'Secure video conferencing and webinar solution' },
        { id: 'lark', name: 'Lark', iconType: 'MessageSquare', status: 'Connected', description: 'A unified workspace for team collaboration' },
        { id: 'bluejeans', name: 'BlueJeans', iconType: 'Video', status: 'Connected', description: 'Enterprise-grade video conferencing platform' },
        { id: 'discord', name: 'Discord', iconType: 'MessageSquare', status: 'Connected', description: 'Frequently used for community and casual chats' },
        { id: 'dialpad', name: 'Dialpad Meetings', iconType: 'Phone', status: 'Connected', description: 'Known for high-quality audio and AI features' },
        { id: 'notion', name: 'Notion', iconType: 'FileText', status: 'Connected', description: 'Sync documentation and notes' }
    ]
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>(() => {
        const saved = localStorage.getItem('pragenx-state-v2')
        return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
    })
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null)

    useEffect(() => {
        localStorage.setItem('pragenx-state-v2', JSON.stringify(state))
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
        setState(s => {
            const bill = s.bills.find(b => b.id === id)
            const newBills = s.bills.map(b => b.id === id ? { ...b, ...updates } : b)
            let newLogs = s.healthLogs

            if (updates.status === 'paid' && bill && bill.status !== 'paid') {
                newLogs = [...newLogs, {
                    id: generateId(),
                    type: 'bill',
                    title: bill.title,
                    action: 'Paid',
                    timestamp: new Date().toISOString(),
                    details: `Amount: £${bill.amount}`
                }]
            }

            return { ...s, bills: newBills, healthLogs: newLogs }
        })
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
        setState(s => {
            const reminder = s.healthReminders.find(h => h.id === id)
            const newReminders = s.healthReminders.map(h => h.id === id ? { ...h, lastLogged: new Date().toISOString() } : h)
            const newLog: ActivityLog = {
                id: generateId(),
                type: 'health',
                title: reminder?.title || 'Health Habit',
                action: 'Logged',
                timestamp: new Date().toISOString(),
                details: reminder?.type ? `Category: ${reminder.type}` : undefined
            }
            return { ...s, healthReminders: newReminders, healthLogs: [...s.healthLogs, newLog] }
        })
        showToast('Logged!')
    }

    const addMedication = (medication: Omit<Medication, 'id' | 'takenToday' | 'streak'>) => {
        setState(s => ({
            ...s,
            medications: [...s.medications, { ...medication, id: generateId(), takenToday: false, streak: 0 }]
        }))
        showToast('Medication added!')
    }

    const takeMedication = (id: string) => {
        setState(s => {
            const med = s.medications.find(m => m.id === id)
            if (!med) return s
            const newMedications = s.medications.map(m =>
                m.id === id ? { ...m, takenToday: true, streak: m.streak + 1 } : m
            )
            const newLog: ActivityLog = {
                id: generateId(),
                type: 'health',
                title: med.name,
                action: 'Taken',
                timestamp: new Date().toISOString(),
                details: `Dosage: ${med.dosage}`
            }
            return { ...s, medications: newMedications, healthLogs: [...s.healthLogs, newLog] }
        })
        showToast('Medication logged!')
    }

    const deleteMedication = (id: string) => {
        setState(s => ({ ...s, medications: s.medications.filter(m => m.id !== id) }))
        showToast('Medication removed')
    }

    const logVitals = (vital: Omit<VitalLog, 'id' | 'timestamp'>) => {
        setState(s => {
            const newVital: VitalLog = { ...vital, id: generateId(), timestamp: new Date().toISOString() }
            const newLog: ActivityLog = {
                id: generateId(),
                type: 'health',
                title: vital.type.replace('_', ' '),
                action: 'Measured',
                timestamp: new Date().toISOString(),
                details: `Value: ${vital.value} ${vital.unit}`
            }
            return { ...s, vitalLogs: [...s.vitalLogs, newVital], healthLogs: [...s.healthLogs, newLog] }
        })
        showToast('Vitals logged!')
    }

    const logSleep = (sleep: Omit<SleepLog, 'id'>) => {
        setState(s => {
            const newSleep: SleepLog = { ...sleep, id: generateId() }
            const newLog: ActivityLog = {
                id: generateId(),
                type: 'health',
                title: 'Sleep',
                action: 'Logged',
                timestamp: new Date().toISOString(),
                details: `Duration: ${Math.floor(sleep.duration / 60)}h ${sleep.duration % 60}m`
            }
            return { ...s, sleepLogs: [...s.sleepLogs, newSleep], healthLogs: [...s.healthLogs, newLog] }
        })
        showToast('Sleep logged!')
    }

    const logMood = (mood: Omit<MoodLog, 'id' | 'timestamp'>) => {
        setState(s => {
            const newMood: MoodLog = { ...mood, id: generateId(), timestamp: new Date().toISOString() }
            const newLog: ActivityLog = {
                id: generateId(),
                type: 'health',
                title: 'Mood',
                action: 'Checked in',
                timestamp: new Date().toISOString(),
                details: mood.mood
            }
            return { ...s, moodLogs: [...s.moodLogs, newMood], healthLogs: [...s.healthLogs, newLog] }
        })
        showToast('Mood logged!')
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
                    chatMessages: [...s.chatMessages, {
                        id: generateId(),
                        role: 'assistant',
                        content: response,
                        timestamp: new Date().toISOString(),
                        silent: message.silent // Propagate silence from user message to response
                    }]
                }))
            }, 500)
        }
    }

    const clearChat = () => {
        setState(s => ({ ...s, chatMessages: [] }))
    }

    const startNewChat = () => {
        setState(s => {
            const updates: Partial<AppState> = {
                chatMessages: [],
                currentSessionId: null
            }

            // Save current session if it has messages
            if (s.chatMessages.length > 0) {
                const firstUserMsg = s.chatMessages.find(m => m.role === 'user')?.content || 'New Conversation'
                const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg

                const newSession: ChatSession = {
                    id: s.currentSessionId || generateId(),
                    title: title,
                    messages: [...s.chatMessages],
                    lastModified: new Date().toISOString()
                }

                if (s.currentSessionId) {
                    updates.chatSessions = s.chatSessions.map(sess => sess.id === s.currentSessionId ? newSession : sess)
                } else {
                    updates.chatSessions = [newSession, ...s.chatSessions]
                }
            }

            return { ...s, ...updates }
        })
    }

    const loadChatSession = (id: string) => {
        setState(s => {
            const session = s.chatSessions.find(sess => sess.id === id)
            if (!session) return s
            return {
                ...s,
                chatMessages: [...session.messages],
                currentSessionId: id
            }
        })
    }

    const deleteChatSession = (id: string) => {
        setState(s => ({
            ...s,
            chatSessions: s.chatSessions.filter(sess => sess.id !== id),
            chatMessages: s.currentSessionId === id ? [] : s.chatMessages,
            currentSessionId: s.currentSessionId === id ? null : s.currentSessionId
        }))
    }

    const toggleSidebar = () => {
        setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen }))
    }

    const addWater = () => {
        setState(s => {
            const newLog: ActivityLog = {
                id: generateId(),
                type: 'health',
                title: 'Drink Water',
                action: 'Logged',
                timestamp: new Date().toISOString(),
                details: `Total today: ${s.waterIntake + 1} glasses`
            }
            return { ...s, waterIntake: s.waterIntake + 1, healthLogs: [...s.healthLogs, newLog] }
        })
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

    const setPendingQuestion = (question: string | null) => {
        setState(s => ({ ...s, pendingQuestion: question }))
    }

    const setUserLocation = (location: string) => {
        setState(s => ({ ...s, userLocation: location }))
    }

    const updateIntegrationStatus = (id: string, status: 'Connected' | 'Disconnected') => {
        setState(s => ({
            ...s,
            integrations: s.integrations.map(i => i.id === id ? { ...i, status } : i)
        }))
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
            addMedication,
            takeMedication,
            deleteMedication,
            logVitals,
            logSleep,
            logMood,
            addRecord,
            deleteRecord,
            markNotificationRead,
            clearNotification,
            clearAllNotifications,
            addChatMessage,
            clearChat,
            startNewChat,
            loadChatSession,
            deleteChatSession,
            toggleSidebar,
            addWater,
            showToast,
            toggleTheme,
            setTheme,
            setPendingQuestion,
            setUserLocation,
            updateIntegrationStatus,
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
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const todayMeetings = state.meetings.filter(m => m.date === today)
    const tomorrowMeetings = state.meetings.filter(m => m.date === tomorrow)
    const upcomingBills = state.bills.filter(b => b.status === 'upcoming')
    const recentRecords = state.records.slice(-3)

    // 0. General / Utility Queries
    if (lower.includes('time now') || lower.includes('current time')) {
        return `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    }
    if (lower.includes('today\'s date') || lower.includes('what is the date')) {
        return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`
    }
    if (lower.includes('thank') || lower.includes('thanks')) {
        return "You're very welcome! Is there anything else I can help you with?"
    }

    // 1. Plan my day / What should I focus on today?
    if (lower.includes('plan my day') || lower.includes('focus on today')) {
        let response = `Here's your plan for today:\n\n`
        if (todayMeetings.length > 0) {
            response += `🗓️ You have ${todayMeetings.length} meetings, starting with ${todayMeetings[0].title} at ${todayMeetings[0].time}.\n`
        } else {
            response += `🗓️ Your calendar is clear today.\n`
        }
        if (upcomingBills.length > 0) {
            response += `💰 Note: ${upcomingBills[0].title} is due in ${Math.ceil((new Date(upcomingBills[0].dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days.\n`
        }
        response += `💧 Focus on staying hydrated; you've logged ${state.waterIntake} glasses so far.`
        return response
    }

    // 2. Any bills or EMIs coming up soon? / Show my upcoming payments
    if (lower.includes('bills or emis') || lower.includes('upcoming payments')) {
        if (upcomingBills.length === 0) return "You're all caught up! No bills or EMIs due soon."
        return `You have ${upcomingBills.length} upcoming payments:\n` +
            upcomingBills.map(b => `• ${b.title}: £${b.amount.toLocaleString()} (Due ${b.dueDate})`).join('\n')
    }

    // 3. Do I have any meetings today? / Are there any meeting conflicts?
    if (lower.includes('meetings today') || lower.includes('meeting conflicts')) {
        if (todayMeetings.length === 0) return "You have no meetings scheduled for today. Enjoy the focus time!"
        const conflicts = todayMeetings.filter((m, i) => todayMeetings.some((m2, j) => i !== j && m.time === m2.time))
        let response = `You have ${todayMeetings.length} meetings today.`
        if (conflicts.length > 0) {
            response += ` I've detected a conflict at ${conflicts[0].time} between ${conflicts[0].title} and others.`
        } else {
            response += " No conflicts detected."
        }
        return response + "\n" + todayMeetings.map(m => `• ${m.time}: ${m.title}`).join('\n')
    }

    // 4. Do I have any upcoming trips? / Any travel reminders I should know about?
    if (lower.includes('upcoming trips') || lower.includes('travel reminders')) {
        if (state.trips.length === 0) return "No upcoming trips found in your schedule."
        return `You have ${state.trips.length} upcoming trip(s):\n` +
            state.trips.map(t => `• ${t.destination}: Starting ${t.startDate}`).join('\n')
    }

    // 5. Have I logged water today? / Remind me to stay hydrated
    if (lower.includes('logged water') || lower.includes('stay hydrated')) {
        return `You've logged ${state.waterIntake} glasses of water today. I'll remind you to take a sip every hour!`
    }

    // 6. Show my recent records / Do I need to upload any documents?
    if (lower.includes('recent records') || lower.includes('upload any documents')) {
        if (state.records.length === 0) return "You haven't uploaded any records yet. You might want to upload your latest insurance or identity docs."
        return `Your recent records:\n` +
            recentRecords.map(r => `• ${r.name} (${r.tags.join(', ')})`).join('\n')
    }

    // 7. Remember how I like reminders / Change my reminder style
    if (lower.includes('like reminders') || lower.includes('reminder style')) {
        return "I've noted your preference for gentle, proactive voice reminders. You can change this anytime in Settings."
    }

    // 8. Automatically remind me before bills / Watch for schedule conflicts
    if (lower.includes('remind me before bills') || lower.includes('watch for schedule conflicts')) {
        return "Smart automation enabled. I will now proactively alert you 48 hours before any bill is due and scan for calendar overlaps daily."
    }

    // 9. Give me today’s summary / Prepare tomorrow’s plan
    if (lower.includes('summary') || lower.includes('tomorrow’s plan')) {
        if (lower.includes('summary')) {
            return `Today's Summary: You completed ${state.waterIntake} hydration logs and had ${todayMeetings.length} meetings. A productive day!`
        } else {
            let resp = `Setting up for tomorrow (${tomorrow}):\n`
            if (tomorrowMeetings.length > 0) {
                resp += `• You have ${tomorrowMeetings.length} meetings scheduled.`
            } else {
                resp += `• Your morning looks quiet and perfect for deep work.`
            }
            return resp
        }
    }

    // Default fallback
    return `That's an interesting question! I don't have a specific answer for "${userMessage}" yet, but I'm learning more every day. In the meantime, I can help you with your bills, meetings, health goals, or show you a summary of your day!`
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error('useApp must be used within AppProvider')
    return context
}
