import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getVaccinesByChild ,
    updateChildVaccineStatus,
    normalizeChildVaccines,
} from "../../services/healthService";
import { createSlice } from "@reduxjs/toolkit";


export const loadVaccinesForAllChildren = createAsyncThunk(
  "vaccination/loadForAll",
  async (children, { rejectWithValue }) => {
    try {
      const entries = await Promise.all(
        (children || []).map(async (c) => {
          const raw = await getVaccinesByChild(c.id);
          return [c.id, normalizeChildVaccines(raw)];
        })
      );
      return Object.fromEntries(entries); 
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const saveVaccineStatus = createAsyncThunk(
  "vaccination/saveStatus",
  async ({ childId, vaccineId, payload }, { rejectWithValue }) => {
    try {
      await updateChildVaccineStatus({ childId, vaccineId, ...payload });
      return { childId, vaccineId, payload };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const vaccinationSlice = createSlice({
  name: "vaccination",
  initialState: {
    vaccinesByChildId: {},  
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadVaccinesForAllChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadVaccinesForAllChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.vaccinesByChildId = action.payload;
      })
      .addCase(loadVaccinesForAllChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load vaccines";
      })
      .addCase(saveVaccineStatus.fulfilled, (state, action) => {
        const { childId, vaccineId, payload } = action.payload;
        const list = state.vaccinesByChildId[childId] || [];
        const item = list.find((x) => String(x.vaccine?.id) === String(vaccineId));
        if (item) {
          item.status = payload.status?.toUpperCase?.() || item.status;
          item.updateTime = payload.updateTime || item.updateTime;
          item.note = payload.note ?? item.note;
        }
      });
  },
});

export default vaccinationSlice.reducer;
