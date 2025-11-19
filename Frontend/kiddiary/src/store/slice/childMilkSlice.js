import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getChildMilkLogsService,
  createChildMilkLogService,
  updateChildMilkLogService,
  deleteChildMilkLogService,
  getChildMilkLogsByDateRangeService
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

export const loadChildMilkLogs = createAsyncThunk(
  "childMilk/load",
  async ({ childId, date }, { rejectWithValue }) => {
    try {
      const data = await getChildMilkLogsService(childId, date);
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

export const createMilkLog = createAsyncThunk(
  "childMilk/createOne",
  async ({ childId, payload }, { getState, dispatch, rejectWithValue }) => {
    try {
      await createChildMilkLogService(childId, payload);

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

export const updateMilkLog = createAsyncThunk(
  "childMilk/updateOne",
  async ({ childId, milkLogId, payload }, { getState, dispatch, rejectWithValue }) => {
    try {
      await updateChildMilkLogService(childId, milkLogId, payload);

      const state = getState().childMilk;
      const dateFromPayload =
        payload.feedingAt && payload.feedingAt.slice(0, 10);
      const date = dateFromPayload || state.date;

      // Reload lại logs sau khi update
      await dispatch(loadChildMilkLogs({ childId, date }));
      return true;
    } catch (err) {
      return rejectWithValue(err?.message || "Update milk log failed");
    }
  }
);

export const loadChildMilkLogsByDateRange = createAsyncThunk(
  "childMilk/loadRange",
  async ({ childId, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const data = await getChildMilkLogsByDateRangeService(childId, fromDate, toDate);
      return {
        childId,
        // Dùng fromDate để lưu vào state.date, hoặc bạn có thể tạo state mới như fromDate/toDate
        date: fromDate || null, 
        data,
      };
    } catch (err) {
      return rejectWithValue(err?.message || "Load milk logs by date range failed");
    }
  }
);
export const deleteMilkLog = createAsyncThunk(
  "childMilk/deleteOne",
  async ({ childId, milkLogId }, { getState, dispatch, rejectWithValue }) => {
    try {
      await deleteChildMilkLogService(childId, milkLogId);

      const state = getState().childMilk;
      const date = state.date;
      // Reload lại logs sau khi delete
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
    // LOAD 1 ngày
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

    // CÁC LỖI KHÁC
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
    })

    // LOAD THEO KHOẢNG NGÀY
    .addCase(loadChildMilkLogsByDateRange.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loadChildMilkLogsByDateRange.fulfilled, (state, action) => {
      state.loading = false;
      const { childId, date, data } = action.payload || {};

      state.childId = childId ?? state.childId;
      state.date = date ?? state.date;
      state.logs = data?.logs || [];     
      state.totalToday = data?.totalToday || 0;
      state.last7Days = data?.last7Days || [];
    })
    .addCase(loadChildMilkLogsByDateRange.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ||
        action.error?.message ||
        "Failed to load milk logs by date range";
    });
},

});

export const { setMilkDate, clearMilkState } = childMilkSlice.actions;
export default childMilkSlice.reducer;