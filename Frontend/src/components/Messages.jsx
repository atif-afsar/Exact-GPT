import React from 'react'

const Messages = ({ messages, messagesEndRef }) => {
  if (!messages || messages.length === 0) {
    return (
      <section className="messages welcome" aria-live="polite">
        <div className="welcome-card" role="region" aria-label="Welcome">
          <h2>Hey — How's it going?</h2>
          <p className="muted">Send a message to start a conversation or click "+ New" in the sidebar to begin.</p>
          <div className="welcome-examples">
            <div className="chip">Ask a question</div>
            <div className="chip">Summarize some text</div>
            <div className="chip">Generate ideas</div>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </section>
    )
  }

  return (
    <section className="messages" aria-live="polite">
      {messages.map((m) => (
        <div key={m.id} className={`message-row ${m.sender === 'user' ? 'message-user' : 'message-ai'}`}>
          <div className="bubble">
            <div className="bubble-text">{m.text}</div>
            <div className="bubble-footer">
              <span className="ts">{new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {m.sender === 'ai' && (
                <span className="actions" aria-hidden>
                  <button className="icon small">📋</button>
                  <button className="icon small">👍</button>
                  <button className="icon small">👎</button>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </section>
  )
}

export default Messages
