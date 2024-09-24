
import ReactPlayer from 'react-player/youtube'
import YoutubeVideo from './YoutubeVideo'
const Lecture = () => {
    return (
        <div className='w-full'>

            <YoutubeVideo
                url="https://www.youtube.com/watch?v=IpYJjVw6wjU"
                controls={true}
                light={false}
                playsinline={true} />
            <YoutubeVideo
                url="https://www.youtube.com/watch?v=IpYJjVw6wjU"
                controls={true}
                light={false}
                playsinline={true} />

        </div>
    )
}

export default Lecture
