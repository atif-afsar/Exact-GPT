import React from 'react'

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, sidebarOpen, setSidebarOpen }) => {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-dot" aria-hidden></span>
          <strong>ChatGPT</strong>
        </div>
        <button
          className="btn small new-chat"
          onClick={() => {
            onNewChat()
            setSidebarOpen(false)
          }}
          aria-label="New chat"
        >
          + New
        </button>
      </div>

      <ul className="chats-list">
        {chats.map((c) => (
          <li
            key={c.id}
            className={`chat-item ${c.id === activeChatId ? 'active' : ''}`}
            onClick={() => {
              onSelectChat(c.id)
              setSidebarOpen(false)
            }}
          >
            <div className="chat-title">{c.title || 'Untitled'}</div>
            <div className="chat-preview">{c.messages.length ? c.messages[c.messages.length - 1].text.slice(0, 60) : 'No messages yet'}</div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
