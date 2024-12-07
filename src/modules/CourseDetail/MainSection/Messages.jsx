import React, { useState } from 'react';
import {
    Send,
    User,
    Clock,
    MoreVertical
} from 'lucide-react';

const Messages = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'Instructor',
            content: 'Welcome to the Python Beginner course! Feel free to ask any questions.',
            timestamp: '2024-01-15T10:30:00Z',
            type: 'system'
        },
        {
            id: 2,
            sender: 'You',
            content: 'Can you explain more about list comprehensions?',
            timestamp: '2024-01-15T11:45:00Z',
            type: 'user'
        }
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: messages.length + 1,
                sender: 'You',
                content: newMessage,
                timestamp: new Date().toISOString(),
                type: 'user'
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md h-[500px] flex flex-col">
            {/* Messages Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <h2 className="font-semibold text-gray-800">Course Discussions</h2>
                </div>
                <MoreVertical className="text-gray-500 cursor-pointer" />
            </div>

            {/* Messages List */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-lg ${message.type === 'user'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm">
                                    {message.sender}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t flex space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default Messages;