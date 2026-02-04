// Type definitions for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
}

// Pre-load voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    }
}

export const speak = (text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return

    // Small delay to ensure any previous cancel() has taken effect
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text)

        let voices = window.speechSynthesis.getVoices()
        if (voices.length === 0) voices = window.speechSynthesis.getVoices()

        const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
            voices.find(v => v.name.includes('Samantha') || v.name.includes('Female')) ||
            voices.find(v => v.lang.startsWith('en'))

        if (preferredVoice) utterance.voice = preferredVoice
        utterance.volume = 1
        utterance.rate = 1.1 // Slightly faster for responsiveness
        utterance.pitch = 1

        if (onEnd) {
            utterance.onend = onEnd
        }

        utterance.onerror = (e) => {
            console.error("Speech Synthesis Error:", e)
            if (onEnd) onEnd()
        }

        window.speechSynthesis.speak(utterance)

        // Chrome fix: forces audio to start if it gets stuck
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume()
        }
    }, 50)
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
