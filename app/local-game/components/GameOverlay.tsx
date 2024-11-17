// components/GameOverlay.tsx
interface GameOverlayProps {
    player1Score: number;
    player2Score: number;
    showPressSpace?: boolean;
    className?: string;
    onStart?: () => void;
    settingsView?: boolean;
  }
  
  export const GameOverlay = ({ 
    player1Score, 
    player2Score,
    showPressSpace = true,
    className = "",
    onStart,
    settingsView = false
  }: GameOverlayProps) => {
    const isNewGame = player1Score === 0 && player2Score === 0;
  
    return (
      <div className={`w-full aspect-square max-w-[600px] flex flex-col justify-center items-center bg-gray-800 rounded-lg ${className}`}>
        <h1 className="text-4xl text-white mb-2">
          {isNewGame 
            ? "Nom Kitties!" 
            : `${
                player1Score > player2Score 
                  ? "Player 1 Wins!" 
                  : player2Score > player1Score 
                    ? "Player 2 Wins!" 
                    : "It's a Tie!"
              }`
          }
        </h1>
        
        {isNewGame ? (
          <>
            <p className="text-lg text-gray-300 mb-1">A game of strategy and skill.</p>
            <p className="text-lg text-gray-300">Collect the most treats to win!</p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-300 mb-1">Final Score:</p>
            <p className="text-lg text-gray-300">
              Player 1: {player1Score} - Player 2: {player2Score}
            </p>
          </>
        )}
        
        {showPressSpace && (
          <p className="text-sm text-gray-400 mt-4 animate-pulse">
            Press SPACE to start
          </p>
        )}
      </div>
    );
  };
  