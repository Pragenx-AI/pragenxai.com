import { useRef, useState, useEffect } from 'react'
import { useApp, Record } from '../context/AppContext'
import {
    Upload, FileText, Download, Trash2, Tag, File, Image, FileArchive,
    Search, Share2, Edit2, X, MoreVertical,
    Folder, Video, Music, Monitor, LayoutGrid, List as ListIcon
} from 'lucide-react'

export default function Records() {
    const { records, addRecord, deleteRecord, updateRecord, shareRecord } = useApp()
    const [isDragging, setIsDragging] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('All Files')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState('')
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    const handleMenuClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setOpenMenuId(openMenuId === id ? null : id)
    }

    const categories = [
        { id: 'All Files', icon: Folder, count: records.length },
        { id: 'Personal', icon: FileText, count: records.filter(r => r.category === 'Personal').length },
        { id: 'ID', icon: Tag, count: records.filter(r => r.category === 'ID').length },
        { id: 'Bill', icon: FileText, count: records.filter(r => r.category === 'Bill').length },
        { id: 'Travel', icon: Image, count: records.filter(r => r.category === 'Travel').length },
        { id: 'Work', icon: Monitor, count: records.filter(r => r.category === 'Work').length },
        { id: 'Education', icon: File, count: records.filter(r => r.category === 'Education').length },
    ]

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const getFileIcon = (type: string) => {
        if (type.includes('image')) return Image
        if (type.includes('pdf')) return FileText
        if (type.includes('video')) return Video
        if (type.includes('audio')) return Music
        if (type.includes('zip') || type.includes('rar')) return FileArchive
        return File
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        handleFiles(files)
    }

    const handleFiles = (files: File[]) => {
        files.forEach(file => {
            // Determine category based on file name or type primarily for demo, 
            // but default to 'Personal' or current selected category if valid
            let category: any = 'Personal'
            if (selectedCategory !== 'All Files') category = selectedCategory

            // Auto-categorize based on keywords (Demo feature)
            const name = file.name.toLowerCase()
            if (name.includes('passport') || name.includes('license')) category = 'ID'
            if (name.includes('bill') || name.includes('invoice')) category = 'Bill'
            if (name.includes('ticket') || name.includes('hotel')) category = 'Travel'
            if (name.includes('project') || name.includes('work')) category = 'Work'

            addRecord({
                name: file.name,
                type: file.type,
                size: file.size,
                tags: [],
                category: category
            })
        })
    }

    const startRename = (record: Record) => {
        setRenamingId(record.id)
        setRenameValue(record.name)
    }

    const saveRename = () => {
        if (renamingId && renameValue.trim()) {
            updateRecord(renamingId, { name: renameValue.trim() })
            setRenamingId(null)
            setRenameValue('')
        }
    }

    const filteredRecords = records.filter(record => {
        const matchesCategory = selectedCategory === 'All Files' || record.category === selectedCategory
        const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesCategory && matchesSearch
    })

    return (
        <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">
            {/* Sidebar Categories */}
            <aside className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-black border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/10 p-4 overflow-x-auto lg:overflow-y-auto">
                <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">


                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2 hidden lg:block">Categories</h3>
                    {categories.map(cat => {
                        const Icon = cat.icon
                        const isActive = selectedCategory === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-[#800020]/5 text-[#800020] dark:bg-[#800020]/20 dark:text-white'
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={isActive ? 'text-[#800020] dark:text-[#ff4d6d]' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500'} />
                                    <span className="font-medium text-sm">{cat.id}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-[#800020]/10 dark:bg-[#800020]/30' : 'bg-gray-100 dark:bg-white/5'}`}>
                                    {cat.count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="flex-shrink-0 p-6 border-b border-gray-100 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {selectedCategory}
                                <span className="text-gray-400 font-normal text-lg">/</span>
                                <span className="text-gray-400 text-lg font-normal">{filteredRecords.length} items</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search files..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-[#800020] focus:bg-white dark:focus:bg-black rounded-xl outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 shadow-sm text-[#800020] dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-white/10 shadow-sm text-[#800020] dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <ListIcon size={18} />
                                </button>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="lg:hidden p-3 bg-[#800020] text-white rounded-xl shadow-lg"
                            >
                                <Upload size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {/* Drag Drop Zone (minimized if filteredRecords > 0) */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => filteredRecords.length === 0 && fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center
                            ${filteredRecords.length === 0 ? 'py-20 cursor-pointer mb-0 h-full' : 'py-8 mb-8 cursor-default'}
                            ${isDragging
                                ? 'border-[#800020] bg-red-50/50 dark:bg-red-900/10 scale-[1.02]'
                                : 'border-gray-200 dark:border-white/10 hover:border-[#800020]/30'
                            }
                        `}
                    >
                        <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
                        {filteredRecords.length === 0 ? (
                            <>
                                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Files</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                                    Drag and drop files here, or click to browse.
                                    <br />Supports images, documents, video, and audio.
                                </p>
                                <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }} className="btn btn-primary px-8 py-3 rounded-xl bg-[#800020] text-white font-bold hover:shadow-lg shadow-[#800020]/20 transition-all">
                                    Browse Files
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex items-center justify-between px-6">
                                <span className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                    <Upload size={16} />
                                    Drop files anywhere to upload
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#800020] text-white rounded-xl font-bold hover:bg-[#a00028] transition-colors shadow-lg shadow-[#800020]/20 text-sm"
                                >
                                    <Upload size={16} />
                                    <span>Upload File</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Files Grid/List */}
                    {filteredRecords.length > 0 && (
                        <div className={`
                            ${viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 guide-cols-4 gap-6'
                                : 'flex flex-col gap-3'
                            }
                        `}>
                            {filteredRecords.map(record => {
                                const Icon = getFileIcon(record.type)
                                const isRenaming = renamingId === record.id

                                if (viewMode === 'list') {
                                    return (
                                        <div key={record.id} className="group flex items-center gap-4 p-4 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[#800020]">
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {isRenaming ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            autoFocus
                                                            className="bg-white dark:bg-black border border-[#800020] rounded px-2 py-1 text-sm outline-none w-full max-w-[200px]"
                                                            value={renameValue}
                                                            onChange={(e) => setRenameValue(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') saveRename()
                                                                if (e.key === 'Escape') setRenamingId(null)
                                                            }}
                                                            onBlur={saveRename}
                                                        />
                                                    </div>
                                                ) : (
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-[#800020]" onClick={() => setSelectedRecord(record)}>
                                                        {record.name}
                                                    </h3>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                                    <span>{formatSize(record.size)}</span>
                                                    <span>•</span>
                                                    <span>{new Date(record.uploadedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => shareRecord(record.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 hover:text-[#800020]" title="Share">
                                                    <Share2 size={16} />
                                                </button>
                                                <button onClick={() => startRename(record)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 hover:text-[#800020]" title="Rename">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => deleteRecord(record.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-500" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 hover:text-[#800020]" title="Download">
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }

                                // Grid View
                                return (
                                    <div key={record.id} className="group bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 rounded-[1.5rem] p-6 flex flex-col hover:shadow-xl hover:shadow-[#800020]/5 dark:hover:shadow-[0_0_30px_rgba(128,0,32,0.1)] transition-all duration-300 relative overflow-visible">
                                        <div className="absolute top-4 right-4 z-20">
                                            <button
                                                onClick={(e) => handleMenuClick(e, record.id)}
                                                className="p-2 text-gray-400 hover:text-[#800020] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openMenuId === record.id && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); shareRecord(record.id); setOpenMenuId(null); }}
                                                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3"
                                                    >
                                                        <Share2 size={16} /> Share
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); startRename(record); setOpenMenuId(null); }}
                                                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3"
                                                    >
                                                        <Edit2 size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteRecord(record.id); setOpenMenuId(null); }}
                                                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 border-t border-gray-100 dark:border-white/5"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-[#800020]/5 dark:bg-[#800020]/10 flex items-center justify-center text-[#800020] text-opacity-80 group-hover:text-opacity-100 group-hover:scale-110 transition-all">
                                                <Icon size={28} strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                {isRenaming ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            autoFocus
                                                            className="bg-white dark:bg-black border border-[#800020] rounded px-2 py-1 text-sm outline-none w-full"
                                                            value={renameValue}
                                                            onChange={(e) => setRenameValue(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') saveRename()
                                                                if (e.key === 'Escape') setRenamingId(null)
                                                            }}
                                                            onBlur={saveRename}
                                                        />
                                                    </div>
                                                ) : (
                                                    <h3
                                                        className="font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-[#800020] transition-colors text-lg"
                                                        onClick={() => setSelectedRecord(record)}
                                                        title={record.name}
                                                    >
                                                        {record.name}
                                                    </h3>
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                                                        {record.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                    </span>
                                                    {record.category && (
                                                        <span className="px-2 py-1 rounded-md bg-[#800020]/5 text-[10px] uppercase font-bold tracking-wider text-[#800020]">
                                                            {record.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-xs font-medium text-gray-400">
                                            <div className="flex gap-3">
                                                <span>{formatSize(record.size)}</span>
                                                <span>{new Date(record.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-[#800020] opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider">
                                                Download <Download size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* View Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-5xl h-full max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10 relative">
                        <button
                            onClick={() => setSelectedRecord(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-[#800020] transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        {/* Preview Area (Left/Top) */}
                        <div className="flex-1 bg-gray-100 dark:bg-white/5 flex items-center justify-center p-8 relative group">
                            <div className="text-center p-12">
                                {selectedRecord.type.includes('image') ? (
                                    <div className="relative">
                                        <Image size={64} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-500">Image Preview Placeholder</p>
                                    </div>
                                ) : selectedRecord.type.includes('video') ? (
                                    <div>
                                        <Video size={64} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-500">Video Player Placeholder</p>
                                    </div>
                                ) : (
                                    <div>
                                        <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-500">Document Preview Placeholder</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Area (Right/Bottom) */}
                        <div className="w-full md:w-96 bg-white dark:bg-dark-card border-l border-gray-100 dark:border-white/5 flex flex-col h-full">
                            <div className="p-8 border-b border-gray-100 dark:border-white/5">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words mb-2">{selectedRecord.name}</h2>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-bold uppercase tracking-wider">
                                    {selectedRecord.category}
                                </span>
                            </div>

                            <div className="p-8 flex-1 overflow-y-auto space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Metadata</label>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Type</span>
                                            <span className="text-gray-900 dark:text-white font-medium">{selectedRecord.type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Size</span>
                                            <span className="text-gray-900 dark:text-white font-medium">{formatSize(selectedRecord.size)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Uploaded</span>
                                            <span className="text-gray-900 dark:text-white font-medium">{new Date(selectedRecord.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRecord.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {tag}
                                            </span>
                                        ))}
                                        <button className="px-3 py-1 border border-dashed border-gray-300 dark:border-white/20 rounded-lg text-sm text-gray-400 hover:text-[#800020] hover:border-[#800020] transition-colors flex items-center gap-1">
                                            <Tag size={12} /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => shareRecord(selectedRecord.id)}
                                        className="py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold text-sm hover:bg-white dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Share2 size={16} /> Share
                                    </button>
                                    <button
                                        onClick={() => { /* Download logic */ }}
                                        className="py-3 rounded-xl bg-[#800020] text-white font-bold text-sm hover:bg-[#a00028] transition-colors shadow-lg shadow-[#800020]/20 flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                                <button
                                    onClick={() => deleteRecord(selectedRecord.id)}
                                    className="w-full mt-3 py-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete File
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
