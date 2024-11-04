import React, { useEffect, useRef, useState } from 'react';
import { LocalSee, NoPhotography, Mic, MicOff, PhoneEnabled, PhoneDisabled, Monitor } from '@mui/icons-material';
import webRTCService from '~/hooks/WebRTCService.js'
import socketService from '~/hooks/SocketService.js';
import { Card, Button } from '@mui/material';
import '~/index.css';

const VideoCall = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const conversationId = new URLSearchParams(window.location.search).get('conversationId');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const initializeCall = async () => {
            try {
                // Initialize WebRTC service
                await webRTCService.initialize(socketService);

                // Start local stream
                const stream = await webRTCService.startLocalStream();
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Set up remote stream handler
                webRTCService.setOnRemoteStreamUpdate((stream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = stream;
                    }
                });

                // Join the conversation room
                socketService.emit('video-call:join', {
                    conversationId,
                    userId: currentUser._id
                });
            } catch (error) {
                console.error('Failed to initialize call:', error);
            }
        };

        initializeCall();

        return () => {
            handleHangup();
        };
    }, []);

    const handleStartCall = async () => {
        try {
            await webRTCService.makeCall(conversationId);
            setIsCallStarted(true);
        } catch (error) {
            console.error('Failed to start call:', error);
        }
    };

    const handleHangup = () => {
        webRTCService.handleHangup();
        setIsCallStarted(false);
        socketService.emit('video-call:leave', { conversationId });
    };

    const toggleAudio = () => {
        const newState = !isAudioEnabled;
        webRTCService.toggleAudio(newState);
        setIsAudioEnabled(newState);
    };

    const toggleVideo = () => {
        const newState = !isVideoEnabled;
        webRTCService.toggleVideo(newState);
        setIsVideoEnabled(newState);
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                await webRTCService.startScreenShare();
                setIsScreenSharing(true);
            } else {
                // Revert to camera
                const stream = await webRTCService.startLocalStream();
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                setIsScreenSharing(false);
            }
        } catch (error) {
            console.error('Failed to toggle screen share:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Local Video */}
                    <Card className="relative overflow-hidden rounded-lg aspect-video bg-gray-900">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded">
                            You
                        </div>
                    </Card>

                    {/* Remote Video */}
                    <Card className="relative overflow-hidden rounded-lg aspect-video bg-gray-900">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded">
                            Remote User
                        </div>
                    </Card>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                        variant={isAudioEnabled ? "default" : "destructive"}
                        size="lg"
                        onClick={toggleAudio}
                        className="rounded-full p-4"
                    >
                        {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                    </Button>

                    <Button
                        variant={isVideoEnabled ? "default" : "destructive"}
                        size="lg"
                        onClick={toggleVideo}
                        className="rounded-full p-4"
                    >
                        {isVideoEnabled ? <LocalSee size={24} /> : <NoPhotography size={24} />}
                    </Button>

                    <Button
                        variant={isScreenSharing ? "destructive" : "default"}
                        size="lg"
                        onClick={toggleScreenShare}
                        className="rounded-full p-4"
                    >
                        <Monitor size={24} />
                    </Button>

                    {!isCallStarted ? (
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleStartCall}
                            className="rounded-full p-4 bg-green-500 hover:bg-green-600"
                        >
                            <PhoneEnabled size={24} />
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            size="lg"
                            onClick={handleHangup}
                            className="rounded-full p-4"
                        >
                            <PhoneDisabled size={24} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCall;