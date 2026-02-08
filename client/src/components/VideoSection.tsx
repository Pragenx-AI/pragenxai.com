import { useRef, useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoSrc, setVideoSrc] = useState("");

    // Handle source selection based on viewport
    useEffect(() => {
        const updateSource = () => {
            const isMobile = window.innerWidth <= 768;
            setVideoSrc(isMobile ? "/demo-video-mobile.mp4" : "/demo-video-optimized.mp4");
        };

        // Initial check
        updateSource();

        // Listener
        window.addEventListener('resize', updateSource);
        return () => window.removeEventListener('resize', updateSource);
    }, []);

    // Handle autoplay with mobile-specific handling
    useEffect(() => {
        if (videoRef.current && videoSrc) {
            const video = videoRef.current;

            // Ensure muted for autoplay policy compliance
            video.muted = true;
            video.playbackRate = 1.0;

            // Force load for mobile
            video.load();

            const attemptPlay = () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch(e => {
                            console.log("Autoplay blocked or failed:", e);
                            setIsPlaying(false);
                        });
                }
            };

            // Small delay for mobile browsers to properly load
            const timer = setTimeout(attemptPlay, 100);

            // Also try on loadeddata event for better mobile compatibility
            video.addEventListener('loadeddata', attemptPlay);

            return () => {
                clearTimeout(timer);
                video.removeEventListener('loadeddata', attemptPlay);
            };
        }
    }, [videoSrc]);

    const handleManualPlay = () => {
        if (videoRef.current) {
            videoRef.current.muted = true; // Keep muted for reliable playback
            videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Manual play failed:", e));
        }
    };

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative max-w-5xl mx-auto text-center">

                    {/* Highlight Text */}
                    <div className="mb-12 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">
                            Experience the Future
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            See Pragenx AI in action.
                        </p>
                    </div>

                    {/* Clean Video Player */}
                    <div className="relative rounded-2xl overflow-hidden">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover rounded-2xl"
                            autoPlay
                            loop
                            muted
                            playsInline
                            // @ts-ignore - Required for iOS and Android WebViews
                            webkit-playsinline="true"
                            x5-video-player-type="h5"
                            x5-playsinline="true"
                            preload="auto"
                            poster="/dashboard-mockup.png"
                            src={videoSrc}
                            onClick={handleManualPlay}
                            onTouchStart={handleManualPlay}
                        />

                        {/* Play Button Fallback (visible if autoplay fails) */}
                        {!isPlaying && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 rounded-2xl">
                                <Button
                                    onClick={handleManualPlay}
                                    className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white flex items-center justify-center group transition-all hover:scale-110"
                                >
                                    <Play className="w-8 h-8 fill-white text-white ml-1 group-hover:scale-110 transition-transform" />
                                </Button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
