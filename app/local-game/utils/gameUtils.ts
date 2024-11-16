// utils/gameUtils.ts
export const getScaledValue = (originalValue: number, size: number): number => {
  const scaleFactor = size / 600;
  return originalValue * scaleFactor;
};

export const checkCollision = (obj1: any, obj2: any, size: number): boolean => {
  return (
    obj1.x < obj2.x + obj2.size &&
    obj1.x + obj1.size > obj2.x &&
    obj1.y < obj2.y + obj2.size &&
    obj1.y + obj1.size > obj2.y
  );

};

const checkcollideWithObstacle = (obj: any, obstacle: any, size: number): boolean => {
  const scaledObj = {
    x: obj.x,
    y: obj.y,
    width: obj.size,
    height: obj.size
  };


 return (
    scaledObj.x < obstacle.x + obstacle.width &&
    scaledObj.x + scaledObj.width > obstacle.x &&
    scaledObj.y < obstacle.y + obstacle.height &&
    scaledObj.y + scaledObj.height > obstacle.y
  );
  
}

export const checkObstacleCollisions = (obj: any, newX: number, newY: number, obstacles: any[], size: number): boolean => {
  const testObj = { x: newX, y: newY, size: obj.size };
  return obstacles.some(obstacle => checkcollideWithObstacle(testObj, obstacle, size));
}
