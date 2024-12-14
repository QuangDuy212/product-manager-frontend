import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PayState {
    detail: {
        _id: string;
        quantity: number;
    }[];
}

const initialState: PayState = {
    detail: [],
}

export const paySlide = createSlice({
    name: 'pay',
    initialState,
    reducers: {
        setEmpty: (state) => {
            state.detail = [];
        },
        setData: (state, action: PayloadAction<{ _id: string; quantity: number }[]>) => {
            state.detail = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setEmpty, setData } = paySlide.actions

export default paySlide.reducer