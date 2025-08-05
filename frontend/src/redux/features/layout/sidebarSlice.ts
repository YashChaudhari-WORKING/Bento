import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
  isPinned: boolean;
  activeItem: string;
  hasSeenHint: boolean;
}

const initialState: SidebarState = {
  isOpen: false,
  isPinned: false,
  activeItem: "dashboard",
  hasSeenHint: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },
    openSidebar(state) {
      state.isOpen = true;
    },
    closeSidebar(state) {
      state.isOpen = false;
    },
    togglePin(state) {
      state.isPinned = !state.isPinned;
    },
    setActiveItem(state, action: PayloadAction<string>) {
      state.activeItem = action.payload;
    },
    setSeenHint(state) {
      state.hasSeenHint = true;
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  togglePin,
  setActiveItem,
  setSeenHint,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
