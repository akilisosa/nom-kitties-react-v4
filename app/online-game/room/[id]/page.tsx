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
import { getCurrentUser } from 'aws-amplify/auth';
import { ConsoleLogger } from 'aws-amplify/utils';

export default function RoomPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentRoom } = useAppSelector((state) => state.room);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [owner, setOwner] = useState(false);
    

    const handleChatOpen = () => {
        setIsChatOpen(true);
    };

    const handleChatClose = () => {
        setIsChatOpen(false);
    };

    useEffect(() => {

        if(currentRoom?.simpleCode === params.id && currentRoom?.id) {
            return
        }
        const loadRoom = async () => {
            console.log('currentRoom', currentRoom)
            console.log('params', params)
            try {
                
                let room = (await roomService.getRoomsBySimpleCode(params.id)).data[0];
                console.log('room', room)
                if (!room) {
                    // Room not found, redirect back to online-game
                    router.push('/online-game');
                    return;
                } 

                const {userId: owner } = await getCurrentUser();
                if (owner === room.owner) {
                   setOwner(true)
                } 
                if(!room.players?.includes(owner)) {
                    const players: any[] = room.players ? room.players : [];
                  room = (await  roomService.joinRoom(room.id, [players, owner])).data[0];
                  console.log('aye')
                  console.log('room', room)
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
            <Navbar title={`Room: ${currentRoom?.simpleCode || '-----'}`} />
            <GameBar onChatOpen={handleChatOpen} onLobbyClick={() => { }} />

            {!currentRoom ? <div>Loading...</div> :
                <div>
                    <h1>Room: {currentRoom.name}</h1>
                </div>
            }

            {/* Chat Modal */}
            <ChatModal
                isOpen={isChatOpen}
                onClose={handleChatClose}
                roomID={currentRoom?.id || ''}
            />
        </>
    )

}
