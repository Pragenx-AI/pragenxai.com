import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Upload, FileText, Download, Trash2, Tag, File, Image, FileArchive } from 'lucide-react'

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
        <div className="h-full overflow-y-auto bg-gray-50/30 dark:bg-dark-bg transition-colors duration-300">
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Records</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Store and manage your documents</p>
                </div>

                {/* Upload Area */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`card bg-white dark:bg-dark-card border-2 border-dashed cursor-pointer transition-colors mb-8 rounded-2xl p-6 ${isDragging ? 'border-primary bg-primary-50 dark:bg-primary-900/20' : 'border-divider dark:border-dark-border hover:border-primary dark:hover:border-primary hover:bg-surface dark:hover:bg-dark-elevated'
                        }`}
                >
                    <div className="py-8 text-center">
                        <Upload className={`mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`} size={40} />
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="text-primary font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">PDF, Images, Documents up to 10MB</p>
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
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Documents ({records.length})</h2>
                    {records.length === 0 ? (
                        <p className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 text-center py-8 rounded-2xl transition-colors duration-300">No documents uploaded yet</p>
                    ) : (
                        <div className="space-y-3">
                            {records.map(record => {
                                const Icon = getFileIcon(record.type)
                                return (
                                    <div key={record.id} className="card bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-4 flex items-center justify-between transition-colors duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary flex items-center justify-center">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">{record.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatSize(record.size)} • {new Date(record.uploadedAt).toLocaleDateString('en-IN')}
                                                </p>
                                                {record.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {record.tags.map(tag => (
                                                            <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-dark-elevated text-gray-600 dark:text-gray-400 text-xs rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="btn btn-ghost p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-elevated">
                                                <Tag size={18} />
                                            </button>
                                            <button className="btn btn-ghost p-2 text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20">
                                                <Download size={18} />
                                            </button>
                                            <button onClick={() => deleteRecord(record.id)} className="btn btn-ghost p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 size={18} />
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
