import { useRef, useEffect, useState, useCallback } from "react";
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

    // Autoplay function - uses ref to avoid stale closure
    const attemptPlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;
        video.play().catch(e => {
            console.log("Autoplay attempt failed:", e);
        });
    }, []);

    // Handle autoplay with multiple strategies
    useEffect(() => {
        if (!videoRef.current || !videoSrc) return;

        const video = videoRef.current;
        video.muted = true;
        video.playbackRate = 1.0;

        // Detect when video actually starts playing
        const handlePlaying = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            // Only set to false if video is paused and not at the end
            if (video.paused && !video.ended) {
                setIsPlaying(false);
            }
        };

        video.addEventListener('playing', handlePlaying);
        video.addEventListener('pause', handlePause);

        // Force load for mobile
        video.load();

        // Try playing on various events
        video.addEventListener('loadeddata', attemptPlay);
        video.addEventListener('canplaythrough', attemptPlay);
        video.addEventListener('canplay', attemptPlay);

        // Intersection Observer - play when video is visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        attemptPlay();
                    }
                });
            },
            { threshold: 0.25 }
        );
        observer.observe(video);

        // Multiple retry attempts with increasing delays
        const timers = [
            setTimeout(attemptPlay, 100),
            setTimeout(attemptPlay, 300),
            setTimeout(attemptPlay, 600),
            setTimeout(attemptPlay, 1000),
            setTimeout(attemptPlay, 2000),
        ];

        return () => {
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('loadeddata', attemptPlay);
            video.removeEventListener('canplaythrough', attemptPlay);
            video.removeEventListener('canplay', attemptPlay);
            observer.disconnect();
            timers.forEach(clearTimeout);
        };
    }, [videoSrc, attemptPlay]);

    const handleManualPlay = () => {
        if (videoRef.current) {
            videoRef.current.muted = true;
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
