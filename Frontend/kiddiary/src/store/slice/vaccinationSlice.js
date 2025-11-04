import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getVaccinesByChild ,
    updateChildVaccineStatus,
    normalizeChildVaccines,
    fromApiStatus,
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
  'vaccination/saveStatus',
  async ({ childId, vaccineId, payload }) => {
    const data = await updateChildVaccineStatus({
      childId,
      vaccineId,
      status: payload.status,     
      updateTime: payload.updateTime,
      note: payload.note,
    });
    return data; 
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
        const { childId, vaccineId, status, updateTime, note } = action.payload || {};
        const rows = state.vaccinesByChildId?.[childId] || [];
        const row = rows.find(r => Number(r?.vaccine?.id) === Number(vaccineId));
        if (row) {
          row.status = fromApiStatus(status); 
          row.updateTime = updateTime || null;
          row.note = note || '';
        }});
  },
});

export default vaccinationSlice.reducer;
