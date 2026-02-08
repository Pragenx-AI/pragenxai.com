import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';

if (!ffmpegPath) {
    console.error('ffmpeg-static not found');
    process.exit(1);
}

ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = path.join(process.cwd(), 'client', 'public', 'demo-video.mp4');
const outputFile = path.join(process.cwd(), 'client', 'public', 'demo-video-mobile.mp4');

console.log(`Compressing ${inputFile} to ${outputFile} (Mobile 720p)...`);

ffmpeg(inputFile)
    .videoCodec('libx264')
    .outputOptions([
        '-crf 23',         // Medium quality (good for mobile)
        '-preset slow',    // Better compression efficiency
        '-movflags +faststart',
        '-vf scale=-2:720' // Scale to 720p height, keeping aspect ratio
    ])
    .on('end', () => {
        console.log('Mobile video compression finished successfully!');
    })
    .on('error', (err) => {
        console.error('Error compressing video:', err);
        process.exit(1);
    })
    .save(outputFile);
