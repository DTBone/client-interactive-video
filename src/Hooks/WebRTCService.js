// services/WebRTCService.js
class WebRTCService {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.socketService = null;
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
            ]
        };
    }

    async initialize(socketService) {
        this.socketService = socketService;
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        // Lắng nghe offer từ người gọi
        this.socketService.on('webrtc:offer', async (data) => {
            const { from, offer } = data;
            await this.handleOffer(from, offer);
        });

        // Lắng nghe answer từ người nhận
        this.socketService.on('webrtc:answer', async (data) => {
            const { from, answer } = data;
            await this.handleAnswer(answer);
        });

        // Lắng nghe ICE candidate
        this.socketService.on('webrtc:ice-candidate', async (data) => {
            const { from, candidate } = data;
            await this.handleIceCandidate(candidate);
        });

        // Lắng nghe sự kiện kết thúc cuộc gọi
        this.socketService.on('webrtc:hangup', () => {
            this.handleHangup();
        });
    }

    async createPeerConnection() {
        try {
            this.peerConnection = new RTCPeerConnection(this.configuration);

            // Xử lý ICE candidate
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socketService.emit('webrtc:ice-candidate', {
                        candidate: event.candidate
                    });
                }
            };

            // Xử lý khi nhận được remote stream
            this.peerConnection.ontrack = (event) => {
                this.remoteStream = event.streams[0];
                this.onRemoteStreamUpdate?.(this.remoteStream);
            };

            // Thêm local stream vào peer connection
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => {
                    this.peerConnection.addTrack(track, this.localStream);
                });
            }

            return this.peerConnection;
        } catch (error) {
            console.error('Error creating peer connection:', error);
            throw error;
        }
    }

    async startLocalStream(constraints = { video: true, audio: true }) {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            return this.localStream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    }

    async startScreenShare() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });

            // Thay thế video track hiện tại bằng screen share track
            const videoTrack = screenStream.getVideoTracks()[0];
            const sender = this.peerConnection.getSenders().find(s =>
                s.track?.kind === 'video'
            );

            if (sender) {
                await sender.replaceTrack(videoTrack);
            }

            return screenStream;
        } catch (error) {
            console.error('Error sharing screen:', error);
            throw error;
        }
    }

    async makeCall(targetUserId) {
        try {
            await this.createPeerConnection();

            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);

            this.socketService.emit('webrtc:offer', {
                target: targetUserId,
                offer: offer
            });
        } catch (error) {
            console.error('Error making call:', error);
            throw error;
        }
    }

    async handleOffer(from, offer) {
        try {
            await this.createPeerConnection();

            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);

            this.socketService.emit('webrtc:answer', {
                target: from,
                answer: answer
            });
        } catch (error) {
            console.error('Error handling offer:', error);
            throw error;
        }
    }

    async handleAnswer(answer) {
        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error('Error handling answer:', error);
            throw error;
        }
    }

    async handleIceCandidate(candidate) {
        try {
            if (this.peerConnection) {
                await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
            throw error;
        }
    }

    handleHangup() {
        this.stopLocalStream();
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
    }

    stopLocalStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
    }

    // Các phương thức điều khiển media
    toggleAudio(enabled) {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = enabled;
            }
        }
    }

    toggleVideo(enabled) {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = enabled;
            }
        }
    }

    // Callback khi remote stream thay đổi
    setOnRemoteStreamUpdate(callback) {
        this.onRemoteStreamUpdate = callback;
    }
}

// Export singleton instance
const webRTCService = new WebRTCService();
export default webRTCService;