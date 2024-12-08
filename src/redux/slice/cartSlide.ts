import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchCart, callFetchCategory, callFetchProduct } from '@/config/api';
import { ICart, ICategory } from '@/types/backend';

interface IState {
    isFetching: boolean;
    cart: ICart;
}
// First, create the thunk
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        const response = await callFetchCart();
        return response;
    }
)


const initialState: IState = {
    isFetching: true,
    cart: {
        _id: "",
        sum: 0,
        cartDetails: [{
            _id: "",
            quantity: 0,
            price: 0,
            createdBy: "",
            updatedBy: "",
            createdAt: "",
            updatedAt: "",
        }],
        createdBy: "",
        updatedBy: "",
        createdAt: "",
        updatedAt: "",
    }
};


export const cartSlide = createSlice({
    name: 'cart',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            // state.activeMenu = action.payload;
        },


    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchCart.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchCart.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchCart.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.cart = action.payload.data;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })
    },

});

export const {
    setActiveMenu,
} = cartSlide.actions;

export default cartSlide.reducer;
