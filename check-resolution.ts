import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';

if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = path.join(process.cwd(), 'client', 'public', 'demo-video.mp4');

ffmpeg.ffprobe(inputFile, (err, metadata) => {
    if (err) {
        console.error('Error:', err);
    } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        if (videoStream) {
            console.log(`Resolution: ${videoStream.width}x${videoStream.height}`);
        }
    }
});
