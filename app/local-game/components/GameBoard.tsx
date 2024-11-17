'use client';
import { useEffect, useRef } from "react";
import { drawKitty } from "../utils/drawUtils";

// interface GameBoardProps {
//   size: number;
//   active: boolean;
//   player1Color: string;
//   player2Color: string;
//   obstacles: any[];
//   collectables: any[];
// }

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  size: number;
  color: string;
}

// GameBoard.tsx (rendering component)
interface GameBoardProps {
    size: number;
    player1: Player; // Player;
    player2: Player;//Player;
    obstacleList: any[];
    collectibles: any[];
    onGameTick: () => void;
  }
  
  export function GameBoard({ size, player1, player2, obstacleList, collectibles, onGameTick }: GameBoardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();

  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
  
      const gameLoop = () => {
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
        drawKitty(ctx, player1.x, player1.y, player1.size, player1.color);
        drawKitty(ctx, player2.x, player2.y, player2.size, player2.color);
  
        onGameTick();
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
    }, [size, player1, player2, obstacleList, onGameTick]);
  
    return (
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ border: '1px solid black' }}
      />
    );
  }
  
  



// 'use client';
// import { useEffect, useRef } from 'react';
// import { checkCollision, checkObstacleCollisions, getScaledValue } from '../utils/gameUtils';
// import { drawKitty } from '../utils/drawUtils';

// interface GameBoardProps {
//   size: number;
//   active: boolean;
//   player1Color: string;
//   player2Color: string;
//   obstacles: any[];
//   collectables: any[];
// }

// interface Player {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   speed: number;
//   size: number;
//   color: string;
// }

// export function GameBoard({
//   size,
//   active,
//   player1Color,
//   player2Color,
//   obstacles,
// }: GameBoardProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   // Use refs for players
//   const player1Ref = useRef<Player>({
//     x: 100,
//     y: 100,
//     width: 50,
//     height: 50,
//     speed: 5,
//     size: getScaledValue(50, size),
//     color: player1Color,
//   });

//   const player2Ref = useRef<Player>({
//     x: 500,
//     y: 100,
//     width: 50,
//     height: 50,
//     speed: 5,
//     size: getScaledValue(50, size),
//     color: player2Color,
//   });

//   // Use ref for keys instead of state
//   const keysRef = useRef({
//     w: false,
//     s: false,
//     a: false,
//     d: false,
//     ArrowUp: false,
//     ArrowDown: false,
//     ArrowLeft: false,
//     ArrowRight: false,
//   });

//   // Keyboard event listeners
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key in keysRef.current) {
//         event.preventDefault();
//         keysRef.current[event.key as keyof typeof keysRef.current] = true;
//       }
//     };

//     const handleKeyUp = (event: KeyboardEvent) => {
//       if (event.key in keysRef.current) {
//         event.preventDefault();
//         keysRef.current[event.key as keyof typeof keysRef.current] = false;
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   // Initialize player positions
//   useEffect(() => {
//     player1Ref.current = {
//       ...player1Ref.current,
//      size: getScaledValue(50, size),
//       height: getScaledValue(50, size),
//       speed: getScaledValue(5, size),
//       x: 0,
//       y: 0
//     };

//     player2Ref.current = {
//       ...player2Ref.current,
//      size: getScaledValue(50, size),
//       height: getScaledValue(50, size),
//       speed: getScaledValue(5, size),
//       x: size,
//       y: 0
//     };
//   }, [size]); // Only run when size changes


//   // Game loop
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !active) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Set canvas size
//     canvas.width = size;
//     canvas.height = size;

//     let animationId: number;

//     const gameLoop = () => {
//       const p1 = player1Ref.current;
//       const p2 = player2Ref.current;
//       const keys = keysRef.current;

//          // Calculate potential new positions
//          const newP1X = p1.x + (keys.d ? p1.speed : (keys.a ? -p1.speed : 0));
//          const newP1Y = p1.y + (keys.s ? p1.speed : (keys.w ? -p1.speed : 0));
//          const newP2X = p2.x + (keys.ArrowRight ? p2.speed : (keys.ArrowLeft ? -p2.speed : 0));
//          const newP2Y = p2.y + (keys.ArrowDown ? p2.speed : (keys.ArrowUp ? -p2.speed : 0));

//          const p1CollidesWithObstacle = checkObstacleCollisions(p1, newP1X, newP1Y, obstacles, size);
//          const p2CollidesWithObstacle = checkObstacleCollisions(p2, newP2X, newP2Y, obstacles, size);
     
//          const p1CollidesWithp2 = checkCollision({...p1, x: newP1X, y: newP1Y}, p2, size);
//          const p2CollidesWithp1 = checkCollision( { ...p2, x: newP2X, y: newP2Y },p1,size);
   
//          if(!p1CollidesWithObstacle && !p1CollidesWithp2){
//             p1.x = Math.max(0, Math.min(newP1X, size - p1.size));
//             p1.y = Math.max(0, Math.min(newP1Y, size - p1.size));
//          }

//          if(!p2CollidesWithObstacle && !p2CollidesWithp1){
//             p2.x = Math.max(0, Math.min(newP2X, size - p2.size));
//             p2.y = Math.max(0, Math.min(newP2Y, size - p2.size));
//          }

//       // Clear and draw
//       ctx.clearRect(0, 0, size, size);
//       ctx.fillStyle = 'lightgray';
//       ctx.fillRect(0, 0, size, size);

//       obstacles.forEach(obstacle => {
//         ctx.fillStyle = obstacle.color || '#666666';
//         ctx.fillRect(
//           obstacle.x,
//           obstacle.y,
//           obstacle.width,
//           obstacle.height // scaledHeight // assuming square obstacles
//         );
//       });

//       // Draw players
//     //   ctx.fillStyle = p1.color;
//       drawKitty(ctx, p1.x, p1.y, p1.size, p1.color);

//       ctx.fillStyle = p2.color;
//       drawKitty(ctx, p2.x, p2.y, p2.size, p2.color);
//      // ctx.fillRect(p2.x, p2.y, p2.width, p2.height);

//       animationId = requestAnimationFrame(gameLoop);
//     };

//     animationId = requestAnimationFrame(gameLoop);

//     return () => {
//       cancelAnimationFrame(animationId);
//     };
//   }, [active, size]);

//   // Update player colors when props change
//   useEffect(() => {
//     player1Ref.current.color = player1Color;
//     player2Ref.current.color = player2Color;
//   }, [player1Color, player2Color]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="border border-gray-300"
//       style={{
//         width: size,
//         height: size,
//       }}
//     />
//   );
// }
