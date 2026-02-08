import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';

if (!ffmpegPath) {
    console.error('ffmpeg-static not found');
    process.exit(1);
}

ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = path.join(process.cwd(), 'client', 'public', 'demo-video.mp4');
const outputFile = path.join(process.cwd(), 'client', 'public', 'demo-video-optimized.mp4');

console.log(`Compressing ${inputFile} to ${outputFile}...`);

ffmpeg(inputFile)
    .videoCodec('libx264')
    .outputOptions([
        '-crf 18',         // Very High quality
        '-preset slow',    // Better compression efficiency
        '-movflags +faststart',
        '-vf scale=3840:-2' // Scale to 4K width, keeping aspect ratio
    ])
    .on('end', () => {
        console.log('Video compression finished successfully!');
    })
    .on('error', (err) => {
        console.error('Error compressing video:', err);
        process.exit(1);
    })
    .save(outputFile);
