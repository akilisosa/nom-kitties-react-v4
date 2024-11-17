'use client';
import { useEffect, useRef, useState } from 'react';
import { FiSettings } from 'react-icons/fi'; // Using react-icons for the settings icon


interface GameHeaderProps {
    gameState: string;
    initialTime?: number;
    onTimeEnd?: () => void;
    onSettingsClick?: () => void;
  }

export const GameHeader = ({ 
    gameState, 
    initialTime = 300, 
    onTimeEnd 
  }: GameHeaderProps ) => {
  const [settingsView, setSettingsView] = useState(false);
  const [timer, setTimer] = useState('00:00'); // Add timer logic as needed
  const [active] = useState(true);

  const timeRef = useRef<number>(30); // 300 seconds = 5 minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  // Reset timer when game starts
  
  useEffect(() => {
  if (gameState === 'running') {
    // Start or resume countdown
    intervalRef.current = setInterval(() => {
      timeRef.current -= 1;
      
      const minutes = Math.floor(timeRef.current / 60);
      const seconds = timeRef.current % 60;
      
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      
      if (timeRef.current <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          onTimeEnd?.();
        }
      }
    }, 1000);
  } else {
    // Clear interval if game is paused or idle
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset timer if game is idle
    if (gameState === 'idle') {
      timeRef.current = initialTime;
      const minutes = Math.floor(initialTime / 60);
      const seconds = initialTime % 60;
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [gameState, initialTime, onTimeEnd]);

  return (
    <div className="w-full px-4 py-2 flex flex-row justify-between items-center">
      {/* Login Button */}
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.href = '/dashboard'}
      >
        Login
      </button>

      {/* Timer */}
      <button 
        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      >
        <p className="text-2xl m-0 font-bold">{timer}</p>
      </button>

      {/* Settings Button */}
      <button 
        className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded
          ${active ? 'opacity-50' : ''}`}
        onClick={() => setSettingsView(!settingsView)}
      >
        <p className="text-2xl m-0">
          <FiSettings />
        </p>
      </button>
    </div>
  );
};
