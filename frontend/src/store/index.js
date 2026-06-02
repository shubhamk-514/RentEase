import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import favoriteReducer from "./slices/favoriteSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    favorites: favoriteReducer,
  },
});
export default store;
