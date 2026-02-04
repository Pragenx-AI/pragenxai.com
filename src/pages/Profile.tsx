import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react'

export default function Profile() {
    const { userName, setUserName, showToast, userLocation, setUserLocation } = useApp()
    const [name, setName] = useState(userName)
    const [email, setEmail] = useState('user@pragenxai.com')
    const [phone, setPhone] = useState('+91 98765 43210')
    const [location, setLocalLocation] = useState(userLocation)

    const handleSave = () => {
        setUserName(name)
        setUserLocation(location)
        showToast('Profile updated successfully!')
    }

    return (
        <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>

            <div className="bg-white dark:bg-dark-card rounded-2xl border border-divider dark:border-dark-border p-8 shadow-sm transition-colors duration-300">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full bg-primary-50 dark:bg-primary-900/20 border-4 border-white dark:border-dark-elevated shadow-lg flex items-center justify-center relative overflow-hidden group transition-colors">
                            <span className="text-4xl font-bold text-primary dark:text-primary-400">{name.charAt(0)}</span>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white" />
                            </div>
                        </div>
                        <button className="text-sm text-primary dark:text-primary-400 font-medium hover:underline">
                            Change Photo
                        </button>
                    </div>

                    {/* Form Section */}
                    <div className="flex-1 w-full space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-divider dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-divider dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-divider dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocalLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-divider dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm hover:shadow"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
