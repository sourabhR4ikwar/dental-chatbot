'use client'

import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! How can I help you today?' }])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: newMessages }),
    })

    const data = await res.json()
    setMessages([...newMessages, { role: 'assistant', content: data.reply }])
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <div className="space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block p-2 rounded-xl ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-100'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}
