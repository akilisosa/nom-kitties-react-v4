// components/UserProfile.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser, setLoading, setError } from '../../store/slices/userSlice';
import { Schema } from '@/amplify/data/resource';


type User = any // Schema['User'];

// { //any // Schema['User'];
// id: string,
// owner: string | null,
// name: string,
// color: string,
// type: string,
// score: number,
// gamesPlayed: number,
// wins: number,
// losses: number,
// createdAt: Date,
// updatedAt: Date,
// }


export default function UserProfile() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);
  const client = generateClient<Schema>();

  const { register, handleSubmit, formState: { isDirty }, reset } = useForm<User>({
    defaultValues: {
      name: '',
      color: '#a85c32',
      type: 'cat',
      score: 0,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
    }
  });

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const getUser = async () => {
    dispatch(setLoading(true));
    try {
      const currentUser = await getCurrentUser();
      const response = await client.models.User.list({
        filter: {
          owner: {
            eq: currentUser.userId
          }
        }
      });

      if (response.data[0] === undefined) {
        dispatch(setUser(response.data[0]));
      }
    } catch (error) {
      dispatch(setError('Failed to fetch user'));
      console.error('Error fetching user:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onSubmit = async (data: User) => {
    dispatch(setLoading(true));
    try {
      const currentUser = await getCurrentUser();
      
      if (user?.id) {
        // Update existing user
        const response = await client.models.User.update({
          ...data,
          id: user.id,
        });
        if (response.data) {
          dispatch(setUser(response.data));
        } else {
          dispatch(setError('Failed to save user'));
        }
      } else {
        // Create new user
        console.log('creating user')
        const response = await client.models.User.create(
          {...data,
          owner: currentUser.userId}
        );
        dispatch(setUser(response.data));
      }
      reset(data);
    } catch (error) {
      dispatch(setError('Failed to save user'));
      console.error('Error saving user:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">User Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Color Input */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="color"
              id="color"
              {...register('color')}
              className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-500">
              Choose your color
            </span>
          </div>
        </div>

        {/* Submit Button */}
        {isDirty && (
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        )}
      </form>

      {/* Display current values */}
      {user && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Profile</h3>
          <div className="text-sm text-gray-500">
            <p>Name: {user.name}</p>
            <div className="flex items-center gap-2">
              <span>Color:</span>
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: user.color }}
              />
              <span>{user.color}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
