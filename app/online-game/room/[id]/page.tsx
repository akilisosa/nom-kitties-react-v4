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
import { checkCollision, checkObstacleCollisions, getScaledValue } from '@/app/local-game/utils/gameUtils';
import { baseObstacles } from './baseObstacles';
 import GameDataService  from '@/app/services/gameDataService';

// import { playerService } from '@/app/services/playerService';


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

                const { userId: owner } = await getCurrentUser();
                if (owner === room.owner) {
                    setOwner(owner)
                }
                if (!room.players?.includes(owner)) {
                    const players: any[] = room.players ? room.players : [];
                    room = (await roomService.joinRoom(room.id, [players, owner])).data[0];
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

    // Add an effect for player updates subscription
    // In your RoomPage component

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

    // useEffect(() => {
    //     try {
    //       gameDataService.connect();
    //       const subscription = gameDataService.getMessageSubject().subscribe({
    //         next: (data) => {
    //           console.log('Received data:', data);
    //           // Handle received data
    //         },
    //         error: (err) => {
    //           console.error('Subscription error:', err);
    //           setError('Failed to establish WebSocket connection.');
    //         },
    //       });
    
    //       return () => subscription.unsubscribe();
    //     } catch (err) {
    //       console.error('Connection error:', err);
    //       setError('Failed to establish WebSocket connection.');
    //     }
    //   }, [gameDataService]);

    // useEffect(() => {
    //     if (!currentRoom?.id) return;

    //     // Connect to WebSocket
    //     const connection = gameDataService.connect().subscribe({
    //         next: (data) => console.log('Received:', data),
    //         error: (error) => console.error('Error:', error),
    //         complete: () => console.log('Completed')
    //     });

    //     gameDataService.subscribe('your-channel-path');


    //         // Cleanup function
    //         return () => {
    //             connection.unsubscribe();
    //             gameDataService.disconnect();
    //           };

    // }, [currentRoom?.id]);


    // useEffect(() => {
    //     const subscription = playerService.connect().subscribe((message) => {
    //       console.log('Received message:', message);
    //     });
    
    //     playerService.connectionPromise.then(() => {
    //       playerService.subscribe('your-channel-path');
    //     }).catch((error) => {
    //       console.error('Failed to establish WebSocket connection:', error);
    //     });
    
    //     return () => {
    //       subscription.unsubscribe();
    //       playerService.disconnect();
    //     };
    //   }, []);

    // const sendMessage = () => {
    //     playerService.sendMessage('your-channel-path', { your: 'data' });
    //   };

        // Scale obstacles based on current size
        const scaledObstacles = useMemo(() =>
            baseObstacles.map((obstacle: any) => ({
                x: getScaledValue(obstacle.x, size),
                y: getScaledValue(obstacle.y, size),
                width: getScaledValue(obstacle.width, size),
                height: getScaledValue(obstacle.height, size),
                color: obstacle.color
            }))
            , [size, baseObstacles]);
    
            const handleGameTick = useCallback(() => {
                const players = playersRef.current;
                const keys = keysRef.current;
                const currentUserId = owner; // You'll need to implement this to get current user's ID
            
                players.forEach((player) => {
                    // Only calculate movement for the current player
                    if (player.id !== currentUserId) return;
            
                    // Calculate new position based on keys pressed
                    let newX = player.x;
                    let newY = player.y;
            
                    // WASD controls
                    if (keys.d) newX += player.speed; 
                    if (keys.a) newX -= player.speed;
                    if (keys.s) newY += player.speed;
                    if (keys.w) newY -= player.speed;
            
                    // Check collisions with obstacles
                    const collidesWithObstacle = checkObstacleCollisions(
                        player, 
                        newX, 
                        newY, 
                        scaledObstacles, 
                        size
                    );
            
                    // Check collisions with other players
                    const collidesWithPlayer = players.some(otherPlayer => 
                        player.id !== otherPlayer.id && 
                        checkCollision(
                            { ...player, x: newX, y: newY }, 
                            otherPlayer, 
                            size
                        )
                    );
            
                    // Update position if no collisions
                    if (!collidesWithObstacle && !collidesWithPlayer) {
                        player.x = Math.max(0, Math.min(newX, size - player.size));
                        player.y = Math.max(0, Math.min(newY, size - player.size));
            
                        // Publish the updated position to other players
                        playerService.publishEvent(`/game/${currentRoom.id}/players`, {
                            playerId: player.id,
                            x: player.x,
                            y: player.y
                        });
                    }
            
                    // Check for collectible collection
                    checkCollectibleCollection(player, true);
                });
            
            }, [size, scaledObstacles, checkCollectibleCollection, currentRoom?.id]);
            


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

