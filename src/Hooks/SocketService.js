import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.url = '';
  }
  getSocket(){
    return this.socket
  }
  // Khởi tạo socket với URL và options
  connect(url, options = { transports: ['websocket'], autoConnect: true }) {
    if (!this.socket) {
      this.socket = io(url, options);
      this.url = url;

      this.socket.on('connect', () => {
        console.log('Socket connected with ID:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        // Retry connection after 5 seconds nếu bị lỗi kết nối
        setTimeout(() => this.socket.connect(), 5000);
      });
    }
    return this;
  }

  // Đăng xuất và ngắt kết nối
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Đăng ký sự kiện
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Gỡ sự kiện
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Gửi sự kiện với dữ liệu
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
  
  sendMessage({conversationId, content, type}) {
    this.emit('message:send', {
      conversationId,
      content,
      type
    });
  }
  
  listenMessage(callback) {
    this.on('message:new', callback);
  }
  
  
  
}

// Khởi tạo một instance singleton của SocketService
const socketService = new SocketService();
export default socketService;
