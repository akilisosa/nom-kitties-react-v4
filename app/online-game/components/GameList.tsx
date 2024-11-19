
'use client';

import Image from 'next/image';
// import React from 'react';
interface Game {
    simpleCode: string;
    mode: string;
  }
  
  interface GameListProps {
    roomList: Game[];
    onJoinGame: (game: Game) => void;
  }


  
  const GameList: React.FC<GameListProps> = ({ roomList, onJoinGame }) => {
    return (
      <>
        <div className="border-b">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <Image 
                src="/favicon.ico" 
                alt="Game icon" 
                width={30}
                height={30}
                className="w-[30px] h-[30px] mr-4"
              />
              <h2 className="text-lg font-semibold">Public Games</h2>
            </div>
            {/* Using a filter icon from heroicons or similar */}
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414v6.586a1 1 0 01-1.414.914l-2-1A1 1 0 0110 19.414V13.707L3.293 7.293A1 1 0 013 6.586V4z" 
              />
            </svg>
          </div>
        </div>
  
        <div className="divide-y">
          {roomList.map((game) => (
            <div 
              key={game.simpleCode}
              onClick={() => onJoinGame(game)}
              className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <h2 className="font-medium">{game.simpleCode}</h2>
                <p className="text-gray-600">{game.mode}</p>
              </div>
              {/* Using a game controller icon from heroicons or similar */}
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  export default GameList;
  