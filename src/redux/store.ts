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

export const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
    permission: permissionReducer,
    role: roleReducer,
    product: productReducer,
    category: categoryReducer,
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