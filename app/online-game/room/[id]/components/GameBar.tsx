// components/GameBar.tsx
'use client';
import { useRouter } from 'next/navigation';

interface GameBarProps {
  onChatOpen: () => void;
  onLobbyClick: () => void;
}

export default function GameBar({ onChatOpen, onLobbyClick }: GameBarProps) {
  const router = useRouter();

  const handleLeaveRoom = () => {
    router.push('/online-game');
  };

  return (
    <div className="w-full px-4 py-1 border-b border-gray-600"> {/* Reduced py-2 to py-1 */}
      <div className="flex flex-row justify-between items-center">
        <button
          onClick={onChatOpen}
          className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors duration-200 ease-in-out"
        >
          Chat
        </button>

        <button
          onClick={onLobbyClick}
          className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded transition-colors duration-200 ease-in-out"
        >
          Lobby
        </button>

        <button
          onClick={handleLeaveRoom}
          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors duration-200 ease-in-out"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
