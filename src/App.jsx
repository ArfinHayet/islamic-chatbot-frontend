import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

const API_URL = 'https://islamic-chatbot-lac.vercel.app/api/v1/chat/stream'
const USER_ID = 'user123'

function BotIcon() {
  return (
    <div className="avatar bot-avatar">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#10a37f" />
        <path d="M8 12.5C8 10.567 9.567 9 11.5 9h1C14.433 9 16 10.567 16 12.5S14.433 16 12.5 16h-1C9.567 16 8 14.433 8 12.5z" fill="white" />
        <circle cx="10" cy="12" r="1" fill="#10a37f" />
        <circle cx="14" cy="12" r="1" fill="#10a37f" />
        <path d="M12 7V5M10 7.5l-1-1.5M14 7.5l1-1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function UserIcon() {
  return (
    <div className="avatar user-avatar">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" fill="white" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span /><span /><span />
    </div>
  )
}

function Message({ msg }) {
  return (
    <div className={`message-row ${msg.role}`}>
      {msg.role === 'assistant' ? <BotIcon /> : <UserIcon />}
      <div className="bubble">
        {msg.content}
        {msg.streaming && <TypingIndicator />}
      </div>
    </div>
  )
}

function App() {
  const [messages, setMessages] = useState([
    { id: 0, role: 'assistant', content: 'আসসালামু আলাইকুম! আমি একটি ইসলামিক AI চ্যাটবট। আপনার যেকোনো প্রশ্ন করুন।', streaming: false },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg = { id: Date.now(), role: 'user', content: text, streaming: false }
    const assistantId = Date.now() + 1
    const assistantMsg = { id: assistantId, role: 'assistant', content: '', streaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsLoading(true)
    textareaRef.current?.style && (textareaRef.current.style.height = 'auto')

    abortRef.current = new AbortController()

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, message: text }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error(`HTTP error ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        const clean = accumulated
          .split('\n')
          .filter(line => line.startsWith('data:'))
          .map(line => line.replace(/^data:\s*/, ''))
          .filter(line => line && line !== '[DONE]')
          .map(line => {
            try {
              const parsed = JSON.parse(line)
              return parsed.content ?? parsed.text ?? parsed.delta ?? parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.text ?? line
            } catch {
              return line
            }
          })
          .join('')

        if (clean) {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, content: clean } : m
            )
          )
        } else if (!clean && accumulated.replace(/\n/g, '').length > 0) {
          const raw = accumulated.replace(/data:\s*/g, '').trim()
          if (raw && raw !== '[DONE]') {
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId ? { ...m, content: raw } : m
              )
            )
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।', streaming: false }
              : m
          )
        )
      }
    } finally {
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      )
      setIsLoading(false)
    }
  }, [input, isLoading])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  const handleStop = () => {
    abortRef.current?.abort()
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <circle cx="12" cy="12" r="10" fill="#10a37f" />
              <path d="M8 12.5C8 10.567 9.567 9 11.5 9h1C14.433 9 16 10.567 16 12.5S14.433 16 12.5 16h-1C9.567 16 8 14.433 8 12.5z" fill="white" />
              <circle cx="10" cy="12" r="1" fill="#10a37f" />
              <circle cx="14" cy="12" r="1" fill="#10a37f" />
              <path d="M12 7V5M10 7.5l-1-1.5M14 7.5l1-1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>Islamic AI Chatbot</span>
          </div>
        </div>
      </header>

      <main className="chat-area">
        <div className="messages">
          {messages.map(msg => (
            <Message key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-input"
            rows={1}
            placeholder="একটি বার্তা লিখুন..."
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={`send-btn ${isLoading ? 'stop' : ''}`}
            onClick={isLoading ? handleStop : sendMessage}
            aria-label={isLoading ? 'Stop' : 'Send'}
          >
            {isLoading ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
        <p className="disclaimer">এই চ্যাটবট ইসলামিক বিষয়ে তথ্য প্রদান করে। সর্বদা বিশেষজ্ঞ আলেমের পরামর্শ নিন।</p>
      </footer>
    </div>
  )
}

export default App
