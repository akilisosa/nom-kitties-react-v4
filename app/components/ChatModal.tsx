// components/ChatModal.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { CreateMessageInput, messageService } from '../services/messageService';
import { setMessages } from '../store/slices/messageSlice';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/amplify/data/resource';
import { userService } from '../services/userService';
import { setUser } from '../store/slices/userSlice';
interface ChatModalProps {
  isOpen: boolean;
  roomID: string;
  onClose: () => void;
}

 type Message = Schema['Message']['type'];

const client = generateClient<Schema>({ authMode: 'apiKey' });
export default function ChatModal({ isOpen, onClose, roomID }: ChatModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.message.messages);
  const user = useAppSelector((state) => state.user.user); // Assuming you have auth slice


  // useEffect 

  console.log("roomID", roomID);
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      loadInitialMessages();
    }
  }, [isOpen]);

  // useEffect(() => {
  //   // Subscribe to new messages
  //    const sub = client.models.Message
  //    .observeQuery({
  //     filter: {
  //       roomID: { eq: roomID },
  //     },
  //   }).subscribe({
  //     next: (data) => {
  //       console.log('New messages:', data);
  //       dispatch(setMessages(data.items));
  //       scrollToBottom();
  //     },
  //     error: (err) => console.error('Error in subscription:', err),
  //   }) 

  //    return () => sub.unsubscribe();
  // }, [roomID]);

  useEffect(() => {
    if(!user) {
      getUser();
    }
  })

  // util functions 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getUser = async () => {
    const { userId: owner } = await getCurrentUser()
    const response = await userService.getUserByOwner(owner);
    dispatch(setUser(response.data[0]));
  }

  const loadInitialMessages = async () => {
    try {
      const fetchedMessages = (await messageService.getMessagesByRoomId(roomID)).data;
      dispatch(setMessages(fetchedMessages || []));
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { userId: owner } = await getCurrentUser()

    try {
      const messageInput: CreateMessageInput = {
        content: newMessage,
        owner, // Adjust based on your auth setup
        roomID,
        color: '123', // currentUser.color, // Adjust based on your user setup
        name: 'kittycat' //currentUser.name,
      };

      await messageService.createNewMessage(messageInput);
      // if(!newMess) return;
      // messages.push(newMess);
      // dispatch(setMessages(messages));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


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
            <div className="space-y-4">
              {/* Example message */}
              <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                Example message
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
