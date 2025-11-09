import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SortKey = "name" | "price" | "change" | "volume" | "marketCap";
export type SortDir = "asc" | "desc";

interface UiState {
  tab: "new" | "final" | "migrated";
  sortKey: SortKey;
  sortDir: SortDir;
  selectedSymbol?: string;
}

const initialState: UiState = {
  tab: "new",
  sortKey: "volume",
  sortDir: "desc",
  selectedSymbol: undefined,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<UiState["tab"]>) {
      state.tab = action.payload;
    },
    setSort(state, action: PayloadAction<{ key: SortKey }>) {
      if (state.sortKey === action.payload.key) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = action.payload.key;
        state.sortDir = "desc";
      }
    },
    openDetails(state, action: PayloadAction<string>) {
      state.selectedSymbol = action.payload;
    },
    closeDetails(state) {
      state.selectedSymbol = undefined;
    },
  },
});

export const { setTab, setSort, openDetails, closeDetails } = uiSlice.actions;
export default uiSlice.reducer;
