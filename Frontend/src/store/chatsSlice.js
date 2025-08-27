import { createSlice, nanoid } from '@reduxjs/toolkit'

const makeId = () => nanoid(7)

const defaultChats = [
  {
    id: makeId(),
    title: 'Welcome Chat',
    messages: [
      { id: makeId(), sender: 'ai', text: "Hi — send a message to start the conversation.", ts: Date.now() },
    ],
  },
]

const initialState = {
  chats: defaultChats,
  currentChatId: defaultChats[0].id,
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    newChat: {
      reducer(state, action) {
        state.chats.unshift(action.payload)
        state.currentChatId = action.payload.id
      },
      prepare() {
        const chat = { id: makeId(), title: 'New Chat', messages: [] }
        return { payload: chat }
      },
    },
    selectChat(state, action) {
      state.currentChatId = action.payload
    },
    addMessage(state, action) {
      const { chatId, message } = action.payload
      const chat = state.chats.find((c) => c.id === chatId)
      if (chat) {
        chat.messages.push(message)
        // set title if it was a new chat
        if (chat.title === 'New Chat' && message.sender === 'user') {
          chat.title = message.text.slice(0, 40) || 'New Chat'
        }
      }
    },
    setMessages(state, action) {
      const { chatId, messages } = action.payload
      const chat = state.chats.find((c) => c.id === chatId)
      if (chat) {
        chat.messages = messages
      }
    },
    replaceChats(state, action) {
      state.chats = action.payload
      if (!state.chats.find((c) => c.id === state.currentChatId)) {
        state.currentChatId = state.chats.length ? state.chats[0].id : null
      }
    },
  },
})

export const { newChat, selectChat, addMessage, setMessages, replaceChats } = chatsSlice.actions
export default chatsSlice.reducer
