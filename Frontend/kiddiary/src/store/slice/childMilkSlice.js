// src/store/slice/childMilkSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getChildMilkLogsService,
  createChildMilkLogService,
  updateChildMilkLogService,
  deleteChildMilkLogService,
} from "../../services/childMilkService";

const initialState = {
  childId: null,
  date: null,         
  logs: [],            
  totalToday: 0,       
  last7Days: [],      
  loading: false,
  error: null,
};

// LOAD logs
export const loadChildMilkLogs = createAsyncThunk(
  "childMilk/load",
  async ({ childId, date }, { rejectWithValue }) => {
    try {
      const data = await getChildMilkLogsService(childId, date);
      // data.date là ISO string từ backend (ngày đang xem)
      return {
        childId,
        date: date || (data.date && data.date.slice(0, 10)) || null,
        data,
      };
    } catch (err) {
      return rejectWithValue(err?.message || "Load milk logs failed");
    }
  }
);

// CREATE log
export const createMilkLog = createAsyncThunk(
  "childMilk/createOne",
  async ({ childId, payload }, { getState, dispatch, rejectWithValue }) => {
    try {
      await createChildMilkLogService(childId, payload);

      // Sau khi tạo xong, reload lại danh sách theo ngày tương ứng
      const state = getState().childMilk;
      const dateFromPayload =
        payload.feedingAt && payload.feedingAt.slice(0, 10);
      const date = dateFromPayload || state.date;

      await dispatch(loadChildMilkLogs({ childId, date }));
      return true;
    } catch (err) {
      return rejectWithValue(err?.message || "Create milk log failed");
    }
  }
);

// UPDATE log
export const updateMilkLog = createAsyncThunk(
  "childMilk/updateOne",
  async ({ childId, id, payload }, { getState, dispatch, rejectWithValue }) => {
    try {
      await updateChildMilkLogService(childId, id, payload);

      const state = getState().childMilk;
      const dateFromPayload =
        payload.feedingAt && payload.feedingAt.slice(0, 10);
      const date = dateFromPayload || state.date;

      await dispatch(loadChildMilkLogs({ childId, date }));
      return true;
    } catch (err) {
      return rejectWithValue(err?.message || "Update milk log failed");
    }
  }
);

// DELETE log
export const deleteMilkLog = createAsyncThunk(
  "childMilk/deleteOne",
  async ({ childId, id }, { getState, dispatch, rejectWithValue }) => {
    try {
      await deleteChildMilkLogService(childId, id);

      const state = getState().childMilk;
      const date = state.date;
      await dispatch(loadChildMilkLogs({ childId, date }));
      return true;
    } catch (err) {
      return rejectWithValue(err?.message || "Delete milk log failed");
    }
  }
);

const childMilkSlice = createSlice({
  name: "childMilk",
  initialState,
  reducers: {
    setMilkDate(state, action) {
      state.date = action.payload; 
    },
    clearMilkState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // LOAD
      .addCase(loadChildMilkLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadChildMilkLogs.fulfilled, (state, action) => {
        state.loading = false;
        const { childId, date, data } = action.payload || {};

        state.childId = childId ?? state.childId;
        state.date = date ?? state.date;
        state.logs = data?.logs || [];
        state.totalToday = data?.totalToday || 0;
        state.last7Days = data?.last7Days || [];
      })
      .addCase(loadChildMilkLogs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to load milk logs";
      })

     
      .addCase(createMilkLog.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to create milk log";
      })
      .addCase(updateMilkLog.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to update milk log";
      })
      .addCase(deleteMilkLog.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to delete milk log";
      });
  },
});

export const { setMilkDate, clearMilkState } = childMilkSlice.actions;
export default childMilkSlice.reducer;
