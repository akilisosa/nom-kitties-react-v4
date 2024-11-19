// components/ChatModal.tsx
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { CreateMessageInput, messageService } from '../services/messageService';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { userService } from '../services/userService';
import { setUser } from '../store/slices/userSlice';

interface ChatModalProps {
  isOpen: boolean;
  roomID: string;
  onClose: () => void;
}

 type Message = Schema['Message']['type'];

//  Amplify.configure(outputs);

const client = generateClient<Schema>({ authMode: 'apiKey' });
export default function ChatModal({ isOpen, onClose, roomID }: ChatModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.message.messages);
  const user = useAppSelector((state) => state.user.user); // Assuming you have auth slice


  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // loadInitialMessages();
    }
  }, [isOpen]);


  function listMessages() {
    client.models.Message.observeQuery().subscribe({
      next: (data) => {
        setMessageList([...data.items])
        scrollToBottom();
      },
    });
  }

  useEffect(() => {
    if (roomID) {
      listMessages();
    }
  }, [roomID]);


  useEffect(() => {
    if(!user) {
      getUser();
    }
  })

  // util functions 
  const scrollToBottom = (): void => {
    setTimeout(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getUser = async () => {
    const { userId: owner } = await getCurrentUser()
    const response = await userService.getUserByOwner(owner);
    dispatch(setUser(response.data[0]));
  }

  const handleSendMessage = async () => {
    console.log('sending message', newMessage)
    if (!newMessage.trim()) return;
    const { userId: owner } = await getCurrentUser()

    try {
      const messageInput: CreateMessageInput = {
        content: newMessage,
        owner, // Adjust based on your auth setup
        roomID,
        color: user?.color || '#000000', // currentUser.color, // Adjust based on your user setup
        name: user?.name || 'kittycat' //currentUser.name,
      };
      await messageService.createNewMessage(messageInput);
     
    } catch (error) {
      console.error('Error sending message:', error);
    }
    finally {
      setNewMessage('');
    }
  };


  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('enter pressed')
      handleSendMessage();
    }
  }, [handleSendMessage]);

  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup: remove event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]); // Re-run effect if handleKeyPress changes


  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transform transition-all
        ${isOpen ? 'translate-y-0 opacity-100 duration-500 ease-in-out' : 'translate-y-full opacity-100 duration-500 ease-in-out'}`}
      // TODO ask about transitions
      onTransitionEnd={() => {
        if (!isOpen) setIsAnimating(false);
      }}
    >
      {/* Modal Container */}
      <div className={`h-screen w-screen bg-white flex flex-col
        transform transition-transform
        ${isOpen ? 'translate-y-0 opacity-100 duration-500 ease-in-out' : 'translate-y-full opacity-100 duration-500 ease-in-out'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Chat</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="chat-container space-y-4">

              { messageList
              .sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)
              .map((message) => (
                <div key={message.id} className="flex bg-gray-100 max-w-[85%] rounded-lg items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: message.color }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{message.name}</span>
                    <span>{message.content}</span>
                  </div>
                </div>
              ))}
      <div ref={messagesEndRef} /> {/* Empty div for scroll target */}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
