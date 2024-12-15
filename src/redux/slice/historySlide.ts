import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchHistory, callFetchUser } from '@/config/api';
import { IOrder, IUser } from '@/types/backend';

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
export const fetchHistory = createAsyncThunk(
    'history/fetchHistory',
    async ({ query }: { query: string }) => {
        const response = await callFetchHistory(query);
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


export const historySlide = createSlice({
    name: 'history',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
        },


    },
    extraReducers: (builder) => {
        builder.addCase(fetchHistory.pending, (state, action) => {
            state.isFetching = true;
        })

        builder.addCase(fetchHistory.rejected, (state, action) => {
            state.isFetching = false;
        })

        builder.addCase(fetchHistory.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
    },

});

export const {
    setActiveMenu,
} = historySlide.actions;

export default historySlide.reducer;
