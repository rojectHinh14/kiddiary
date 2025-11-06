import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChildrenByUser } from "../../services/childService";

export const loadChildren = createAsyncThunk("children/load", async () => {
  const rows = await getChildrenByUser();
  return rows;
});

const initialState = {
  list: [],       
  byId: {},          
  loading: false,
  error: null,
};

const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.byId = Object.fromEntries(
          (action.payload || []).map((c) => [c.id, c])
        );
      })
      .addCase(loadChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load children";
      });
  },
});

export default childrenSlice.reducer;
