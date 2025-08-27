import React from 'react'

const ChatHeader = ({ title, onToggleSidebar }) => {
  return (
    <header className="chat-header">
      <button className="mobile-toggle" onClick={onToggleSidebar} aria-label="Open chats">
        ☰
      </button>

      <div className="chat-header-main">
        <div className="chat-header-title">{title}</div>
      </div>

      <div className="chat-header-actions">
        <button className="icon-btn" aria-label="Profile">•••</button>
      </div>
    </header>
  )
}

export default ChatHeader
