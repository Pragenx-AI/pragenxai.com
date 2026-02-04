import { useApp } from '../../context/AppContext'

export default function GreetingCard() {
    const { userName, bills, meetings, healthReminders } = useApp()

    const getTimeOfDay = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    const today = new Date().toISOString().split('T')[0]
    const upcomingBills = bills.filter(b => b.status === 'upcoming').length
    const todayMeetings = meetings.filter(m => m.date === today).length
    const activeReminders = healthReminders.filter(h => h.enabled).length

    // Build summary text
    const summaryParts = []
    if (upcomingBills > 0) summaryParts.push(`${upcomingBills} bill${upcomingBills > 1 ? 's' : ''}`)
    if (todayMeetings > 0) summaryParts.push(`${todayMeetings} meeting${todayMeetings > 1 ? 's' : ''}`)
    if (activeReminders > 0) summaryParts.push(`${activeReminders} reminder${activeReminders > 1 ? 's' : ''}`)

    const summaryText = summaryParts.length > 0
        ? `You have ${summaryParts.join(', ')} coming up.`
        : 'You\'re all caught up! No pending items.'

    return (
        <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xl font-bold">P</span>
            </div>

            <div className="flex-1 pt-1">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-100">
                    {getTimeOfDay()}, {userName} 👋
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                    I'm <span className="text-primary font-medium">PragenX</span>. I'll help you stay ahead today.
                </p>

                <div className="mt-3 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {summaryText}
                </div>
            </div>
        </div>
    )
}
