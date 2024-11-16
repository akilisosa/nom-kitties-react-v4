'use client';
import { useState } from 'react';
import Navbar from '../components/NavBar';
import { CharacterSelect } from './components/CharacterSelect';
import { Character2Select } from './components/Character2Select';
import { GameBoard } from './components/GameBoard';
import { useGameSize } from './hooks/useGameSize';
import { useScreenSize } from './hooks/useScreenSize';
import { getScaledValue } from './utils/drawUtils';

export default function LocalGame() {
  const [player1Color, setPlayer1Color] = useState('#a85c32');
  const [player2Color, setPlayer2Color] = useState('#FFF');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [active, setActive] = useState(true);
  // const [gameSize] = useState(600); // or whatever size you want
  const [treatsOnFloor] = useState(10); // or however many treats you want

  // custom hooks
  const gameSize = useGameSize();
  const isLargeScreen = useScreenSize();

  // Define the color change handler
  const handleColorChange = (color: string, player: 'player1' | 'player2') => {
    if (player === 'player1') {
      setPlayer1Color(color);
    } else {
      setPlayer2Color(color);
    }
  };

  const handleScoreChange = (scores: { player1: number; player2: number }) => {
    setPlayer1Score(scores.player1);
    setPlayer2Score(scores.player2);
  };

  const obstacles: any[] = [
    // Example obstacles - adjust positions and sizes as needed
    { x: getScaledValue(200, gameSize), y: getScaledValue(200, gameSize), width: getScaledValue(100, gameSize), height: getScaledValue(20, gameSize), color: 'gray' },  // Horizontal wall
    { x: getScaledValue(400, gameSize), y: getScaledValue(100, gameSize), width: getScaledValue(20, gameSize), height: getScaledValue(200, gameSize), color: 'gray' },  // Vertical wall
    { x: getScaledValue(100, gameSize), y: getScaledValue(400, gameSize), width: getScaledValue(200, gameSize), height: getScaledValue(20, gameSize), color: 'gray' },  // Another wall
  ];




  return (<main>
    <div className="min-h-screen">
      <Navbar title="Local Game" />

      <div className="flex justify-between items-start gap-4 p-4">

        {isLargeScreen &&
          <div className="w-1/4">
            <CharacterSelect

              player="player1"
              score={player1Score}
              onColorChange={(color) => handleColorChange(color, 'player1')} />
          </div>
        }


        {/* Game Board will go here */}
        <div className="flex-1 flex justify-center">
          <GameBoard
            size={gameSize}
            active={active}
            player1Color={player1Color}
            player2Color={player2Color}
            obstacles={obstacles}
          //  treatsOnFloor={treatsOnFloor}
            // onScoreChange={handleScoreChange}
          />
        </div>



        {isLargeScreen && <div className="w-1/4">
          <Character2Select

            player="player2"
            score={player2Score}
            onColorChange={(color) => handleColorChange(color, 'player2')} />
        </div>
        }

      </div>
    </div>

  </main>)
}