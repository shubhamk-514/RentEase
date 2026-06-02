import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
const initialState = {
  rooms: [],
  hostRooms: [],
  currentRoom: null,
  loading: false,
  detailLoading: false,
  actionLoading: false,
  error: null,
  success: false,
  filters: {
    search: "",
    category: "All",
    location: "",
    minPrice: "",
    maxPrice: "",
  },
};
// Async Thunks
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (filterParams, thunkAPI) => {
    try {
      const response = await API.get("/rooms", { params: filterParams });
      return response.data.rooms;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const fetchRoomDetail = createAsyncThunk(
  "rooms/fetchRoomDetail",
  async (roomId, thunkAPI) => {
    try {
      const response = await API.get(`/rooms/${roomId}`);
      return response.data.room;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const fetchHostListings = createAsyncThunk(
  "rooms/fetchHostListings",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/rooms/host/listings");
      return response.data.rooms;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const createRoomListing = createAsyncThunk(
  "rooms/createRoomListing",
  async (roomData, thunkAPI) => {
    try {
      const response = await API.post("/rooms", roomData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const updateRoomListing = createAsyncThunk(
  "rooms/updateRoomListing",
  async ({ id, roomData }, thunkAPI) => {
    try {
      const response = await API.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const deleteRoomListing = createAsyncThunk(
  "rooms/deleteRoomListing",
  async (id, thunkAPI) => {
    try {
      const response = await API.delete(`/rooms/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);
const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        category: "All",
        location: "",
        minPrice: "",
        maxPrice: "",
      };
    },
    resetRoomStatus: (state) => {
      state.success = false;
      state.error = null;
      state.currentRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Room Detail
      .addCase(fetchRoomDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchRoomDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchRoomDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Fetch Host Listings
      .addCase(fetchHostListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostListings.fulfilled, (state, action) => {
        state.loading = false;
        state.hostRooms = action.payload;
      })
      .addCase(fetchHostListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Room Listing
      .addCase(createRoomListing.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRoomListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.rooms.unshift(action.payload.room);
        state.hostRooms.unshift(action.payload.room);
      })
      .addCase(createRoomListing.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Room Listing
      .addCase(updateRoomListing.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateRoomListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.currentRoom = action.payload.room;
        state.rooms = state.rooms.map((r) =>
          r._id === action.payload.room._id ? action.payload.room : r,
        );
        state.hostRooms = state.hostRooms.map((r) =>
          r._id === action.payload.room._id ? action.payload.room : r,
        );
      })
      .addCase(updateRoomListing.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete Room Listing
      .addCase(deleteRoomListing.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteRoomListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.rooms = state.rooms.filter((r) => r._id !== action.payload.id);
        state.hostRooms = state.hostRooms.filter(
          (r) => r._id !== action.payload.id,
        );
      })
      .addCase(deleteRoomListing.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { setFilters, clearFilters, resetRoomStatus } = roomSlice.actions;
export default roomSlice.reducer;
