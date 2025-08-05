import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import workspaceReducer from "./features/workspace/workspaceSlice";
import sidebarReducer from "./features/layout/sidebarSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    sidebar: sidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
