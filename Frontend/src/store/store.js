import { configureStore } from '@reduxjs/toolkit'
import chatsReducer from './chatsSlice'

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
  },
})

export default store
