import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const Viewer = () => {
  const videoRef = useRef(null);
  const roomId = window.location.pathname.split('/')[2];
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('mount');
    socket.current = io(`${import.meta.env.VITE_URL_SERVER}`);
    console.log('render', roomId);
    socket.current.emit('join-room', roomId);
    console.log('join-room', roomId);
    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.ontrack = (event) => {
      console.log('ontrack', event.streams[0]);
      videoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', roomId, event.candidate);
      }
    };

    socket.current.on('error', (error) => {
      setError(error);
    });

    socket.current.on('offer', async (offer) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.current.emit('answer', roomId, answer);
    });

    socket.current.on('ice-candidate', (candidate) => {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // Cleanup
    return () => {
      console.log('unmount');
      if(peerConnection.current && socket.current) {
        peerConnection.current.close();
        socket.current.disconnect();
      }
    };
  }, [roomId]);

  return (
    <div>
      <h1>Viewer</h1>
      {error ? <p>{error + 'Waiting...'}</p> : (<video ref={videoRef} autoPlay playsInline ></video>)}
    </div>
  );
};

export default Viewer;
