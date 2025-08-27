import React from 'react'

const Messages = ({ messages, messagesEndRef }) => {
  if (!messages || messages.length === 0) {
    return (
      <section className="messages welcome" aria-live="polite">
        <div className="welcome-card" role="region" aria-label="Welcome">
          <h2>Hey — How's it going?</h2>
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
  {messages.map((m) => {
    const isUser = m.sender === "user";
    const time = new Date(m.ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div
        key={m.id}
        className={`message-row ${isUser ? "message-user" : "message-ai"}`}
      >
        <div className="bubble">
          <p className="bubble-text">{m.text}</p>

          <div className="bubble-footer">
            <time className="ts" dateTime={new Date(m.ts).toISOString()}>
              {time}
            </time>

            {!isUser && (
              <div className="actions" role="group" aria-label="AI message actions">
                <button
                  className="icon small"
                  title="Copy message"
                  aria-label="Copy message"
                >
                  📋
                </button>
                <button
                  className="icon small"
                  title="Like message"
                  aria-label="Like message"
                >
                  👍
                </button>
                <button
                  className="icon small"
                  title="Dislike message"
                  aria-label="Dislike message"
                >
                  👎
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef} />
</section>

  )
}

export default Messages
