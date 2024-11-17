'use client';

import { useState } from 'react';
import { signIn, signUp, confirmSignUp, signOut, getCurrentUser } from 'aws-amplify/auth';

import { useRouter } from 'next/navigation';  // Add this import

type AuthState = 'signIn' | 'signUp' | 'confirmSignUp';

export default function AuthPage() {
  const router = useRouter();  // Add this hook
  
  const [authState, setAuthState] = useState<AuthState>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signIn({ username: email, password });
      
      // redirect to dashboard
      console.log('signed in')
      router.push('/dashboard');

    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      setAuthState('confirmSignUp');
    } catch (error) {
      console.log('Error signing up:', error)
      setError('Failed to sign up. Please try again.');
    }
  }

  async function handleConfirmSignUp(e: React.FormEvent) {
    e.preventDefault();
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      setAuthState('signIn');
    } catch (error) {
      setError('Failed to confirm sign up. Please try again.');
    }
  }

  const SignInForm = (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign In
      </button>
      <p className="text-center">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthState('signUp')}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Sign Up
        </button>
      </p>
    </form>
  );

  const SignUpForm = (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign Up
      </button>
      <p className="text-center">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthState('signIn')}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Sign In
        </button>
      </p>
    </form>
  );

  const ConfirmSignUpForm = (
    <form onSubmit={handleConfirmSignUp} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmation Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Confirm Sign Up
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {authState === 'signIn' ? 'Sign in to your account' : 
             authState === 'signUp' ? 'Create a new account' : 
             'Confirm your email'}
          </h2>
        </div>
        {authState === 'signIn' && SignInForm}
        {authState === 'signUp' && SignUpForm}
        {authState === 'confirmSignUp' && ConfirmSignUpForm}
      </div>
    </div>
  );
}
