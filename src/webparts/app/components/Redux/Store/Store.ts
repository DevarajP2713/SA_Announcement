import { configureStore } from "@reduxjs/toolkit";
import AnnouncementReducer from "../Reducer/AnnouncementReducer";

const Store: any = configureStore({
  devTools: false,
  reducer: {
    AnnounceDatas: AnnouncementReducer,
  },
});

export { Store };
