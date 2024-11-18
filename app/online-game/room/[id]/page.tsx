// app/online-game/room/[id]/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { setCurrentRoom } from '../../../store/slices/roomSlice';
// import { roomService } from '../../../services/roomService';
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
                // const room = (await roomService.getRoomsBySimpleCode(params.id)).data[0];
                // if (!room) {
                //     // Room not found, redirect back to online-game
                //     router.push('/online-game');
                //     return;
                // }
                // dispatch(setCurrentRoom(room));
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
            <Navbar title={`Room: ${currentRoom?.simpleCode || '-----'}`} />
            <GameBar onChatOpen={handleChatOpen} onLobbyClick={() => { }} />

            {!currentRoom ? <div>Loading...</div> :
                <div>
                    <h1>Room: {currentRoom.name}</h1>
                </div>
            }

            {/* Chat Modal */}
            {/* <ChatModal
                isOpen={isChatOpen}
                onClose={handleChatClose}
                roomID={currentRoom?.id || ''}
            /> */}
        </>
    )

}
