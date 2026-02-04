import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Shield, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useApp()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Add a slight delay for "premium" feel
        setTimeout(() => {
            const success = login(email, password)
            if (success) {
                navigate('/')
            }
            setIsLoading(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-6 transition-colors duration-500">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white dark:bg-dark-card rounded-[1.25rem] shadow-xl flex items-center justify-center border border-gray-100 dark:border-dark-border group transition-all duration-500 hover:scale-110">
                            <img src="/logo-new.png" alt="PragenX Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tighter">PragenX</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your PragenX dashboard</p>
                </div>

                <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-dark-border p-8 lg:p-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400 dark:text-gray-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@gmail.com"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-dark-elevated border-none rounded-2xl focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-300"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-b-2xl" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                                <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400 dark:text-gray-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-dark-elevated border-none rounded-2xl focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-b-2xl" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-1">
                            <input type="checkbox" className="rounded-md border-gray-300 dark:border-dark-border text-primary focus:ring-primary" id="remember" />
                            <label htmlFor="remember" className="text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Remember me for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:translate-y-0"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-dark-border text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Don't have an account? <button className="text-primary font-bold hover:underline">Create Account</button>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-gray-400 dark:text-gray-500 animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Shield size={14} className="text-green-500" /> AES-256 Encryption
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-dark-border" />
                    <button className="text-xs hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Privacy Policy</button>
                    <button className="text-xs hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Terms of Service</button>
                </div>
            </div>
        </div>
    )
}
