// Type definitions for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
}

export const speak = (text: string, onEnd?: () => void) => {
    // Cancel any current speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = 1
    utterance.rate = 1
    utterance.pitch = 1

    if (onEnd) {
        utterance.onend = onEnd
    }

    window.speechSynthesis.speak(utterance)
}

export const listen = (
    onResult: (text: string) => void,
    onError?: (error: any) => void
) => {
    const windowObj = window as unknown as IWindow
    const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition

    if (!SpeechRecognition) {
        if (onError) onError('Speech recognition not supported in this browser')
        return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onResult(transcript)
    }

    recognition.onerror = (event: any) => {
        if (onError) onError(event.error)
    }

    try {
        recognition.start()
        return recognition
    } catch (e) {
        if (onError) onError(e)
        return null
    }
}
