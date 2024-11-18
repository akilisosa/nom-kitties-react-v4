// app/online-game/room/[id]/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { setCurrentRoom } from '../../../store/slices/roomSlice';
import { roomService } from '../../../services/roomService';
import Navbar from '@/app/components/NavBar';
import GameBar from './components/GameBar';
import ChatModal from '@/app/components/ChatModal';

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentRoom } = useAppSelector((state) => state.room);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatOpen = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const room = (await roomService.getRoomsBySimpleCode(params.id)).data[0];
        if (!room) {
          // Room not found, redirect back to online-game
          router.push('/online-game');
          return;
        }
        dispatch(setCurrentRoom(room));
      } catch (error) {
        console.error('Error loading room:', error);
        router.push('/online-game');
      }
    };

    loadRoom();

    // Cleanup when leaving the room
    return () => {
      dispatch(setCurrentRoom(null));
    };
  }, [params.id, dispatch, router]);


  return (
    <>
    <Navbar title={`Room: ${currentRoom?.simpleCode || '-----'}`}/>
<GameBar onChatOpen={handleChatOpen} onLobbyClick={() => {}} onLeaveRoom={() => {}} />
    
    { !currentRoom ? <div>Loading...</div> :
         <div>
         <h1>Room: {currentRoom.name}</h1>
         {/* Room content */}
       </div>
       }

          {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={handleChatClose}
      />

           {/* Chat Modal */}
      {/* {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
         
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )} 
      */}
    </>
  )

}
