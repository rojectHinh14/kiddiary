// src/store/slice/sleepSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSleepHistoryService,
  getSleepWeekService,
  createSleepLogService,
  updateSleepLogService,
  deleteSleepLogService,
} from "../../services/sleepService";

const initialState = {
  childId: null,
  range: { from: null, to: null },  
  logs: [],                         
  week: {
    weekStart: null,
    weekEnd: null,
    logs: [],
  },
  loading: false,
  error: null,
};

/**
 * LOAD history theo khoảng ngày
 */
export const loadSleepHistory = createAsyncThunk(
  "sleep/loadHistory",
  async ({ childId, from, to }, { rejectWithValue }) => {
    try {
      const logs = await getSleepHistoryService(childId, { from, to });
      return { childId, from: from || null, to: to || null, logs };
    } catch (err) {
      return rejectWithValue(err?.message || "Load sleep history failed");
    }
  }
);

/**
 * LOAD dữ liệu tuần (dùng cho chart / overview)
 */
export const loadSleepWeek = createAsyncThunk(
  "sleep/loadWeek",
  async ({ childId, date }, { rejectWithValue }) => {
    try {
      const week = await getSleepWeekService(childId, date);
      return { childId, week };
    } catch (err) {
      return rejectWithValue(err?.message || "Request failed with sleep week");
    }
  }
);

/**
 * CREATE sleep log
 */
export const createSleepLog = createAsyncThunk(
  "sleep/createOne",
  async ({ childId, payload }, { dispatch, rejectWithValue }) => {
    try {
      await createSleepLogService(childId, payload);

      const date =
        payload.sleepDate ||
        payload.date ||
        new Date().toISOString().slice(0, 10);

      await dispatch(loadSleepWeek({ childId, date }));
      return true;
    } catch (err) {
      return rejectWithValue(err?.message || "Create sleep log failed");
    }
  }
);
/**
 * UPDATE sleep log
 */
export const updateSleepLog = createAsyncThunk(
  "sleep/updateOne",
  async ({ childId, sleepId, payload }, { getState, dispatch, rejectWithValue }) => {
    try {
      const updated = await updateSleepLogService(sleepId, payload);

      const state = getState().sleep;
      const from =
        state.range.from ||
        (updated.sleepDate && updated.sleepDate.slice(0, 10)) ||
        null;
      const to =
        state.range.to ||
        (updated.sleepDate && updated.sleepDate.slice(0, 10)) ||
        null;

      await dispatch(loadSleepHistory({ childId, from, to }));
      // Optionally: reload tuần theo ngày log
      // await dispatch(loadSleepWeek({ childId, date: updated.sleepDate }));

      return updated;
    } catch (err) {
      return rejectWithValue(err?.message || "Update sleep log failed");
    }
  }
);

/**
 * DELETE sleep log
 */
export const deleteSleepLog = createAsyncThunk(
  "sleep/deleteOne",
  async ({ childId, sleepId }, { getState, dispatch, rejectWithValue }) => {
    try {
      await deleteSleepLogService(sleepId);

      const state = getState().sleep;
      const from = state.range.from;
      const to = state.range.to;

      await dispatch(loadSleepHistory({ childId, from, to }));
      return sleepId;
    } catch (err) {
      return rejectWithValue(err?.message || "Delete sleep log failed");
    }
  }
);

const sleepSlice = createSlice({
  name: "sleep",
  initialState,
  reducers: {
    setSleepRange(state, action) {
      // action.payload: { from, to }
      state.range.from = action.payload?.from || null;
      state.range.to = action.payload?.to || null;
    },
    clearSleepState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOAD history */
      .addCase(loadSleepHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSleepHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { childId, from, to, logs } = action.payload;
        state.childId = childId;
        state.range = { from, to };
        state.logs = logs || [];
      })
      .addCase(loadSleepHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to load sleep history";
      })

      /* LOAD week */
      .addCase(loadSleepWeek.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSleepWeek.fulfilled, (state, action) => {
        state.loading = false;
        state.childId = action.payload.childId;
        state.week = action.payload.week; 
      })
      .addCase(loadSleepWeek.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to load weekly sleep";
      })

      /* CREATE / UPDATE / DELETE lỗi */
      .addCase(createSleepLog.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to create sleep log";
      })
      .addCase(updateSleepLog.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to update sleep log";
      })
      .addCase(deleteSleepLog.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to delete sleep log";
      });
  },
});
export const { setSleepRange, clearSleepState } = sleepSlice.actions;
export default sleepSlice.reducer;
