import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Input, Button, Card, Typography, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { Text } = Typography;

// const socket = io('http://localhost:4000'); // Connect to backend
const socket = io(process.env.REACT_APP_API_BASE_URL); // Connect to backend

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', input);
      setInput('');
    }
  };

  return (
    <Card
      title="Real-Time Chat"
      className="w-96 mx-auto mt-5 bg-gray-100 rounded-lg shadow-md"
    >
      <div className="h-72 overflow-y-auto p-3 bg-white rounded-md mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: index % 2 === 0 ? 'left' : 'right',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                padding: '6px 12px',
                borderRadius: 10,
                display: 'inline-block',
                maxWidth: '80%',
                backgroundColor: index % 2 === 0 ? '#1890ff' : '#52c41a',
                color: '#fff',
              }}
            >
              {msg}
            </Text>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Space>
        <Input
          className="w-72"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Type a message..."
        />
        <Button type="primary" onClick={sendMessage} icon={<SendOutlined />} />
      </Space>
    </Card>
  );
};

export default Chat;
