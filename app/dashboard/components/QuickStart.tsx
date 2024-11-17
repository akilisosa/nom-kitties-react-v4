import { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { RocketLaunchIcon, FootballIcon, ArrowPathIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
// import { RocketLaunchIcon, FootballIcon, ArrowPathIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { IoRocketOutline, IoFootballOutline, IoRefreshOutline, IoCodeWorkingOutline } from 'react-icons/io5';

interface NewGameForm {
  public: boolean;
  currentPlayers: string;
  timeLimit: string;
  rounds: string;
}

interface QuickStartProps {
  showRefresh?: boolean;
  onRefresh?: () => void;
  onJoinGame?: () => void;
  onJoinPrivate?: () => void;
  onStartGame?: (formData: NewGameForm) => void;
}

export default function QuickStart({ 
  showRefresh = false, 
  onRefresh, 
  onJoinGame, 
  onJoinPrivate,
  onStartGame 
}: QuickStartProps) {
  const [view, setView] = useState<'quickstart' | 'start'>('quickstart');
  const { register, handleSubmit, watch } = useForm<NewGameForm>({
    defaultValues: {
      public: false,
      currentPlayers: '',
      timeLimit: '',
      rounds: ''
    }
  });

  const isPublic = watch('public');

  const onSubmit = (data: NewGameForm) => {
    onStartGame?.(data);
  };

  return (
    <div className="flex flex-col justify-center m-4 space-y-4">
      {view === 'quickstart' ? (
        <>
          <button
            onClick={() => setView('start')}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start A Game <IoRocketOutline className="w-5 h-5 ml-2" />
          </button>

          {!showRefresh ? (
            <button
              onClick={onJoinGame}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Join Game <IoFootballOutline className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={onRefresh}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Refresh List <IoRefreshOutline className="w-5 h-5 ml-2" />
            </button>
          )}

          <button
            onClick={onJoinPrivate}
            className="flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Enter A Code <IoCodeWorkingOutline className="w-5 h-5 ml-2" />
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('public')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {isPublic ? 'Public' : 'Private'}
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              No of Players
            </label>
            <select
              {...register('currentPlayers')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Players</option>
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Time Limit
            </label>
            <select
              {...register('timeLimit')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Time Limit</option>
              {[10, 20, 30, 60, 90].map(time => (
                <option key={time} value={time}>{time}s</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rounds
            </label>
            <select
              {...register('rounds')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Rounds</option>
              {[1, 2, 3].map(round => (
                <option key={round} value={round}>{round}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start A Game
            </button>
            <button
              type="button"
              onClick={() => setView('quickstart')}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
