import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import homeReducer from 'features/Home/homeSlice';
// import adminMenuReducer from 'features/Admin/adminMenuSlice';

const rootReducer = {
  user: userReducer,
  home: homeReducer,
  // adminMenu: adminMenuReducer
}

const store = configureStore({ reducer: rootReducer })

export default store;