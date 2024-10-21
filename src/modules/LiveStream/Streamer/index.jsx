import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';

function Streamer() {
  const roomId = window.location.pathname.split('/')[2];
  const localVideoRef = useRef(null);
  const [isLiving, setIsLiving] = useState(false);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  const startStream = async () => {
    if (!roomId) return;
    if (!peerConnection.current) return;
    if (!socket.current) return;
    console.log('create room')
    socket.current.emit('create-room', roomId);
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.current.emit('offer', roomId, offer);
    setIsLiving(true);
  };

  const stopStream = () => {
    if (!peerConnection.current) return;
    console.log('stop stream')
    setIsLiving(false);
    peerConnection.current.close();
    socket.current.emit('close-room', roomId);
  };

  useEffect(() => {
    console.log('render')
    socket.current = io('http://localhost:3000');
    
    const initPeerConnection = async () => {
      peerConnection.current = new RTCPeerConnection();

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit('ice-candidate', { roomId, iceCandidate: event.candidate });
        }
      };

      socket.current.on('answer', async (answer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.current.on('ice-candidate', (candidate) => {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      });
    }

    initPeerConnection();

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });
      });
    // Cleanup
    return () => {
      console.log('unmount');
      if(peerConnection.current && socket.current) {
        peerConnection.current.close();
        socket.current.disconnect();
      }
    };
  }, [roomId, isLiving]);

  return (
    <div>
      <h1>Streamer</h1>
      {isLiving === false ? (<Button onClick={startStream}>Start Stream</Button>) : (<Button onClick={stopStream}>Stop Stream</Button>)}
      <video ref={localVideoRef} controls autoPlay playsInline />
    </div>
  );
}

export default Streamer;
