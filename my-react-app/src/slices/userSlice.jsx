import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = '';
    },
  },
});

export const { setEmail, clearEmail } = userSlice.actions;
export default userSlice.reducer;
