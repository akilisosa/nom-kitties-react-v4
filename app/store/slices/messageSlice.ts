// store/slices/roomSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../services/messageService'; // Import your Room interface

interface MessageState {
  currentMessage: Message | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}


const initialState: MessageState = {
  currentMessage: null,
  messages: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setCurrentMessage: (state, action: PayloadAction<Message | any>) => {
      state.currentMessage = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Add more reducers as needed
  },
});

export const { setCurrentMessage, setMessages, setLoading, setError } = messageSlice.actions;
export default messageSlice.reducer;
