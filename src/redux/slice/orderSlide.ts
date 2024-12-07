import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchOrder, callFetchUser } from '@/config/api';
import { IOrder } from '@/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IOrder[]
}
// First, create the thunk
export const fetchOrder = createAsyncThunk(
    'order/fetchOrder',
    async ({ query }: { query: string }) => {
        const response = await callFetchOrder(query);
        return response;
    }
)


const initialState: IState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};


export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
        },


    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchOrder.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchOrder.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchOrder.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })
    },

});

export const {
    setActiveMenu,
} = orderSlide.actions;

export default orderSlide.reducer;
