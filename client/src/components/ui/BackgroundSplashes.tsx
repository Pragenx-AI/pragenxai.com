import { motion } from "framer-motion";

export function BackgroundSplashes() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply dark:mix-blend-normal">
            {/* Primary Splash - Top Left */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                animate={{ y: [0, 50, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Secondary Splash - Top Right */}
            <motion.div
                className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                animate={{ y: [0, -50, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Accent Splash - Bottom Left */}
            <motion.div
                className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
                animate={{ x: [0, 30, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
        </div>
    );
}
