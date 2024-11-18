// store/slices/roomSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../services/roomService'; // Import your Room interface

interface RoomState {
  currentRoom: Room | null;
  rooms: Room[];
  loading: boolean;
  error: string | null;
}


const initialState: RoomState = {
  currentRoom: null,
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<Room | any>) => {
      state.currentRoom = action.payload;
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
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

export const { setCurrentRoom, setRooms, setLoading, setError } = roomSlice.actions;
export default roomSlice.reducer;