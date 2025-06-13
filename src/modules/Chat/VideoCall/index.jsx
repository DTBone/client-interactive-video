import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LocalSee, NoPhotography, Mic, MicOff, PhoneEnabled, PhoneDisabled, Monitor } from '@mui/icons-material';
import SocketService from "~/Hooks/SocketService.js";

const VideoCall = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteVideoRef2 = useRef(null);
    const shareVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const socketRef = useRef(null);
    const localStreamRef = useRef(null);

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [error, setError] = useState(null);

    const conversationId = new URLSearchParams(window.location.search).get('conversationId');
    const userId = new URLSearchParams(window.location.search).get('userId');

    // Initialize WebRTC configuration
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    // Setup peer connection with logging
    const setupPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(rtcConfig);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('video-call:ice-candidate', {
                    conversationId,
                    userId,
                    candidate: event.candidate
                });
            }
        };

        pc.onconnectionstatechange = () => {
            setConnectionStatus(pc.connectionState);
        };

        pc.ontrack = (event) => {
            console.log('Received remote track:', event, event.track, event.streams);

            // Kiểm tra loại track để xác định camera hoặc màn hình
            const track = event.track;

            if (track.kind === 'video') {
                // Nếu đã có camera track thì coi track mới là màn hình
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                    console.log('Assigned camera track to remoteVideoRef');
                } else if (shareVideoRef.current) {
                    shareVideoRef.current.srcObject = event.streams[0];
                    console.log('Assigned screen share track to shareVideoRef');
                }
            }
        };
        peerConnectionRef.current = pc;
        return pc;
    }, [conversationId, userId]);

    // Initialize socket connection
    useEffect(() => {
        const socket = SocketService.connect(`${import.meta.env.VITE_URL_SERVER}`);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected');
            socket.emit('video-call:join', { conversationId, userId });
        });
        socket.on('video-call:screen-share', (isSharingScreen) => {
            setIsScreenSharing(isSharingScreen);
        })
        socket.on('video-call:offer', async ({ offer }) => {
            if (!peerConnectionRef.current) {
                setupPeerConnection();
            }

            try {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);

                socket.emit('video-call:answer', {
                    conversationId,
                    userId,
                    answer
                });
            } catch (err) {
                console.error('Error handling offer:', err);
                setError('Failed to handle incoming call');
            }
        });

        socket.on('video-call:answer', async ({ answer }) => {
            try {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (err) {
                console.error('Error setting remote description:', err);
                setError('Failed to establish connection');
            }
        });

        socket.on('video-call:ice-candidate', async ({ candidate }) => {
            try {
                await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('Error adding ICE candidate:', err);
            }
        });

        return () => {
            socket.disconnect();
            handleHangup();
        };
    }, [conversationId, userId, setupPeerConnection]);

    // Initialize local media stream
    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Add tracks to peer connection if it exists
                if (peerConnectionRef.current) {
                    stream.getTracks().forEach(track => {
                        peerConnectionRef.current.addTrack(track, stream);
                    });
                }
            } catch (err) {
                console.error('Error accessing media devices:', err);
                setError('Failed to access camera/microphone');
            }
        };

        initializeMedia();

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const handleStartCall = async () => {
        try {
            const pc = setupPeerConnection();

            // Add local tracks to the peer connection
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current);
            });

            // Create and send offer
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await pc.setLocalDescription(offer);

            socketRef.current.emit('video-call:offer', {
                conversationId,
                userId,
                offer
            });

            setIsCallStarted(true);
        } catch (err) {
            console.error('Error starting call:', err);
            setError('Failed to start call');
        }
    };

    const handleHangup = useCallback(() => {
        setIsCallStarted(false);

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Stop all tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        // Clear video elements
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        // Notify server
        socketRef.current?.emit('video-call:leave', {
            conversationId,
            userId
        });
    }, [conversationId, userId]);

    const toggleAudio = useCallback(() => {
        try {
            const audioTrack = localStreamRef.current?.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !isAudioEnabled;
                setIsAudioEnabled(!isAudioEnabled);
            }
        } catch (err) {
            setError('Failed to toggle audio');
        }
    }, [isAudioEnabled]);

    const toggleVideo = useCallback(() => {
        try {
            const videoTrack = localStreamRef.current?.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !isVideoEnabled;
                setIsVideoEnabled(!isVideoEnabled);
            }
        } catch (err) {
            setError('Failed to toggle video');
        }
    }, [isVideoEnabled]);

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });
                setIsScreenSharing(true);

                const videoTrack = screenStream.getVideoTracks()[0];
                // const sender = peerConnectionRef.current
                //         .getSenders()
                //         .find(s => s.track?.kind === 'video');
                // await sender.replaceTrack(videoTrack);
                
                await peerConnectionRef.current.addTrack(videoTrack, screenStream);
                console.log('videoTrack', peerConnectionRef.current.getSenders());
                
                if (shareVideoRef.current) {
                    shareVideoRef.current.srcObject = screenStream;
                }
                socketRef.current.emit('video-call:screen-share', {isScreenSharing: true, conversationId});
                
                // Handle screen sharing stop
                videoTrack.onended = async () => {
                    // const cameraTrack = localStreamRef.current.getVideoTracks()[0];
                    // await sender.replaceTrack(cameraTrack);
                    localVideoRef.current.srcObject = localStreamRef.current;
                    setIsScreenSharing(false);
                };
            } else {
                const cameraTrack = localStreamRef.current.getVideoTracks()[0];
                const sender = peerConnectionRef.current
                    .getSenders()
                    .find(s => s.track?.kind === 'video');

                await sender.replaceTrack(cameraTrack);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStreamRef.current;
                }

                setIsScreenSharing(false);
            }
        } catch (err) {
            console.error('Error toggling screen share:', err);
            setError('Failed to toggle screen sharing');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-h-lvh mx-auto">
                {/* Main video container */}
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {/* Remote Video or Screen Share (full size) */}
                    <video
                        ref={isScreenSharing ? shareVideoRef : remoteVideoRef}
                        autoPlay
                        playsInline
                        className={`w-full h-full object-cover`}
                    />

                    <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded">
                        {isScreenSharing ? 'Screen Share' : 'Remote User'} ({connectionStatus})
                    </div>

                    {/* Right side PiP videos container */}
                    <div className="absolute top-4 right-4 w-1/4 flex flex-col space-y-4">
                        {/* Local Video */}
                        <div
                            className="w-32 aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg bg-gray-900">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div
                                className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-1.5 py-0.5 rounded">
                                You
                            </div>
                        </div>

                        {/* Remote User Video (when screen sharing) */}
                            <div
                                className={`w-64 aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg bg-gray-900 ${isScreenSharing ? '' : 'hidden'}`}>
                                <video
                                    ref={remoteVideoRef2}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-1.5 py-0.5 rounded">
                                    Remote User
                                </div>
                            </div>
                    </div>

                    {/* Video call controls */}
                    <div
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm">
                        <button
                            onClick={toggleAudio}
                            className={`rounded-full p-3 transition-all ${
                                isAudioEnabled
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                            title={isAudioEnabled ? 'Mute' : 'Unmute'}
                        >
                            {isAudioEnabled ? <Mic size={20}/> : <MicOff size={20}/>}
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`rounded-full p-3 transition-all ${
                                isVideoEnabled
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                            title={isVideoEnabled ? 'Stop Video' : 'Start Video'}
                        >
                            {isVideoEnabled ? <LocalSee size={20}/> : <NoPhotography size={20}/>}
                        </button>

                        <button
                            onClick={toggleScreenShare}
                            className={`rounded-full p-3 transition-all ${
                                isScreenSharing
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            } text-white`}
                            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                        >
                            <Monitor size={20}/>
                        </button>

                        <button
                            onClick={isCallStarted ? handleHangup : handleStartCall}
                            className={`rounded-full p-3 transition-all ${
                                isCallStarted
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                            title={isCallStarted ? 'End Call' : 'Start Call'}
                        >
                            {isCallStarted ? <PhoneDisabled size={20}/> : <PhoneEnabled size={20}/>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity">
                    {error}
                </div>
            )}
        </div>
    );
};

export default VideoCall;