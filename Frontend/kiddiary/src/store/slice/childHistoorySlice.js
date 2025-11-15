import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChildHistoryService, createChildHistoryService, updateChildHistoryService, deleteChildHistoryService } from "../../services/childService";   


const initialState ={
    childId : null,
    list: [],
    loading : false,
    error : null
};

export const loadChildHistory = createAsyncThunk(
  "childHistory/load",
  async (childId, { rejectWithValue }) => {
    try {
      const rows = await getChildHistoryService(childId);
      return { childId, rows };
    } catch (err) {
      return rejectWithValue(err?.message || "Load child history failed");
    }
  }
);

export const createOneHistory = createAsyncThunk(
  "childHistory/createOne",
  async ({ childId, payload }, { rejectWithValue }) => {
    try {
      const row = await createChildHistoryService(childId, payload);
      return row;
    } catch (err) {
      return rejectWithValue(err?.message || "Create child history failed");
    }
  }
);

export const updateOneHistory = createAsyncThunk(
  "childHistory/updateOne",
  async ({ childId, id, payload }, { rejectWithValue }) => {
    try {
      const row = await updateChildHistoryService(childId, id, payload);
      return row;
    } catch (err) {
      return rejectWithValue(err?.message || "Update child history failed");
    }
  }
);
export const deleteOneHistory = createAsyncThunk(
  "childHistory/deleteOne",
  async ({ childId, id }, { rejectWithValue }) => {
    try {
      await deleteChildHistoryService(childId, id);
      return id; // chỉ cần id đã xóa
    } catch (err) {
      return rejectWithValue(err?.message || "Delete child history failed");
    }
  }
);

const childHistorySlice = createSlice(
   {
    name : "childHistory",
    initialState : initialState,
    reducers: {},
    extraReducers: (builder) =>{
builder.addCase(loadChildHistory.pending, (state) =>{
    state.loading = true;
    state.err = null;
})
.addCase(loadChildHistory.fulfilled,(state, action)=>{
    state.loading = false;
    state.err = null;
    state.childId = action.payload.childId;

    // sort theo date giảm dần ngay từ store
    const rows = action.payload.rows || [];
    state.list = [...rows].sort((a,b) => new Date(b.date) - (a.date));
})
.addCase(loadChildHistory.rejected,(state, action) =>{
      state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to load child history";
        state.list = [];
})
// create 
.addCase(createOneHistory.fulfilled,(state, action) =>{
    const r = action.payload;
        if (!r) return;
        const newList = [r, ...state.list];
        state.list = newList.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
})
 .addCase(createOneHistory.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to create child history";
      })
.addCase(updateOneHistory.fulfilled, (state, action) => {
        const r = action.payload;
        if (!r || !r.id) return;
        const idx = state.list.findIndex((x) => x.id === r.id);
        if (idx >= 0) {
          const newList = [...state.list];
          newList[idx] = { ...newList[idx], ...r };
          state.list = newList.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        }
      })
.addCase(updateOneHistory.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to update child history";
      })
.addCase(deleteOneHistory.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((item) => item.id !== id);
      })
 .addCase(deleteOneHistory.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to delete child history";
      });
    }
}
)
export default childHistorySlice.reducer;