'use client';
import { useEffect, useRef } from "react";
import { drawKitty } from "./utils/drawUtils";

interface Player {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
}

interface GameBoardProps {
    size: number;
    playerList: Player[]
    obstacleList: any[];
    collectibles: any[];
    onGameTick: () => void;
  }
  
  export function GameBoard({ size, playerList, obstacleList, collectibles, onGameTick }: GameBoardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();

    // const animationFrameId = useRef(null);
    const lastUpdateTimeRef = useRef(0);
    const updateInterval = 3000 / 1; // 20 times per second
  

  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
  
      const gameLoop = (timestamp: any) => {
        if (timestamp - lastUpdateTimeRef.current >= updateInterval) {
          lastUpdateTimeRef.current = timestamp;
        
        // Clear and draw background
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0, 0, size, size);

        obstacleList.forEach(obstacle => {
                    ctx.fillStyle = obstacle.color || '#666666';
                    ctx.fillRect(
                      obstacle.x,
                      obstacle.y,
                      obstacle.width,
                      obstacle.height // scaledHeight // assuming square obstacles
                    );
                  });
            
                  collectibles.forEach(collectible => {
                    if (collectible.active) {
                        ctx.beginPath();
                        ctx.arc(collectible.x, collectible.y, collectible.radius, 0, Math.PI * 2);
                        ctx.fillStyle = collectible.color;
                        ctx.fill();
                        ctx.closePath();
                    }
                });
  
        // Draw players
       playerList.forEach(player => {
            drawKitty(ctx, player.x, player.y, player.size, player.color);
            });
            console.log('doing this on game tick')
  
        onGameTick();
          }
       // requestAnimationFrame(gameLoop);
        animationFrameId.current = requestAnimationFrame(gameLoop);
      };
  
      animationFrameId.current = requestAnimationFrame(gameLoop);
   // Cleanup function
   return () => {
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
};
    }, [size, playerList, obstacleList, onGameTick]);
  
    return (
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ border: '1px solid black' }}
      />
    );
  }
  
