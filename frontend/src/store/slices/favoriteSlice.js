import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
const initialState = {
  favorites: [],
  contacted: [],
  loading: false,
  contactLoading: false,
  error: null,
  successMsg: null,
};
// Async Thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/users/favorites");
      return response.data.favorites;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (roomId, thunkAPI) => {
    try {
      const response = await API.post(`/users/favorites/${roomId}`);
      // Return roomId to let slice update local state list dynamically
      return { roomId, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const fetchContacted = createAsyncThunk(
  "favorites/fetchContacted",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/users/contacted");
      return response.data.contacted;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const contactHost = createAsyncThunk(
  "favorites/contactHost",
  async (roomId, thunkAPI) => {
    try {
      const response = await API.post(`/users/contact/${roomId}`);
      return { roomId, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavoriteMessages: (state) => {
      state.successMsg = null;
      state.error = null;
    },
    resetFavoriteState: (state) => {
      state.favorites = [];
      state.contacted = [];
      state.loading = false;
      state.contactLoading = false;
      state.error = null;
      state.successMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.successMsg = action.payload.message;
        const roomId = action.payload.roomId;
        const exists = state.favorites.some((f) => f._id === roomId);
        if (exists) {
          state.favorites = state.favorites.filter((f) => f._id !== roomId);
        } else {
          // If we add, we can't fully populate without fetching, but we'll push a shallow object.
          // In practice, toggleFavorite is called from listings where details are already loaded,
          // or we re-fetch favorites. We'll push a mock structure or trust re-fetch.
          state.favorites.push({ _id: roomId });
        }
      })
      // Fetch Contacted Listings
      .addCase(fetchContacted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacted.fulfilled, (state, action) => {
        state.loading = false;
        state.contacted = action.payload;
      })
      .addCase(fetchContacted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Contact Host
      .addCase(contactHost.pending, (state) => {
        state.contactLoading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(contactHost.fulfilled, (state, action) => {
        state.contactLoading = false;
        state.successMsg = action.payload.data.message;
        const roomId = action.payload.roomId;
        if (!state.contacted.some((c) => c._id === roomId)) {
          state.contacted.push({ _id: roomId });
        }
      })
      .addCase(contactHost.rejected, (state, action) => {
        state.contactLoading = false;
        state.error = action.payload;
      });
  },
});
export const { clearFavoriteMessages, resetFavoriteState } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
