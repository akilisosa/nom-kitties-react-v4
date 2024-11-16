'use client';
import { useState } from 'react';
import Navbar from '../components/NavBar';
import { CharacterSelect } from './components/CharacterSelect';

export default function LocalGame() {
  const [player1Color, setPlayer1Color] = useState('#a85c32');
  const [player2Color, setPlayer2Color] = useState('#a85c32');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  // Define the color change handler
  const handleColorChange = (color: string, player: 'player1' | 'player2') => {
    if (player === 'player1') {
      setPlayer1Color(color);
    } else {
      setPlayer2Color(color);
    }
  };


    return (<main>
      <div className="min-h-screen">
      <Navbar title="Local Game" />
      {/* <main className="p-4"> */}
        {/* Your canvas content will go here */}
        Local Game Page

<div className="w-1/4">
        <CharacterSelect 
        
        player="player1"
          score={player1Score}
          onColorChange={(color) => handleColorChange(color, 'player1')}/>
      </div>
      {/* </main> */}
    </div>
      
      </main>)
  }