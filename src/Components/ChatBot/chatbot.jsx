import React, { useState, useEffect, useRef } from 'react';
// import IconComponent from '../Common/Button/IconComponent'; // Xoá dòng này vì không dùng
import {api} from '~/Config/api';
import { CloseSharp, PsychologyAlt, ResetTv, SmartToyOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Tooltip, Typography, List, ListItem, ListItemText, Button, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import robot from '~/assets/DefaultImage/robot.png';
const ChatBot = () => {
  const isAdmin = useSelector(state => state.auth.user?.role !== 'student');
  const isLogin = useSelector(state => state.auth.isLogin);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState({}); // { [id]: {title, image} }
  const messagesEndRef = useRef(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
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
    api.get(`/learns/${id}`)
      .then(res => {
        // Giả sử res.data có { title, image }
        setCourseInfo(prev => ({ ...prev, [id]: res.data.data }));
      })
      .catch(() => {});
  }
  // Lấy lịch sử chat khi mở chatbot (phân trang)
  useEffect(() => {
    if (open && userId) {
      setPage(1);
      fetchMessages(1, true);
    }
  }, [open, userId]);

  // Hàm lấy tin nhắn phân trang
  const fetchMessages = async (pageToLoad = 1, reset = false) => {
    if (!userId) return;
    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await api.get(`/chatbot/history?page=${pageToLoad}&limit=${limit}`);
      const { data, total } = res.data;
      if (reset) {
        setMessages(data);
      } else {
        setMessages(prev => [...data, ...prev]);
      }
      setHasMore((pageToLoad - 1) * limit + data.length < total);
    } catch {
      if (pageToLoad === 1) setMessages([]);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  // Hàm load thêm khi scroll lên đầu
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  };

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  const cropCourseTitleFromAnswer = (answer) => {
    // Tìm tất cả <course>id</course> và thay thế bằng info
    if (!answer || typeof answer !== 'string') return answer;
    const regex = /<course>([\w\d]+)<\/course>/g;
    let lastIndex = 0;
    let match;
    const elements = [];
    let idx = 0;
    while ((match = regex.exec(answer)) !== null) {
      const id = match[1];
      // Thêm đoạn text trước <course>
      if (match.index > lastIndex) {
        elements.push(answer.slice(lastIndex, match.index));
      }
      // Đảm bảo đã có info
      if (!courseInfo[id]) getCourseById(id);
      const info = courseInfo[id];
      elements.push(
        <span key={id + idx} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-2 py-1 mx-1 cursor-pointer hover:bg-blue-100 transition"
          onClick={() => info && navigate(`/course/${info.id}`)}
        >
          {info && info.photo && (
            <img src={info.photo} alt={info.title} className="w-6 h-6 object-cover rounded" />
          )}
          <span className="font-semibold text-blue-700">{info && info.title ? info.title : id}</span>
        </span>
      );
      lastIndex = regex.lastIndex;
      idx++;
    }
    // Thêm phần còn lại
    if (lastIndex < answer.length) {
      elements.push(answer.slice(lastIndex));
    }
    return elements;
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/chatbot/ask', { message: input });
      setMessages(prev => [...prev, { role: 'bot', content: res.data?.message.content || '...' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: 'Have an error.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleReset = () => {
    try {
      api.delete('/chatbot/history')
        .then(() => {
          setMessages([]);
          toast.success('Reset history successfully.');
        })
        .catch(() => {
          toast.error('Have an error.');
        });
    } catch {
      toast.error('Have an error.');
    }
  };

  return (
    
    <>
      {/* Nút nổi */}
      {!isAdmin && isLogin && (
        <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-[4px] flex items-center justify-center focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Open chatbot"
      >
        <img src={robot} alt="Chatbot Avatar" className="w-6 h-6 rounded-full border-4 border-blue-200 bg-white object-contain" />
      </button>
      )}
      {/* Khung chat */}
      {open && (
        <div className="fixed bottom-10 right-6 z-50 w-1/4 min-h-[400px] max-h-[500px] max-w-lg bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
          <div className="flex items-center justify-between p-3 border-b bg-blue-600 rounded-t-lg">
            <Box className="flex items-center gap-2">
              <img src={robot} alt="Chatbot Avatar" className="w-6 h-6 rounded-full shadow-lg border-4 border-blue-200 bg-white object-contain" />
              <Typography variant="h6" className="text-white">CodeChef Bot</Typography>
            </Box>
            <div className="flex items-center gap-2">
            <Tooltip title="Reset History">
                <button onClick={handleReset} className="text-white text-xl font-bold"><ResetTv/></button>
              </Tooltip>
              <Tooltip title="Close">
                <button onClick={() => setOpen(false)} className="text-white text-xl font-bold"><CloseSharp/></button>
              </Tooltip>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto p-3 space-y-2"
            style={{ maxHeight: 350 }}
            onScroll={e => {
              if (e.target.scrollTop === 0 && hasMore && !loadingMore) {
                handleLoadMore();
              }
            }}
          >
            {loadingMore && <div className="text-center text-xs text-gray-400">Loading more...</div>}
              <Box className="flex flex-col justify-center items-center h-full w-full p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-inner">
                {/* Avatar and bot name */}
                <Box className="flex flex-col items-center mb-4">
                  <img
                    src={robot}
                    alt="Chatbot Avatar"
                    className="w-20 h-20 rounded-full shadow-lg border-4 border-blue-200 bg-white mb-2 object-contain"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'; }}
                  />
                  <Typography variant="h5" className="font-bold text-blue-700">CodeChef Bot</Typography>
                  <Typography variant="body2" className="text-gray-500 text-center max-w-xs">Hello! I&apos;m a student assistant. Ask me anything about courses, knowledge, or learning paths!</Typography>
                </Box>
                {/* Supported features */}
                <Box className="w-full flex flex-col gap-2 mb-4">
                  <Box className="flex items-center gap-2">
                    <SmartToyOutlined className="text-blue-500" />
                    <Typography variant="body2">Search for courses</Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <SmartToyOutlined className="text-green-500" />
                    <Typography variant="body2">Recommend courses for you</Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <SmartToyOutlined className="text-purple-500" />
                    <Typography variant="body2">Search for knowledge</Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <SmartToyOutlined className="text-orange-500" />
                    <Typography variant="body2">Recommend Learning Paths for you</Typography>
                  </Box>
                </Box>
                {/* Suggestion chips */}
                <Box className="flex flex-row gap-2 flex-wrap justify-center">
                  <Chip label="Search AI courses" clickable onClick={() => setInput('Search AI courses')} />
                  <Chip label="What is Programming?" clickable onClick={() => setInput('What is Programming?')} />
                  <Chip label="Recommend courses for me" clickable onClick={() => setInput('Recommend courses for me')} />
                  <Chip label="Recommend Learning Paths for you" clickable onClick={() => setInput('Please recommend learning paths for me')} />
                </Box>
              </Box>
            {messages.length > 0 && messages.map((msg, idx) => {
              if (msg.role === 'bot') {
                let answer = msg.content;
                let cleanAnswer = cropCourseTitleFromAnswer(answer);
                return (
                  <div key={idx} className="flex items-end gap-2 mb-2 animate-fade-in">
                    <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-800 shadow-md max-w-[80%] relative">
                      <div className="whitespace-pre-line break-words">{cleanAnswer}</div>
                    </div>
                  </div>
                );
              }
              // user message
              return (
                <div key={idx} className="flex justify-end">
                  <div className={`px-3 py-2 rounded-lg text-sm bg-blue-100 ${msg.role == 'user' ? 'text-blue-800' : 'text-gray-800'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start"><div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm animate-pulse">Repling...</div></div>
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
