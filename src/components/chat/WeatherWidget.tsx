import { WeatherData } from '../../context/AppContext'
import { Cloud, CloudRain, Sun } from 'lucide-react'

interface WeatherWidgetProps {
    data: WeatherData
}

export default function WeatherWidget({ data }: WeatherWidgetProps) {

    return (
        <div className="w-full max-w-4xl bg-[#f0f7ff] dark:bg-[#1a1c1e] rounded-[2rem] p-8 mt-4 shadow-sm border border-blue-100/50 dark:border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-4">{data.location}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-semibold tracking-tight text-gray-900 dark:text-white">{data.currentTemp}</span>
                    <span className="text-xl font-medium text-gray-500 dark:text-gray-400">°C / °F</span>
                </div>
                <p className="mt-4 text-gray-900 dark:text-gray-100 font-semibold text-lg">{data.condition}</p>
            </div>

            {/* Daily Forecast */}
            <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4 custom-scrollbar gap-4">
                {data.forecast.map((day, i) => (
                    <div key={i} className={`flex flex-col items-center min-w-[3.5rem] p-2 rounded-xl ${i === 0 ? 'bg-white/50 dark:bg-white/10 shadow-sm' : ''}`}>
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-xs mb-3">{day.day}</span>
                        <div className="mb-3">
                            {day.condition === 'rainy' && <CloudRain size={20} className="text-blue-500" />}
                            {day.condition === 'cloudy' && <Cloud size={20} className="text-gray-400" />}
                            {day.condition === 'sunny' && <Sun size={20} className="text-yellow-500" />}
                            {day.condition === 'partly_cloudy' && <Cloud size={20} className="text-blue-300" />}
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold text-sm">{day.temp}°</span>
                        <span className="text-gray-400 dark:text-gray-500 text-[10px] mt-1">{day.low}°</span>
                    </div>
                ))}
            </div>

            {/* Temperature Graph Placeholder - Simplified SVG to match screenshot style */}
            <div className="relative h-48 w-full mt-4">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        Temperature
                        <svg className="w-3 h-3 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </span>
                </div>

                <div className="relative h-24 w-full">
                    {/* Simplified line graph using SVG */}
                    <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#fca5a5" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,80 L100,75 L200,85 L300,85 L400,90 L500,80 L600,75 L700,75 L800,80"
                            fill="none"
                            stroke="#525252"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M0,80 L100,75 L200,85 L300,85 L400,90 L500,80 L600,75 L700,75 L800,80 V100 H0 Z"
                            fill="url(#gradient)"
                        />
                        {/* Data points */}
                        {[
                            { x: 100, y: 75, t: 9 },
                            { x: 200, y: 85, t: 9 },
                            { x: 300, y: 85, t: 8 },
                            { x: 400, y: 90, t: 8 },
                            { x: 500, y: 80, t: 7 },
                            { x: 600, y: 75, t: 8 },
                            { x: 700, y: 75, t: 10 },
                            { x: 800, y: 80, t: 10 }
                        ].map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r="2.5" fill="black" />
                                <text x={p.x} y={p.y - 12} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#111827">{p.t}°</text>
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Hourly Labels */}
                <div className="flex justify-between items-center mt-6 text-[10px] text-gray-500 font-medium px-4">
                    {['6pm', '9pm', '12am', '3am', '6am', '9am', '12pm', '3pm'].map((time, i) => (
                        <span key={i}>{time}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
