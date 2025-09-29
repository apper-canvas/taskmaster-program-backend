import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      // This prevents potential issues with object mutations
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
},
});

// Selector functions for role-based access control
export const getIsCEO = (state) => {
  const user = state.user.user;
  return user?.profile === 'CEO' || user?.role === 'CEO' || user?.userType === 'CEO';
};

export const getHasFullAccess = (state) => {
  return getIsCEO(state);
};

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;