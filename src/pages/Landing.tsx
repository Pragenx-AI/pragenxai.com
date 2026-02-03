import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Zap, Globe, Cpu, Mic } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Landing() {
    const navigate = useNavigate()
    const { theme } = useApp()

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 selection:bg-primary selection:text-white transition-colors duration-500 overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navigation Header */}
            <header className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                        <img src="/logo-new.png" alt="Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase">Pragenx AI</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#security" className="hover:text-primary transition-colors">Security</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">Enterprise</a>
                    </nav>
                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-dark-border" />
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold hover:text-primary transition-colors px-4 py-2"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-black/10 dark:shadow-white/10"
                    >
                        Join Alpha
                    </button>
                </div>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-20 pb-32 px-6 max-w-7xl mx-auto text-center lg:text-left flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 space-y-8 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase animate-fade-in">
                            <Sparkles size={14} /> Intelligence Beyond Limits
                        </div>

                        <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9] animate-fade-in-up">
                            Your World, <br />
                            <span className="text-primary italic">Autonomous.</span>
                        </h1>

                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg lg:mx-0 mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Experience the next generation of personal productivity. Pragenx AI orchestrates your life, finances, and health with proactive voice intelligence.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                            >
                                Get Started Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-dark-elevated text-gray-900 dark:text-white rounded-2xl font-bold text-lg border border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card transition-all"
                            >
                                Sign Up Now
                            </button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-70">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                <Shield className="text-green-500" size={16} /> Secure
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                <Zap className="text-amber-500" size={16} /> Proactive
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                <Globe className="text-blue-500" size={16} /> Global
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none">
                        <div className="relative aspect-square lg:aspect-[4/5] bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950/20 dark:to-blue-950/20 rounded-[4rem] border border-white/50 dark:border-white/5 shadow-3xl overflow-hidden group">
                            {/* Animated Grid */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                            {/* Floating Dashboard Elements */}
                            <div className="absolute inset-0 p-12 flex flex-col justify-center gap-6">
                                <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-white/10 shadow-xl transform group-hover:-translate-y-2 transition-transform duration-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary"><Mic size={20} /></div>
                                        <div className="w-12 h-1 bg-primary/20 rounded-full" />
                                    </div>
                                    <div className="text-sm font-bold italic opacity-60">"Remind me tomorrow to..."</div>
                                </div>

                                <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-white/10 shadow-xl self-end transform group-hover:translate-y-2 transition-transform duration-700" style={{ transitionDelay: '100ms' }}>
                                    <div className="flex items-center gap-3 mb-2 font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Activity Detected
                                    </div>
                                    <div className="text-lg font-black text-primary">₹25,000</div>
                                    <div className="text-[10px] uppercase font-bold text-gray-400">Home Loan EMI • Paid</div>
                                </div>

                                <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-white/10 shadow-xl transform group-hover:scale-105 transition-transform duration-700" style={{ transitionDelay: '200ms' }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Shield size={20} /></div>
                                        <div className="font-black text-xs uppercase">Health Protocol</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-2/3" />
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-500">Hydration: 6/8 Glasses</div>
                                    </div>
                                </div>
                            </div>

                            {/* Core Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary rounded-full blur-[60px] opacity-20 animate-pulse" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-[2rem] shadow-2xl flex items-center justify-center border border-white/20">
                                <Cpu size={40} className="text-white animate-spin-slow" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Reveal (Minimal) */}
            <footer className="relative z-10 py-20 border-t border-gray-100 dark:border-dark-border text-center">
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-widest">Built for the future of productivity</p>
                <div className="flex justify-center gap-6">
                    <button className="text-xs font-bold text-gray-400 hover:text-primary transition-colors">Privacy</button>
                    <button className="text-xs font-bold text-gray-400 hover:text-primary transition-colors">Terms</button>
                    <button className="text-xs font-bold text-gray-400 hover:text-primary transition-colors">Security</button>
                </div>
            </footer>
        </div>
    )
}
