import { Player } from 'video-react';
import "video-react/dist/video-react.css";

const VideoPlayer = ({ src }) => {
    return (
        <div className='w-full relative' style={{ paddingBottom: '56.25%' }}>
            <div className='absolute top-0 left-0 w-full h-full'>
                <Player
                    playsInline
                    poster="/assets/poster.png"
                    src={src}
                    fluid={false}
                    width="100%"
                    height="100%"
                    controls={true}
                    autoPlay={false}
                />
            </div>
        </div>
    )
}

export default VideoPlayer
