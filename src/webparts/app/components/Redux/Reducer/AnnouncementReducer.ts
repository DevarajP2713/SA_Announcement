import { createSlice } from "@reduxjs/toolkit";

const mainDatas: any = {
  arrAnnounce: [],
  arrFilAnnounce: [],
  curAnnounce: undefined,
  isAddAndEditDialog: false,
  isViewDialog: false,
  isDeleteDialog: false,
  isLoader: true,
};

const AnnouncementReducer: any = createSlice({
  name: "announce",
  initialState: mainDatas,
  reducers: {
    masAnnounce: (state, action) => {
      state.arrAnnounce = action.payload;
    },
    filAnnounce: (state, action) => {
      state.arrFilAnnounce = action.payload;
    },
    selAnnounce: (state, action) => {
      state.curAnnounce = action.payload;
    },
    isAddEditDialogFun: (state, action) => {
      state.isAddAndEditDialog = action.payload;
    },
    isViewDialogFun: (state, action) => {
      state.isViewDialog = action.payload;
    },
    isDeleteDialogFun: (state, action) => {
      state.isDeleteDialog = action.payload;
    },
    setIsLoader: (state, action) => {
      state.isLoader = action.payload;
    },
  },
});

export const {
  masAnnounce,
  filAnnounce,
  selAnnounce,
  isAddEditDialogFun,
  isViewDialogFun,
  isDeleteDialogFun,
  setIsLoader,
} = AnnouncementReducer.actions;
export default AnnouncementReducer.reducer;
