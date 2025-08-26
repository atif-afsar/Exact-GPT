import React, { useEffect, useRef, useState } from 'react'
import '../styles/theme.css'
import Sidebar from '../components/Sidebar'
import ChatHeader from '../components/ChatHeader'
import Messages from '../components/Messages'
import Composer from '../components/Composer'

const makeId = () => Math.random().toString(36).slice(2, 9)

const defaultChats = [
  {
    id: makeId(),
    title: 'Welcome Chat',
    messages: [
      { id: makeId(), sender: 'ai', text: 'Hi — send a message to start the conversation.', ts: Date.now() },
    ],
  },
]

const Home = () => {
  // Requirements: state variables for previous chats, current chat messages, and user input
  const [chats, setChats] = useState(defaultChats)
  const [activeChatId, setActiveChatId] = useState(chats[0].id)
  const [messages, setMessages] = useState(chats[0].messages)
  const [input, setInput] = useState('')

  const messagesEndRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // sync active chat messages whenever activeChatId or chats change
    const active = chats.find((c) => c.id === activeChatId)
    setMessages(active ? active.messages : [])
  }, [activeChatId, chats])

  useEffect(() => {
    // scroll to bottom when messages change
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selectChat = (id) => {
    setActiveChatId(id)
    // close mobile sidebar after selecting a chat
    setSidebarOpen(false)
  }

  const newChat = () => {
    const chat = { id: makeId(), title: 'New Chat', messages: [] }
    setChats((s) => [chat, ...s])
    setActiveChatId(chat.id)
    setSidebarOpen(false)
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: makeId(), sender: 'user', text, ts: Date.now() }

    // update messages locally
    setMessages((m) => [...m, userMsg])

    // update chats store
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c
        return { ...c, messages: [...c.messages, userMsg], title: c.title === 'New Chat' ? text.slice(0, 40) || 'New Chat' : c.title }
      }),
    )

    setInput('')

    // Simulated AI response (replace with real API call later)
    setTimeout(() => {
      const aiText = `This is a simulated AI response to: "${text}"`
      const aiMsg = { id: makeId(), sender: 'ai', text: aiText, ts: Date.now() }
      setMessages((m) => [...m, aiMsg])
      setChats((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c)))
    }, 700)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
