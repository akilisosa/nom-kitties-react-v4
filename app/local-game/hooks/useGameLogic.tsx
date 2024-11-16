// hooks/useGameLogic.ts
import { useState, useCallback } from 'react';
import { checkCollision, getScaledValue } from '../utils/gameUtils';

export const useGameLogic = (size: number, treatsOnFloor: number, onScoreChange: Function) => {
  const COLLECTIBLE_RADIUS = 10;
  
  const checkObstacleCollisions = useCallback((obj: any, newX: number, newY: number, obstacles: any[]): boolean => {
    const testObj = { x: newX, y: newY, width: obj.width, height: obj.height };
    return obstacles.some(obstacle => checkCollision(testObj, obstacle, size));
  }, [size]);

  const generateRandomPosition = useCallback((obstacles: any[]): { x: number, y: number } => {
    let position: { x: number; y: number } = { x: 0, y: 0 };
    let validPosition = false;

    while (!validPosition) {
      position = {
        x: Math.random() * (size - 2 * COLLECTIBLE_RADIUS) + COLLECTIBLE_RADIUS,
        y: Math.random() * (size - 2 * COLLECTIBLE_RADIUS) + COLLECTIBLE_RADIUS
      };

      validPosition = !obstacles.some(obstacle =>
        position.x + COLLECTIBLE_RADIUS > obstacle.x &&
        position.x - COLLECTIBLE_RADIUS < obstacle.x + obstacle.width &&
        position.y + COLLECTIBLE_RADIUS > obstacle.y &&
        position.y - COLLECTIBLE_RADIUS < obstacle.y + obstacle.height
      );
    }

    return position;
  }, [size, COLLECTIBLE_RADIUS]);

  const spawnCollectible = useCallback((
    currentCollectibles: any[],
    setCollectibles: Function,
    obstacles: any[]
  ) => {
    if (currentCollectibles.length < treatsOnFloor) {
      const position = generateRandomPosition(obstacles);
      setCollectibles((prev: any) => [...prev, {
        x: position.x,
        y: position.y,
        radius: COLLECTIBLE_RADIUS,
        color: 'yellow',
        active: true
      }]);
    }
  }, [treatsOnFloor, generateRandomPosition]);

  const checkCollectibleCollection = useCallback((
    player: any,
    isPlayer1: boolean,
    collectibles: any[],
    setCollectibles: Function,
    setScores: Function,
    obstacles: any[]
  ) => {
    let scoreUpdated = false;

    setCollectibles((prev: any[]) => prev.map(collectible => {
      if (collectible.active) {
        const dx = (player.x + player.width / 2) - collectible.x;
        const dy = (player.y + player.height / 2) - collectible.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (player.width / 2 + collectible.radius)) {
          scoreUpdated = true;
          setScores((prev: any) => {
            const newScores = {
              player1Score: prev.player1Score + (isPlayer1 ? 1 : 0),
              player2Score: prev.player2Score + (isPlayer1 ? 0 : 1)
            };
            onScoreChange(newScores);
            return newScores;
          });
          return { ...collectible, active: false };
        }
      }
      return collectible;
    }));

    if (scoreUpdated) {
      spawnCollectible(collectibles, setCollectibles, obstacles);
    }
  }, [spawnCollectible, onScoreChange]);

  return {
    checkObstacleCollisions,
    spawnCollectible,
    checkCollectibleCollection,
    getScaledValue: (value: number) => getScaledValue(value, size)
  };
};

