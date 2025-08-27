import React, { useEffect, useRef, useState, useMemo } from 'react'
import '../styles/theme.css'
import Sidebar from '../components/Sidebar'
import ChatHeader from '../components/ChatHeader'
import Messages from '../components/Messages'
import Composer from '../components/Composer'
import { useSelector, useDispatch } from 'react-redux'
import { newChat as newChatAction, selectChat as selectChatAction, addMessage as addMessageAction } from '../store/chatsSlice'

const makeId = () => Math.random().toString(36).slice(2, 9)

const Home = () => {
  // Requirements: use redux for chats, current chat id, and messages; keep UI state locally
  const dispatch = useDispatch()
  const chats = useSelector((s) => s.chats.chats)
  const activeChatId = useSelector((s) => s.chats.currentChatId)
  const activeChat = useMemo(() => chats.find((c) => c.id === activeChatId) || null, [chats, activeChatId])
  const messages = useMemo(() => (activeChat ? activeChat.messages : []), [activeChat])
  const [input, setInput] = useState('')

  const messagesEndRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // messages are derived from redux store; no sync effect needed here

  useEffect(() => {
    // scroll to bottom when messages change
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selectChat = (id) => {
    dispatch(selectChatAction(id))
    // close mobile sidebar after selecting a chat
    setSidebarOpen(false)
  }

  const newChat = () => {
    dispatch(newChatAction())
    setSidebarOpen(false)
  }

  const sendMessage = () => {
  const text = input.trim();
  if (!text) return;

  // Create user message
  const userMsg = {
    id: makeId(),
    sender: "user",
    text,
    ts: Date.now(),
  };

  // Dispatch to store
  dispatch(addMessageAction({ chatId: activeChatId, message: userMsg }));

  // Clear input
  setInput("");

  // Simulated AI response (replace with API later)
  simulateAiResponse(text);
};

const simulateAiResponse = (prompt) => {
  setTimeout(() => {
    const aiMsg = {
      id: makeId(),
      sender: "ai",
      text: `🤖 Here's a simulated AI reply to: "${prompt}"`,
      ts: Date.now(),
    };
    dispatch(addMessageAction({ chatId: activeChatId, message: aiMsg }));
  }, 700);
};

const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

  return (
    <div className="chat-app">
      <Sidebar chats={chats} activeChatId={activeChatId} onSelectChat={selectChat} onNewChat={newChat} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* backdrop for mobile when sidebar open */}
      {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}

      <main className="chat-panel">
        <ChatHeader title={(chats.find((c) => c.id === activeChatId) || {}).title || 'Chat'} onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <Messages messages={messages} messagesEndRef={messagesEndRef} />

        <Composer input={input} setInput={setInput} onSend={sendMessage} onKeyDown={handleKeyDown} />
      </main>
    </div>
  )
}

export default Home
