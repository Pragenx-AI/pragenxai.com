import { useApp } from '../context/AppContext'
import ChatInput from '../components/layout/ChatInput'
import ChatMessageList from '../components/chat/ChatMessageList'
import VoiceAssistant from '../components/voice/VoiceAssistant'

export default function Chat() {
    const { chatMessages } = useApp()

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-white dark:bg-black transition-colors duration-300 overflow-hidden relative">
            {chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-full max-w-2xl flex flex-col items-center gap-12">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            I’m <span className="text-[#800020]">ready</span> when you are.
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
                    <div className="pb-4 animate-in fade-in duration-200">
                        <ChatInput />
                    </div>
                </>
            )}

            {/* Hidden VoiceAssistant for speech synthesis */}
            <div className="sr-only">
                <VoiceAssistant variant="compact" />
            </div>
        </div>
    )
}
