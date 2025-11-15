import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteChild, getChildrenByUser, updateChild , getChildHistoryService,
 } from "../../services/childService";

export const loadChildren = createAsyncThunk("children/load", async () => {
  const rows = await getChildrenByUser();
  return rows;
});

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


const initialState = {
  list: [],       
  byId: {},       
  loading: false,
  error: null,
  viewing: null,   
};

export const updateOneChild = createAsyncThunk(
  "children/updateOne",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      // chú ý: service updateChild của bạn đang .then(ok) → trả về object child
      const updated = await updateChild(id, payload);
      return updated;
    } catch (err) {
      return rejectWithValue(err?.message || "Update child failed");
    }
  }
);

export const deleteManyChildren = createAsyncThunk(
  "children/deleteMany",
  async (ids, { rejectWithValue }) => {
    try {
      const idList = (ids || []).map((x) => String(x));
      const results = await Promise.allSettled(idList.map((id) => deleteChild(id)));
      const okIds = results
        .map((r, i) => (r.status === "fulfilled" ? idList[i] : null))
        .filter(Boolean);
      if (okIds.length === 0) return rejectWithValue("No deletion succeeded");
      return okIds; // danh sách id đã xóa thành công (string)
    } catch (e) {
      return rejectWithValue(e?.message || "Delete failed");
    }
  }
);



const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setViewing(state, action) { state.viewing = action.payload; },
    clearViewing(state) { state.viewing = null; },
  },
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadChildren.fulfilled, (state, action) => {
        state.loading = false;
        const rows = action.payload || [];
        state.list = rows;
        state.byId = Object.fromEntries(rows.map((c) => [c.id, c]));
      })
      .addCase(loadChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load children";
      })

      // update 1
     .addCase(updateOneChild.fulfilled, (state, action) => {
  const c = action.payload;
  if (!c || !c.id) return;

  // byId mới (đổi reference object)
  const merged = { ...(state.byId[c.id] || {}), ...c };
  state.byId = { ...state.byId, [c.id]: merged };

  // list mới (đổi reference mảng)
  const idx = state.list.findIndex(x => x.id === c.id);
  if (idx >= 0) {
    const newList = [...state.list];
    newList[idx] = { ...state.list[idx], ...c };
    state.list = newList;                  // <-- quan trọng
  } else {
    state.list = [...state.list, c];       // <-- quan trọng
  }

  if (state.viewing?.id === c.id) {
    state.viewing = { ...state.viewing, ...c };
  }
})
      .addCase(updateOneChild.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || "Failed to update child";
      })
       .addCase(deleteManyChildren.fulfilled, (state, action) => {
      const removed = new Set((action.payload || []).map(String));
      // list mới (đổi reference mảng)
      state.list = state.list.filter((item) => !removed.has(String(item.id)));
      // byId mới (đổi reference object)
      const nextById = { ...state.byId };
      for (const rid of removed) delete nextById[rid];
      state.byId = nextById;
      // nếu viewing nằm trong removed → đóng dialog
      if (state.viewing && removed.has(String(state.viewing.id))) {
        state.viewing = null;
      }
    })
    .addCase(deleteManyChildren.rejected, (state, action) => {
      state.error = action.payload || action.error?.message || "Failed to delete children";
    });
  },
});

export const { setViewing, clearViewing } = childrenSlice.actions;
export default childrenSlice.reducer;
