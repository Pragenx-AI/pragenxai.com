import { useRef, useEffect } from "react";

export function VideoSection() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            // Ensure muted is set for autoplay support on mobile
            videoRef.current.muted = true;
            videoRef.current.playbackRate = 2.0;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Autoplay blocked or failed:", e);
                    // Video will show poster if autoplay fails
                });
            }
        }
    }, []);

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
                    {/* Standard HTML Video Player - No fancy wrappers */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10 min-h-[300px] group">

                        {/* Ambient Glow Animation */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative w-full h-full rounded-3xl overflow-hidden">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover pointer-events-none"
                                loop
                                muted
                                autoPlay
                                playsInline
                                // @ts-ignore - Required for iOS
                                webkit-playsinline="true"
                                preload="auto"
                                poster="/dashboard-mockup.png"
                            >
                                <source src="/demo-video-optimized.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
