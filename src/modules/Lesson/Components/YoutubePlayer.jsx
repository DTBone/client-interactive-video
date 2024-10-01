import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

const YoutubePlayer = ({ videoId }) => {
    const [player, setPlayer] = useState(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: '100%', height: '100%' });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                const height = width * (9 / 20);
                setDimensions({
                    width: `${width}px`,
                    height: `${height}px`
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const onPlayerReady = (event) => {
        setPlayer(event.target);
        // Uncomment the next line if you want the video to pause when loaded
        // event.target.pauseVideo();
    }

    const onStateChange = (event) => {
        // You can add state change handling here if needed
        console.log('Player state changed:', event.data);
    }

    const opts = {
        width: dimensions.width,
        height: dimensions.height,
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div ref={containerRef} className="w-full  bg-transparent overflow-hidden">
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onPlayerReady}
                onStateChange={onStateChange}
                className="w-full h-full"
            />
        </div>

    )
}

export default YoutubePlayer;