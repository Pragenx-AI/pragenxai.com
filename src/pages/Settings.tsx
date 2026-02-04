import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { User, Bell, Clock, Shield, ChevronRight, Save, Mic, MicOff, Volume2, Sun, Moon, Palette, MapPin, BookOpen, Info, HelpCircle } from 'lucide-react'

export default function Settings() {
    const { userName, setUserName, showToast, theme, setTheme, userLocation, setUserLocation } = useApp()
    const [name, setName] = useState(userName)
    const [location, setLocalLocation] = useState(userLocation)
    const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        voiceEnabled: true,
        voiceResponses: true,
        reminderTime: '09:00',
        billReminder: '2',
        meetingReminder: '15'
    })

    // Check microphone permission on mount
    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
                setMicPermission(result.state as 'granted' | 'denied' | 'prompt')
                result.onchange = () => {
                    setMicPermission(result.state as 'granted' | 'denied' | 'prompt')
                }
            }).catch(() => {
                // Permission API not supported
            })
        }
    }, [])

    const handleSaveProfile = () => {
        setUserName(name)
        setUserLocation(location)
        showToast('Profile updated!', 'success')
    }

    const handleSaveNotifications = () => {
        showToast('Notification preferences saved!', 'success')
    }

    const requestMicPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach(track => track.stop())
            setMicPermission('granted')
            showToast('Microphone access granted!', 'success')
        } catch {
            setMicPermission('denied')
            showToast('Microphone access denied', 'error')
        }
    }

    const testVoice = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Hello! I am PragenX, your personal assistant.')
            utterance.lang = 'en-US'
            window.speechSynthesis.speak(utterance)
        }
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your preferences</p>
                </div>

                {/* Profile Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <User size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
                                <p className="text-gray-500 dark:text-gray-400">PragenX User</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input max-w-md dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                                    placeholder="Your name"
                                />
                            </div>
                            <button onClick={handleSaveProfile} className="btn btn-primary">
                                <Save size={18} className="mr-2" />
                                Save Profile
                            </button>
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Palette size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Theme</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your preferred appearance</p>
                            <div className="flex gap-4">
                                {/* Light Theme Option */}
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${theme === 'light'
                                        ? 'border-primary bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-3 rounded-full ${theme === 'light'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-dark-elevated text-gray-500 dark:text-gray-400'
                                            }`}>
                                            <Sun size={24} />
                                        </div>
                                        <span className={`font-medium ${theme === 'light'
                                            ? 'text-primary'
                                            : 'text-gray-700 dark:text-gray-300'
                                            }`}>Light</span>
                                        {/* Theme Preview */}
                                        <div className="w-full h-16 rounded-lg bg-white border border-gray-200 overflow-hidden">
                                            <div className="h-3 bg-gray-100 border-b border-gray-200"></div>
                                            <div className="p-2 flex gap-1">
                                                <div className="w-8 h-4 rounded bg-gray-100"></div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-1.5 bg-gray-100 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Deep Dark Theme Option */}
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${theme === 'dark'
                                        ? 'border-primary bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-3 rounded-full ${theme === 'dark'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-dark-elevated text-gray-500 dark:text-gray-400'
                                            }`}>
                                            <Moon size={24} />
                                        </div>
                                        <span className={`font-medium ${theme === 'dark'
                                            ? 'text-primary'
                                            : 'text-gray-700 dark:text-gray-300'
                                            }`}>Deep Dark</span>
                                        {/* Theme Preview */}
                                        <div className="w-full h-16 rounded-lg bg-[#0a0a0f] border border-[#2d2d41] overflow-hidden">
                                            <div className="h-3 bg-[#12121c] border-b border-[#2d2d41]"></div>
                                            <div className="p-2 flex gap-1">
                                                <div className="w-8 h-4 rounded bg-[#1c1c2a]"></div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="h-1.5 bg-[#2d2d41] rounded w-3/4"></div>
                                                    <div className="h-1.5 bg-[#1c1c2a] rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Voice Assistant Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Mic size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Voice Assistant</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 space-y-6 transition-colors duration-300">
                        {/* Microphone Permission */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Microphone Permission</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {micPermission === 'granted' ? 'Access granted' :
                                        micPermission === 'denied' ? 'Access denied - enable in browser settings' :
                                            'Permission required for voice features'}
                                </p>
                            </div>
                            {micPermission === 'granted' ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <Mic size={20} />
                                    <span className="text-sm font-medium">Enabled</span>
                                </div>
                            ) : micPermission === 'denied' ? (
                                <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                                    <MicOff size={20} />
                                    <span className="text-sm font-medium">Blocked</span>
                                </div>
                            ) : (
                                <button onClick={requestMicPermission} className="btn btn-primary text-sm">
                                    Enable Microphone
                                </button>
                            )}
                        </div>

                        {/* Voice Enabled Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Voice Commands</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Enable voice input for commands</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, voiceEnabled: !settings.voiceEnabled })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.voiceEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-elevated'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.voiceEnabled ? 'left-6' : 'left-0.5'
                                    }`} />
                            </button>
                        </div>

                        {/* Voice Responses Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Voice Responses</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">PragenX speaks responses aloud</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, voiceResponses: !settings.voiceResponses })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.voiceResponses ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-elevated'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.voiceResponses ? 'left-6' : 'left-0.5'
                                    }`} />
                            </button>
                        </div>

                        {/* Test Voice */}
                        <button onClick={testVoice} className="btn btn-secondary dark:bg-dark-elevated dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-border">
                            <Volume2 size={18} className="mr-2" />
                            Test Voice Output
                        </button>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 space-y-6 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive reminders via email</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-elevated'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.emailNotifications ? 'left-6' : 'left-0.5'
                                    }`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Get alerts on your device</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-elevated'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.pushNotifications ? 'left-6' : 'left-0.5'
                                    }`} />
                            </button>
                        </div>
                        <button onClick={handleSaveNotifications} className="btn btn-secondary dark:bg-dark-elevated dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-border">
                            Save Preferences
                        </button>
                    </div>
                </section>

                {/* Reminder Timing Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reminder Timing</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 space-y-4 transition-colors duration-300">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Reminder Time</label>
                            <input
                                type="time"
                                value={settings.reminderTime}
                                onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                                className="input max-w-xs dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bill Reminder (days before)</label>
                            <select
                                value={settings.billReminder}
                                onChange={(e) => setSettings({ ...settings, billReminder: e.target.value })}
                                className="input max-w-xs dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                            >
                                <option value="1">1 day before</option>
                                <option value="2">2 days before</option>
                                <option value="3">3 days before</option>
                                <option value="7">1 week before</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Reminder (minutes before)</label>
                            <select
                                value={settings.meetingReminder}
                                onChange={(e) => setSettings({ ...settings, meetingReminder: e.target.value })}
                                className="input max-w-xs dark:bg-dark-elevated dark:border-dark-border dark:text-gray-100"
                            >
                                <option value="5">5 minutes</option>
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Location Preferences Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Location Preferences</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your City/Region</label>
                                <div className="relative max-w-md">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocalLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-divider dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary outline-none transition-all"
                                        placeholder="e.g. Mumbai, India"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Used for weather, local reminders, and timezone-aware scheduling.</p>
                            </div>
                            <button onClick={handleSaveProfile} className="btn btn-primary">
                                <Save size={18} className="mr-2" />
                                Save Location
                            </button>
                        </div>
                    </div>
                </section>

                {/* Application Documentation Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Documentation & Help</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Info size={18} className="text-primary" />
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Getting Started</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    PragenX is your personal proactive assistant. Use the sidebar to navigate between your Dashboard, Bills, Meetings, Health tracking, and our GPT-powered Chat.
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Mic size={18} className="text-primary" />
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Voice Assistant</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                                    Speak naturally to PragenX. Tap the microphone icon anywhere to ask questions like:
                                </p>
                                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc pl-5">
                                    <li>"What bills are due this week?"</li>
                                    <li>"Plan my day for me."</li>
                                    <li>"Show my upcoming travel plans."</li>
                                    <li>"Log my water intake."</li>
                                </ul>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <HelpCircle size={18} className="text-primary" />
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Key Features</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl border border-divider dark:border-dark-border">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Bills & Finance</h4>
                                        <p className="text-[11px] text-gray-500">Track EMIs and utilities with proactive reminders before due dates.</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl border border-divider dark:border-dark-border">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Health Hub</h4>
                                        <p className="text-[11px] text-gray-500">Monitor hydration, lifestyle habits, and get health-focused nudges.</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl border border-divider dark:border-dark-border">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Timeline View</h4>
                                        <p className="text-[11px] text-gray-500">A unified chronological view of your day's tasks and events.</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl border border-divider dark:border-dark-border">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Cloud Records</h4>
                                        <p className="text-[11px] text-gray-500">Securely store and tag your essential identity and legal documents.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-divider dark:border-dark-border">
                                <button className="w-full flex items-center justify-between py-2 text-primary font-medium hover:underline transition-colors">
                                    <span>View Full Step-by-Step Guide</span>
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Privacy Section */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={20} className="text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Privacy & Data</h2>
                    </div>
                    <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 transition-colors duration-300">
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between py-3 border-b border-divider dark:border-dark-border hover:text-primary transition-colors">
                                <span className="text-gray-900 dark:text-gray-100">Export Your Data</span>
                                <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
                            </button>
                            <button className="w-full flex items-center justify-between py-3 border-b border-divider dark:border-dark-border hover:text-primary transition-colors">
                                <span className="text-gray-900 dark:text-gray-100">Clear Local Data</span>
                                <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
                            </button>
                            <button className="w-full flex items-center justify-between py-3 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                <span className="text-red-600 dark:text-red-400">Delete Account</span>
                                <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-divider dark:border-dark-border text-center text-sm text-gray-400 dark:text-gray-500">
                    <p>PragenX v1.0.0</p>
                    <p className="mt-1">© 2026 PragenX. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}
