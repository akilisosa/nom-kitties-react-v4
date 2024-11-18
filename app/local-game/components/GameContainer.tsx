'use client';
// components/GameContainer.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameBoard } from './GameBoard';
import { checkCollision, checkObstacleCollisions, getScaledValue } from '../utils/gameUtils';

interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    size: number;
    color: string;
    speed: number;
}

interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }

interface GameContainerProps {
    size: number;
    player1Color: string;
    player2Color: string;
    onScoreChange: (scores: { player1: number; player2: number }) => void;
    treatsOnFloor: number;
    initialCollectibles: Collectible[];
}

interface Collectible {
    x: number;
    y: number;
    radius: number;
    color: string;
    active: boolean;
}

export function GameContainer({ size, player1Color, player2Color, onScoreChange, treatsOnFloor = 3,   initialCollectibles  }: GameContainerProps) {
    const COLLECTIBLE_RADIUS = getScaledValue(10, size); // Adjust size as needed
    const [collectibles, setCollectibles] = useState<Collectible[]>(initialCollectibles);
    const [scores, setScores] = useState({ player1: 0, player2: 0 });
    const isInitialized = useRef(false);
  
    // Player refs for position tracking
    const player1Ref = useRef<Player>({
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        size: getScaledValue(50, size),
        color: player1Color,
        speed: getScaledValue(5, size),
    });

    
    const player2Ref = useRef<Player>({
        x: size,
        y: 0,
        width: 50,
        height: 50,
        size: getScaledValue(50, size),
        color: player2Color,
        speed: getScaledValue(5, size),
    });

      // Update scaled values when size changes
  useEffect(() => {
    player1Ref.current.size = getScaledValue(50, size);
    player1Ref.current.speed = getScaledValue(5, size);
    
    player2Ref.current.size = getScaledValue(50, size);
    player2Ref.current.speed = getScaledValue(5, size);
  }, [size]);

  const baseObstacles = useMemo(() => [
    {
        x: 200,  // original positions
        y: 200,
        width: 100,
        height: 20,
        color: 'gray'
    },
    {
        x: 400,
        y: 100,
        width: 20,
        height: 200,
        color: 'gray'
    },
    {
        x: 100,
        y: 400,
        width: 200,
        height: 20,
        color: 'gray'
    }
], []); // Empty dependency array since these are constant

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

    // Track the animation frame ID
    const animationFrameId = useRef<number>();

        // Initialize collectibles when component mounts
        // useEffect(() => {
      
        //     // Initial spawn of collectibles
        //     const initialCollectibles = [];

        //     // initialCollectibles.push({
        //     //     x: player1Ref.current.size, // Just to the right of player 1
        //     //     y: player1Ref.current.size + 2, 
        //     //     radius: COLLECTIBLE_RADIUS,
        //     //     color: 'yellow',
        //     //     active: true
        //     // });
    
        //     // Place second collectible near player 2's starting position
        //     initialCollectibles.push({
        //         x: size - player2Ref.current.size, // Just to the left of player 2
        //         y: player2Ref.current.size + 10,
        //         radius: COLLECTIBLE_RADIUS,
        //         color: 'yellow',
        //         active: true
        //     });
        //     // console.log('treatsOnFloor:', treatsOnFloor);
        //     for (let i = 1; i < treatsOnFloor; i++) {
        //         const position = generateRandomPosition();
        //         initialCollectibles.push({
        //             x: position.x,
        //             y: position.y,
        //             radius: COLLECTIBLE_RADIUS,
        //             color: 'yellow',
        //             active: true
        //         });
        //     }
        //     setCollectibles(initialCollectibles);
        //     // isInitialized.current = true;
        // // }
        // }, [treatsOnFloor]);
    
        

const generateRandomPosition = (): { x: number, y: number } => {
    let position: any;
    let validPosition = false;
  
    while (!validPosition) {
        position = {
            x: Math.random() * (size - 2 * COLLECTIBLE_RADIUS) + COLLECTIBLE_RADIUS,
            y: Math.random() * (size - 2 * COLLECTIBLE_RADIUS) + COLLECTIBLE_RADIUS
        };
  
        // Check if position DOESN'T overlap with any obstacles
        validPosition = !scaledObstacles.some(obstacle =>
            position.x + COLLECTIBLE_RADIUS > obstacle.x &&
            position.x - COLLECTIBLE_RADIUS < obstacle.x + obstacle.width &&
            position.y + COLLECTIBLE_RADIUS > obstacle.y &&
            position.y - COLLECTIBLE_RADIUS < obstacle.y + obstacle.height
        );
    }
  
    return position;
}


// undo
    // const spawnCollectible = useCallback(() => {
    //     if (collectibles.length < treatsOnFloor) {
    //         const position = generateRandomPosition();
    //         setCollectibles(prev => [...prev, {
    //             x: position.x,
    //             y: position.y,
    //             radius: COLLECTIBLE_RADIUS,
    //             color: 'yellow',
    //             active: true
    //         }]);
    //     }
    // }, [collectibles.length, treatsOnFloor, COLLECTIBLE_RADIUS]);
    

    // undo
    // useEffect(() => {
    //     // Reset and regenerate collectibles when size changes
    //     const newCollectibles = [];
    //     for (let i = 0; i < treatsOnFloor; i++) {
    //         const position = generateRandomPosition();
    //         newCollectibles.push({
    //             x: position.x,
    //             y: position.y,
    //             radius: COLLECTIBLE_RADIUS,
    //             color: 'yellow',
    //             active: true
    //         });
    //     }
    //     setCollectibles(newCollectibles);
    // }, [size, COLLECTIBLE_RADIUS, treatsOnFloor, scaledObstacles]);
      // Keep the size change effect
//   useEffect(() => {
//     if (isInitialized.current) {
//       setCollectibles(prevCollectibles => {
//         const newCollectibles = [];
//         for (let i = 0; i < treatsOnFloor; i++) {
//           const position = generateRandomPosition();
//           newCollectibles.push({
//             x: position.x,
//             y: position.y,
//             radius: COLLECTIBLE_RADIUS,
//             color: 'yellow',
//             active: true
//           });
//         }
//         return newCollectibles;
//       });
//     }
//   }, [size]);

//   useEffect(() => {
//     if (isInitialized.current && collectibles.length < treatsOnFloor) {
//       spawnCollectible();
//     }
//   }, [collectibles.length, treatsOnFloor]);


    // Add a separate effect to handle spawning new collectibles
// useEffect(() => {
//     if (collectibles.length < treatsOnFloor) {

//         spawnCollectible();
//     }
// }, [collectibles.length, size, treatsOnFloor, scaledObstacles]);

    const checkCollectibleCollection = useCallback((player: Player, isPlayer1: boolean) => {
        setCollectibles(prevCollectibles => {
            const newCollectibles = prevCollectibles.map(collectible => {
                if (!collectible.active) return collectible;
               
                const dx = (player.x + player.size / 2) - collectible.x;
                const dy = (player.y + player.size / 2) - collectible.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < (player.size / 2 + collectible.radius)) {
                    // Update scores in a separate effect
                    setScores(prev => {
                        const newScores = isPlayer1 
                            ? { ...prev, player1: prev.player1 + 1 }
                            : { ...prev, player2: prev.player2 + 1 };
                        onScoreChange(newScores);
                        return newScores;
                    });
                    return { ...collectible, active: false };
                }
                return collectible;
            });
    
            // Filter out inactive collectibles
            return newCollectibles.filter(c => c.active);
        });
    }, [onScoreChange]);
    // initialize collectibles

    // Game logic
    const handleGameTick = useCallback(() => {
        const p1 = player1Ref.current;
        const p2 = player2Ref.current;
        // console.log('Player 1:', p1);
        const keys = keysRef.current;

        //  Calculate potential new positions
        const newP1X = p1.x + (keys.d ? p1.speed : (keys.a ? -p1.speed : 0));
        const newP1Y = p1.y + (keys.s ? p1.speed : (keys.w ? -p1.speed : 0));
        const newP2X = p2.x + (keys.ArrowRight ? p2.speed : (keys.ArrowLeft ? -p2.speed : 0));
        const newP2Y = p2.y + (keys.ArrowDown ? p2.speed : (keys.ArrowUp ? -p2.speed : 0));

        const p1CollidesWithObstacle = checkObstacleCollisions(p1, newP1X, newP1Y, scaledObstacles, size);
        const p2CollidesWithObstacle = checkObstacleCollisions(p2, newP2X, newP2Y, scaledObstacles, size);

        const p1CollidesWithp2 = checkCollision({ ...p1, x: newP1X, y: newP1Y }, p2, size);
        const p2CollidesWithp1 = checkCollision({ ...p2, x: newP2X, y: newP2Y }, p1, size);

        if (!p1CollidesWithObstacle && !p1CollidesWithp2) {
            p1.x = Math.max(0, Math.min(newP1X, size - p1.size));
            p1.y = Math.max(0, Math.min(newP1Y, size - p1.size));
        }

        if (!p2CollidesWithObstacle && !p2CollidesWithp1) {
            p2.x = Math.max(0, Math.min(newP2X, size - p2.size));
            p2.y = Math.max(0, Math.min(newP2Y, size - p2.size));
        }

         // Check for collectible collection
         checkCollectibleCollection(p1, true);
         checkCollectibleCollection(p2, false);

    }, [size, scaledObstacles, checkCollectibleCollection]);

    // Update player colors when they change
    useEffect(() => {
        player1Ref.current.color = player1Color;
        player2Ref.current.color = player2Color;
    }, [player1Color, player2Color]);

    // console.log('collectibles:', collectibles);
    return (
        <GameBoard
            size={size}
            player1={player1Ref.current}
            player2={player2Ref.current}
            obstacleList={scaledObstacles}
            collectibles={collectibles}
            onGameTick={handleGameTick}
        />
    );
}