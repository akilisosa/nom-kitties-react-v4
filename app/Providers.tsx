'use client';

import { Amplify } from 'aws-amplify';
import { Provider } from 'react-redux';
import outputs from '@/amplify_outputs.json';
import { store } from './store/store';


Amplify.configure(outputs);

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}