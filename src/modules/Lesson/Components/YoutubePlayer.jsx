import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

const YoutubePlayer = ({ videoId }) => {
    const [player, setPlayer] = useState(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: '100%', height: '100%' });
    const aspectRatio = 9 / 20; // Standard YouTube aspect ratio

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                const height = width * aspectRatio;
                setDimensions({
                    width: width,
                    height: height
                });
            }
        };

        const debouncedUpdateDimensions = debounce(updateDimensions, 250);

        window.addEventListener('resize', debouncedUpdateDimensions);
        updateDimensions(); // Initial call

        return () => window.removeEventListener('resize', debouncedUpdateDimensions);
    }, [aspectRatio]);

    const onPlayerReady = (event) => {
        setPlayer(event.target);
    }

    const onStateChange = (event) => {
        console.log('Player state changed:', event.data);
    }

    const opts = {
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div ref={containerRef} style={{ width: '100%', height: `${dimensions.height}px` }} className="bg-transparent overflow-hidden">
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}