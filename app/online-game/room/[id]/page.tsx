// app/online-game/room/[id]/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { setCurrentRoom } from '../../../store/slices/roomSlice';
import { roomService } from '../../../services/roomService';
import Navbar from '@/app/components/NavBar';
import GameBar from './components/GameBar';
import ChatModal from '@/app/components/ChatModal';
import { getCurrentUser } from 'aws-amplify/auth';
import { GameBoard } from '@/app/components/GameBoard/GameBoardv2';
import { useFullGameSize } from '@/app/local-game/hooks/useFullGameSize';
import { checkCollision, checkObstacleCollisions, checkObstacleCollisionsv2, getScaledValue } from '@/app/local-game/utils/gameUtils';
import { baseObstacles } from './baseObstacles';
 import GameDataService  from '@/app/services/gameDataService';



type Player = {
    id: string;
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    // add other player properties as needed
};

export default function RoomPage({ params }: { params: { id: string } }) {
    const router = useRouter();
     const gameDataService = new GameDataService();
    const dispatch = useAppDispatch();
    const { currentRoom } = useAppSelector((state) => state.room);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [owner, setOwner] = useState('');
    const [admin, setAdmin] = useState(false);
    // Use useRef for players instead of useState
    const playersRef = useRef<Player[]>([]);
    const size = useFullGameSize();
    const [error, setError] = useState<string | null>(null);
    const gameDataServiceRef = useRef<GameDataService | null>(null);
    // Keyboard state tracking
    const keysRef = useRef<{ [key: string]: boolean }>({});

    // Set up keyboard listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysRef.current[e.key] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysRef.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    const handleChatOpen = (isOpen?:boolean) => {
        setIsChatOpen(true);
    };

    const handleChatClose = () => {
        setIsChatOpen(false);
    };

    function checkCollectibleCollection(p1: any, arg1: boolean) {
        // throw new Error('Function not implemented.');
     }
    
    useEffect(() => {

        if (currentRoom?.simpleCode === params.id && currentRoom?.id) {
            return
        }
        const loadRoom = async () => {
            try {
                let room = (await roomService.getRoomsBySimpleCode(params.id)).data[0];
                if (!room) {
                    // Room not found, redirect back to online-game
                    router.push('/online-game');
                    return;
                }

                const { userId: owner } = await getCurrentUser();
                if (owner === room.owner) {
                    setOwner(owner)
                }
                if (!room.players?.includes(owner)) {
                    const players: any[] = room.players ? room.players : [];
                    room = (await roomService.joinRoom(room.id, [...players, owner])).data[0];
                }

            if(!playersRef.current.some(player => player.id === owner)) {
                playersRef.current.push({ id: owner, x: 0, y: 0, size: 50, color: 'blue', speed: 15 });
            }
 
            // get playerRef from the current room
            // const i = playersRef.current.findIndex((player: any) => player.id === owner);
            // if(i !== -1) { 
            //     playersRef.current[i].size = getScaledValue(50, size);
            //     playersRef.current[i].speed = getScaledValue(15, size);
            // }
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


    useEffect(() => {
        if (!gameDataServiceRef.current) {
          gameDataServiceRef.current = new GameDataService();
          gameDataServiceRef.current.connect();
        }
    
        const subscription = gameDataServiceRef.current.getMessageSubject().subscribe({
          next: (data) => {
            console.log('Received data:', data);
            // Handle received data
          },
          error: (err) => {
            console.error('Subscription error:', err);
            setError('Failed to establish WebSocket connection.');
          },
        });
    
        return () => subscription.unsubscribe();
      }, []);



        // Scale obstacles based on current size
        const scaledObstacles = useMemo(() =>
            baseObstacles.map((obstacle: any) => ({
                x: getScaledValue(obstacle.x, size),
                y: getScaledValue(obstacle.y, size),
                width: getScaledValue(obstacle.width, size),
                height: getScaledValue(obstacle.height, size),
                color: obstacle.color
            }))
            , [size]);

            const handleGameTick = useCallback(() => {
                console.log('wow')
            }, [])
    
//             const handleGameTick = useCallback(() => {
//                 const players = playersRef.current;

//                 const keys = keysRef.current;
//                 const currentUserId = owner; // You'll need to implement this to get current user's ID

//                 players.forEach((player) => {
//                     // Only calculate movement for the current player
//                     console.log('player', player)
                
//                     if (player.id !== currentUserId) return;

//                     // Calculate new position based on keys pressed
//                     let newX = player.x;
//                     let newY = player.y;
            
//                     // WASD controls
//                     if (keys.d) newX += player.speed; 
//                     if (keys.a) newX -= player.speed;
//                     if (keys.s) newY += player.speed;
//                     if (keys.w) newY -= player.speed;

//                         // Calculate player size based on the current size
//                         player.size = getScaledValue(50, size);

//                            // Check collisions with obstacles
//       const { x: maxDistanceX, y: maxDistanceY } = checkObstacleCollisionsv2(
//         player,
//         newX,
//         newY,
//         scaledObstacles,
//       );

//   // Handle X-axis collision
// if (maxDistanceX !== Infinity) {  // If there's a collision on X-axis
//   const directionX = newX - player.x;
//   if (directionX > 0) {  // Moving right
//     newX = player.x;  // Stop at current position
//   } else if (directionX < 0) {  // Moving left
//     newX = player.x;  // Stop at current position
//   }
// }

// // Handle Y-axis collision
// if (maxDistanceY !== Infinity) {  // If there's a collision on Y-axis
//   const directionY = newY - player.y;
//   if (directionY > 0) {  // Moving down
//     newY = player.y;  // Stop at current position
//   } else if (directionY < 0) {  // Moving up
//     newY = player.y;  // Stop at current position
//   }
// }



            
//                     // old // Check collisions with obstacles
//                     // const collidesWithObstacle = checkObstacleCollisions(
//                     //     player, 
//                     //     newX, 
//                     //     newY, 
//                     //     scaledObstacles, 
//                     //     size
//                     // );
            
//                     // Check collisions with other players
//                     const collidesWithPlayer = players.some(otherPlayer => 
//                         player.id !== otherPlayer.id && 
//                         checkCollision(
//                             { ...player, x: newX, y: newY }, 
//                             otherPlayer, 
//                             size
//                         )
//                     );

       
//                     console.log('collidesWithPlayer', collidesWithPlayer)
//                     // Update position if no collisions
//                     console.log('collidesWithObstacle', maxDistanceX < player.speed || maxDistanceY < player.speed);
//                     console.log('collidesWithPlayer', collidesWithPlayer);
//                     // Update position if no collisions
//                     if ((maxDistanceX >= player.speed || maxDistanceY >= player.speed) && !collidesWithPlayer) {
//                       player.x = Math.max(0, Math.min(newX, size - player.size));
//                       player.y = Math.max(0, Math.min(newY, size - player.size));
              
//                       // Publish the updated position to other players
//                       gameDataServiceRef.current?.sendMessage('playerUpdate', {
//                         playerId: player.id,
//                         x: player.x,
//                         y: player.y,
//                       });
//                     }



//                     // old
//                     // if (!collidesWithObstacle && !collidesWithPlayer) {
//                     //     player.x = Math.max(0, Math.min(newX, size - player.size));
//                     //     player.y = Math.max(0, Math.min(newY, size - player.size));
            
//                     //     // Publish the updated position to other players
//                     //     // gameDataService.publishEvent(`/game/${currentRoom.id}/players`, {
//                     //     //     playerId: player.id,
//                     //     //     x: player.x,
//                     //     //     y: player.y
//                     //     // });
//                     // }
            
//                     // Check for collectible collection
//                     checkCollectibleCollection(player, true);
//                 });
            
//             }, [size, checkCollectibleCollection, currentRoom?.id]);
            

    return (
        <>
            <Navbar title={`Room: ${currentRoom?.simpleCode || '-----'}`} />
            <GameBar onChatOpen={handleChatOpen} onLobbyClick={() => { }} />

            {!currentRoom ? <div>Loading...</div> :
                <div>
                    <h1>Room: {currentRoom.name}</h1>
                </div>
            }

            <GameBoard size={size} playerList={playersRef.current} 
            obstacleList={scaledObstacles}
             collectibles={[]}
             onGameTick={handleGameTick} />

            {/* Chat Modal */}
            <ChatModal
                isOpen={isChatOpen}
                onClose={handleChatClose}
                roomID={currentRoom?.id || ''}
            />
        </>
    )

}

