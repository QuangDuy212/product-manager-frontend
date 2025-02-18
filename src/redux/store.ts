import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlide';
import userReducer from './slice/userSlide';
import jobReducer from './slice/jobSlide';
import resumeReducer from './slice/resumeSlide';
import permissionReducer from './slice/permissionSlide';
import roleReducer from './slice/roleSlide';
import skillReducer from './slice/skillSlide';
import productReducer from './slice/productSlide';
import categoryReducer from './slice/categorySlide';
import tagReducer from './slice/tagSlide';
import orderReducer from './slice/orderSlide';
import cartReducer from './slice/cartSlide';
import searchReducer from './slice/searchSlide';
import payReducer from './slice/paySlide';
import historyReducer from './slice/historySlide';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    permission: permissionReducer,
    role: roleReducer,
    product: productReducer,
    category: categoryReducer,
    tag: tagReducer,
    search: searchReducer,
    pay: payReducer,
    history: historyReducer,
    job: jobReducer,
    resume: resumeReducer,
    skill: skillReducer,
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;