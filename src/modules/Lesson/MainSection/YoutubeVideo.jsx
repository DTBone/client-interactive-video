import React from 'react';
import ReactPlayer from 'react-player/youtube';
import styled from 'styled-components';

const PlayerWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; // 16:9 aspect ratio
  width: 100%;

  .react-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const YoutubeVideo = ({ url, controls = true, light = false, playsinline = true }) => {
    return (
        <PlayerWrapper>
            <ReactPlayer
                className="react-player"
                url={url}
                width="100%"
                height="100%"
                controls={controls}
                light={light}
                playsinline={playsinline}
                config={{
                    youtube: {
                        playerVars: {
                            modestbranding: 1,
                            showinfo: 0,
                            rel: 0,
                            iv_load_policy: 3,
                        },
                    },
                }}
            />
        </PlayerWrapper>
    );
};

export default YoutubeVideo;