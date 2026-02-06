import { useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Upload, FileText, Download, Trash2, Tag, File, Image, FileArchive, Search, Filter } from 'lucide-react'

export default function Records() {
    const { records, addRecord, deleteRecord } = useApp()
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
        <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-5xl mx-auto p-6 lg:p-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Documents</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your important files and records</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-xl"
                    >
                        <Upload size={20} />
                        <span>Upload File</span>
                    </button>
                </div>

                {/* Minimized Upload Area */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative overflow-hidden bg-white dark:bg-dark-card border-2 border-dashed cursor-pointer transition-all duration-300 mb-8 rounded-2xl p-8 text-center
                        ${isDragging
                            ? 'border-[#800020] bg-red-50/50 dark:bg-red-900/10'
                            : 'border-gray-200 dark:border-white/10 hover:border-[#800020]/50 hover:bg-gray-50/50 dark:hover:bg-white/5'
                        }`}
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            <span className="font-semibold text-[#800020]">Click to upload</span> or drag and drop files here
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            PDF, PNG, JPG, ZIP (max. 10MB)
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* Records List Section */}
                <section>
                    <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-card p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                                <FileText size={16} />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">Your Files ({records.length})</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 text-gray-400 hover:text-[#800020] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
                                <Search size={20} />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-[#800020] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>

                    {records.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <FileText size={48} className="mb-4 text-gray-300" />
                            <p className="text-gray-500">No documents uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {records.map(record => {
                                const Icon = getFileIcon(record.type)
                                return (
                                    <div key={record.id} className="group bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 flex flex-col gap-4 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 flex items-center justify-center group-hover:text-[#800020] transition-colors">
                                                    <Icon size={28} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 mb-1" title={record.name}>{record.name}</h3>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                                                        <span>{formatSize(record.size)}</span>
                                                        <span>•</span>
                                                        <span>{new Date(record.uploadedAt).toLocaleDateString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteRecord(record.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-all opacity-0 group-hover:opacity-100">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5 mt-auto">
                                            <div className="flex gap-2">
                                                {record.tags.map(tag => (
                                                    <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {record.tags.length === 0 && (
                                                    <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#800020] uppercase tracking-wider transition-colors">
                                                        <Tag size={12} /> Add Tag
                                                    </button>
                                                )}
                                            </div>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                                                <Download size={14} /> Download
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
