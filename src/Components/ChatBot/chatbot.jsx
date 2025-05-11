import React, { useState, useEffect, useRef } from 'react';
// import IconComponent from '../Common/Button/IconComponent'; // Xoá dòng này vì không dùng
import {api} from '~/Config/api';
import { PsychologyAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const ChatBot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState({}); // { [id]: {title, image} }
  const messagesEndRef = useRef(null);
  // Lấy userId từ localStorage
  const userId = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))?._id;
    } catch {
      return null;
    }
  }, []);
  // Lấy khóa học theo id
  const getCourseById = (id) => {
    if (courseInfo[id]) return; // Đã có rồi thì không gọi lại
    api.get(`/learns/courseId/${id}`)
      .then(res => {
        // Giả sử res.data có { title, image }
        setCourseInfo(prev => ({ ...prev, [id]: res.data.data }));
      })
      .catch(() => {});
  }
  // Lấy lịch sử chat khi mở chatbot
  useEffect(() => {
    if (open && userId) {
      api.get(`/chatbot/history`)
        .then(res => {
          setMessages(res.data.data || []);
          console.log(res.data.data)
        })
        .catch(() => setMessages([]));
    }
  }, [open, userId]);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/chatbot/ask', { message: input });
      setMessages(prev => [...prev, { sender: 'bot', content: res.data?.answer || '...' }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', content: 'Đã có lỗi xảy ra.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Nút nổi */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Open chatbot"
      >
        <PsychologyAlt/>    
      </button>
      {/* Khung chat */}
      {open && (
        <div className="fixed bottom-10 right-6 z-50 w-80 max-w-sm bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
          <div className="flex items-center justify-between p-3 border-b bg-blue-600 rounded-t-lg">
            <span className="text-white font-semibold">ChatBot</span>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: 350 }}>
            {messages.length === 0 && (
              <div className="text-gray-400 text-center">Chưa có tin nhắn nào.</div>
            )}
            {messages.length > 0 && messages.map((msg, idx) => {
              if (msg.role === 'bot') {
                let answer = msg.content;
                let courses = null;
                try {
                  const parsed = typeof answer === 'string' ? JSON.parse(answer) : answer;
                  if (parsed && parsed.answer) {
                    answer = parsed.answer;
                    courses = parsed.courses;
                  }
                } catch {
                  /* not JSON, ignore */
                }
                // Nếu có courses, gọi getCourseById cho từng id
                if (courses && Array.isArray(courses)) {
                  courses.forEach(id => getCourseById(id));
                }
                return (
                  <div key={idx} className="flex justify-start">
                    <div className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-800">
                      <div>{answer}</div>
                      {courses && Array.isArray(courses) && courses.length > 0 && (
                        <div className="mt-2 text-xs text-blue-700">
                          <div>Khóa học gợi ý:</div>
                          <ul className="list-disc ml-4">
                            {courses.map((c, i) => {
                              const info = courseInfo[c];
                              console.log(info)
                              return (
                                <li key={i} className="flex items-center gap-2"
                                onClick={() => navigate(`/course/${info.id}`)}
                                >
                                  {info && info.photo && (
                                    <img src={info.photo} alt={info.title} className="w-8 h-8 object-cover rounded" />
                                  )}
                                  <span>{info && info.title ? info.title : c}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              // user message
              return (
                <div key={idx} className="flex justify-end">
                  <div className="px-3 py-2 rounded-lg text-sm bg-blue-100 text-blue-800">
                    {msg.content}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start"><div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm animate-pulse">Đang trả lời...</div></div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
