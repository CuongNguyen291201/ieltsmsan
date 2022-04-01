import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type CourseSliceState = {
  isShowingPopup: boolean;
  currentCourseQuickView: string;
}

const initialState: CourseSliceState = {
  isShowingPopup: false,
  currentCourseQuickView: ''
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseShowingPopup: (state, action: PayloadAction<boolean>) => {
      state.isShowingPopup = action.payload
    },
    setCurrentCourseQuickView: (state, action: PayloadAction<string>) => {
      state.currentCourseQuickView = action.payload;
    }
  }
})


export const {
  setCourseShowingPopup,
  setCurrentCourseQuickView
} = courseSlice.actions;

export default courseSlice.reducer;