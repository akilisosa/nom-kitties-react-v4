'use client';
// components/GameContainer.tsx
import { useCallback, useEffect, useRef } from 'react';
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
}

export function GameContainer({ size, player1Color, player2Color, onScoreChange }: GameContainerProps) {
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



  const obstacles = useRef<Obstacle[]>([
    {
      x: getScaledValue(200, size),
      y: getScaledValue(200, size),
      width: getScaledValue(100, size),
      height: getScaledValue(20, size),
      color: 'gray'
    },
    {
      x: getScaledValue(400, size),
      y: getScaledValue(100, size),
      width: getScaledValue(20, size),
      height: getScaledValue(200, size),
      color: 'gray'
    },
    {
      x: getScaledValue(100, size),
      y: getScaledValue(400, size),
      width: getScaledValue(200, size),
      height: getScaledValue(20, size),
      color: 'gray'
    }
  ]);

    // Add an effect to update obstacle sizes when the game size changes
useEffect(() => {
    obstacles.current = obstacles.current.map(obstacle => ({
      ...obstacle,
      x: getScaledValue(obstacle.x / (size / 600), size),
      y: getScaledValue(obstacle.y / (size / 600), size),
      width: getScaledValue(obstacle.width / (size / 600), size),
      height: getScaledValue(obstacle.height / (size / 600), size),
    }));
  }, [size]);

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

    // Game logic
    const handleGameTick = useCallback(() => {
        const p1 = player1Ref.current;
        const p2 = player2Ref.current;
        console.log('Player 1:', p1);
        const keys = keysRef.current;

        //  Calculate potential new positions
        const newP1X = p1.x + (keys.d ? p1.speed : (keys.a ? -p1.speed : 0));
        const newP1Y = p1.y + (keys.s ? p1.speed : (keys.w ? -p1.speed : 0));
        const newP2X = p2.x + (keys.ArrowRight ? p2.speed : (keys.ArrowLeft ? -p2.speed : 0));
        const newP2Y = p2.y + (keys.ArrowDown ? p2.speed : (keys.ArrowUp ? -p2.speed : 0));

        const p1CollidesWithObstacle = checkObstacleCollisions(p1, newP1X, newP1Y, obstacles.current, size);
        const p2CollidesWithObstacle = checkObstacleCollisions(p2, newP2X, newP2Y, obstacles.current, size);

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

    }, [size]);

    // Update player colors when they change
    useEffect(() => {
        player1Ref.current.color = player1Color;
        player2Ref.current.color = player2Color;
    }, [player1Color, player2Color]);

    return (
        <GameBoard
            size={size}
            player1={player1Ref.current}
            player2={player2Ref.current}
            obstacleList={obstacles.current}
            onGameTick={handleGameTick}
        />
    );
}