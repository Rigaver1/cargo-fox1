import { configureStore } from '@reduxjs/toolkit'
import ordersReducer from './reducers/ordersReducer'
import currencyReducer from './reducers/currencyReducer'

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    currency: currencyReducer
  }
})

export default store