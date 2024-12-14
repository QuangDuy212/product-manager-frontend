import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
    query: string;
}

const initialState: SearchState = {
    query: "",
}

export const searchSlide = createSlice({
    name: 'search',
    initialState,
    reducers: {
        removeSearch: (state) => {
            state.query = "";
        },
        setSearch: (state, action: PayloadAction<string>) => {
            if (state.query != "")
                state.query = ""
            state.query += action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { removeSearch, setSearch } = searchSlide.actions

export default searchSlide.reducer