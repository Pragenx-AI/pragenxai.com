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

    // Handle autoplay
    useEffect(() => {
        if (videoRef.current && videoSrc) {
            videoRef.current.muted = true;
            videoRef.current.playbackRate = 1.0;

            const playPromise = videoRef.current.play();
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
        }
    }, [videoSrc]);

    const handleManualPlay = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section className="py-24 relative overflow-hidden bg-black/5 border-y border-white/10">
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

                    {/* Standard HTML Video Player - No fancy wrappers */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10 min-h-[300px] group">

                        {/* Ambient Glow Animation */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative w-full h-full rounded-3xl overflow-hidden">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                // @ts-ignore - Required for iOS
                                webkit-playsinline="true"
                                preload="auto"
                                poster="/dashboard-mockup.png"
                                src={videoSrc}
                                onClick={handleManualPlay}
                            />

                            {/* Play Button Fallback (visible if autoplay fails) */}
                            {!isPlaying && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
                                    <Button
                                        onClick={handleManualPlay}
                                        className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white flex items-center justify-center group transition-all hover:scale-110"
                                    >
                                        <Play className="w-8 h-8 fill-white text-white ml-1 group-hover:scale-110 transition-transform" />
                                    </Button>
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
