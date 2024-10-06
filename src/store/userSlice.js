import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null, // Thông tin người dùng
    isLoggedIn: false,  // Trạng thái đăng nhập của người dùng
  },
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      state.user = user;  // Cập nhật thông tin người dùng // Tạo đối tượng người dùng từ thông tin
      state.isLoggedIn = true;  // Cập nhật trạng thái người dùng
    },
    logout: (state) => {
      state.user = null;  // Xóa thông tin người dùng
      state.isLoggedIn = false;  // Xóa thông tin và trạng thái đăng nhập
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
