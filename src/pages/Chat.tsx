import { useApp } from '../context/AppContext'
import ChatInput from '../components/layout/ChatInput'
import ChatMessageList from '../components/chat/ChatMessageList'

export default function Chat() {
    const { chatMessages } = useApp()

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-white dark:bg-black transition-colors duration-300 overflow-hidden relative">
            {chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
                    <div className="w-full max-w-2xl flex flex-col items-center gap-12">
                        <h2 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                            Experience the Power of <span className="text-[#800020]">PragenX</span>
                        </h2>

                        <div className="w-full max-w-xl">
                            <ChatInput />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                        <ChatMessageList messages={chatMessages} />
                    </div>

                    {/* Bottom Search Bar when active */}
                    <div className="border-t border-divider dark:border-dark-border bg-white dark:bg-dark-card animate-in slide-in-from-bottom duration-300">
                        <ChatInput />
                    </div>
                </>
            )}
        </div>
    )
}
