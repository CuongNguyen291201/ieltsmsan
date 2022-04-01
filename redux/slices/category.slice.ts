import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../sub_modules/share/model/category";

export type CategorySliceState = {
  category: Category;
}

const initialState: CategorySliceState = {
  category: null
}

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<Category>) => {
      state.category = action.payload;
    }
  }
});

export const { setCategory } = categorySlice.actions;
export default categorySlice.reducer;