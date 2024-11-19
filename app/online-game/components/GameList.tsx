
'use client';

import { Schema } from '@/amplify/data/resource';
import Image from 'next/image';
import { IoGameController } from 'react-icons/io5';
// import React from 'react';

type Room = Schema['Room']['type'];

  
  interface GameListProps {
    roomList: Room[];
    onJoinGame: (game: Room) => void;
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
          {roomList.map((room) => (
            <div 
              key={room.id}
              onClick={() => onJoinGame(room)}
              className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <h2 className="font-medium">{room.simpleCode}</h2>
                <p className="text-gray-600">{room.mode}</p>
              </div>
              {/* Using a game controller icon from heroicons or similar */}
              <IoGameController className="w-6 h-6 text-blue-500" />
            </div>
          ))}
        </div>
      </>
    );
  };
  
  export default GameList;
  