import React from 'react'

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Composer = ({ input, setInput, onSend, onKeyDown }) => {
  return (
    <div className="composer">
      <div className="composer-inner">
        <textarea
          className="input"
          placeholder="Type a message and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />

        <button className={`btn send${!input.trim() ? ' disabled' : ''}`} onClick={onSend} disabled={!input.trim()} aria-label="Send message">
          <span className="icon" aria-hidden>
            <SendIcon />
          </span>
          <span className="label">Send</span>
        </button>
      </div>
    </div>
  )
}

export default Composer
