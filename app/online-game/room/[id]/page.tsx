// app/online-game/room/[id]/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { setCurrentRoom } from '../../../store/slices/roomSlice';
import { roomService } from '../../../services/roomService';

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentRoom } = useAppSelector((state) => state.room);

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

  // Show loading state while room is being fetched
  if (!currentRoom) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Room: {currentRoom.name}</h1>
      {/* Room content */}
    </div>
  );
}
