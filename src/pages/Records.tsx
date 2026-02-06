import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Upload, FileText, Download, Trash2, Tag, File, Image, FileArchive, Clock, History, Search, Filter, Heart, Receipt, Users, Plane } from 'lucide-react'

export default function Records() {
    const { records, addRecord, deleteRecord, healthLogs } = useApp()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState<'documents' | 'history'>('documents')

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'history') setActiveTab('history')
        else setActiveTab('documents')
    }, [searchParams])
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const getFileIcon = (type: string) => {
        if (type.includes('image')) return Image
        if (type.includes('pdf')) return FileText
        if (type.includes('zip') || type.includes('rar')) return FileArchive
        return File
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'bill': return Receipt
            case 'meeting': return Users
            case 'travel': return Plane
            case 'health': return Heart
            default: return History
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        files.forEach(file => {
            addRecord({
                name: file.name,
                type: file.type,
                size: file.size,
                tags: []
            })
        })
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach(file => {
            addRecord({
                name: file.name,
                type: file.type,
                size: file.size,
                tags: []
            })
        })
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Records & History</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {activeTab === 'documents' ? 'Store and manage your documents' : 'Track your past activities'}
                        </p>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-dark-elevated p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'documents' ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                        >
                            Docs
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                        >
                            History
                        </button>
                    </div>
                </div>

                {activeTab === 'documents' ? (
                    <>
                        {/* Upload Area */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`card bg-white dark:bg-dark-card border-2 border-dashed cursor-pointer transition-colors mb-8 rounded-[2rem] p-8 ${isDragging ? 'border-primary bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-dark-border hover:border-primary dark:hover:border-primary hover:bg-gray-50/50 dark:hover:bg-dark-elevated'
                                }`}
                        >
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Upload className={`text-primary`} size={32} />
                                </div>
                                <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                                    Upload Documents
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Drag and drop or click to browse</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 px-4 py-1.5 bg-gray-100 dark:bg-dark-elevated inline-block rounded-full">PDF, Images, Documents up to 10MB</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Records List */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Documents ({records.length})</h2>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                        <Search size={20} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                        <Filter size={20} />
                                    </button>
                                </div>
                            </div>
                            {records.length === 0 ? (
                                <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-12 rounded-[2rem] flex flex-col items-center">
                                    <FileText size={48} className="mb-4 opacity-20" />
                                    <p>No documents uploaded yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {records.map(record => {
                                        const Icon = getFileIcon(record.type)
                                        return (
                                            <div key={record.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[1.5rem] p-4 flex items-center justify-between transition-all hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-none hover:-translate-y-0.5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-dark-elevated text-gray-600 dark:text-gray-400 flex items-center justify-center">
                                                        <Icon size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{record.name}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span>{formatSize(record.size)}</span>
                                                            <span>•</span>
                                                            <span>{new Date(record.uploadedAt).toLocaleDateString('en-IN')}</span>
                                                        </div>
                                                        {record.tags.length > 0 && (
                                                            <div className="flex gap-1 mt-2">
                                                                {record.tags.map(tag => (
                                                                    <span key={tag} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-elevated rounded-xl transition-colors">
                                                        <Tag size={18} />
                                                    </button>
                                                    <button className="p-2 text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
                                                        <Download size={18} />
                                                    </button>
                                                    <button onClick={() => deleteRecord(record.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Activity Timeline</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock size={16} />
                                <span>Sorted by newest</span>
                            </div>
                        </div>

                        {healthLogs.length === 0 ? (
                            <div className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-20 rounded-[2rem] flex flex-col items-center">
                                <History size={48} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium">No activity history yet</p>
                                <p className="text-sm mt-1">Actions like paying bills or logging health will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-gray-100 dark:before:bg-dark-border pl-2">
                                {healthLogs.slice().reverse().map((log) => {
                                    const Icon = getActivityIcon(log.type)
                                    return (
                                        <div key={log.id} className="relative flex items-start gap-6 group">
                                            <div className={`relative z-10 w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg transition-all group-hover:scale-110 backdrop-blur-md bg-white/10 dark:bg-dark-card/30 ${log.type === 'bill' ? 'border-amber-500/30 text-amber-500' :
                                                log.type === 'health' ? 'border-primary/30 text-primary' :
                                                    log.type === 'meeting' ? 'border-blue-500/30 text-blue-500' :
                                                        'border-gray-500/30 text-gray-500'
                                                }`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex-1 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[1.5rem] p-5 transition-all hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-none">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${log.type === 'bill' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                                        log.type === 'health' ? 'bg-primary-50 text-primary dark:bg-primary-900/20' :
                                                            log.type === 'meeting' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                                'bg-gray-50 text-gray-600'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        {new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                                    {log.action} {log.title}
                                                </h3>
                                                {log.details && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                                                        {log.details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    )
}
