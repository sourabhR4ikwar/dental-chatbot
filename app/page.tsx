"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! Welcome to Smile Dental Care 🦷 How can I help you today.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    try {
      // Add the loading indicator to the messages
      setMessages([...newMessages, { role: "assistant", content: "", isLoading: true }])

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      // Replace the loading message with the actual response
      setMessages([...newMessages, { role: "assistant", content: data.reply }])
    } catch (error) {
      console.error("Error sending message:", error)
      // Show error message if request fails
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#9333ea] text-white p-4 shadow-md flex-shrink-0">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="rounded-full bg-white p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                fill="#9333ea"
              />
              <path
                d="M19.5 12C19.5 13.3807 19.0978 14.7279 18.3553 15.8817C17.6129 17.0356 16.5652 17.9446 15.3326 18.4698C14.0999 18.9951 12.7407 19.1118 11.4349 18.8052C10.1291 18.4986 8.94288 17.7842 8.03726 16.7574C7.13164 15.7305 6.54375 14.4354 6.35663 13.0526C6.16951 11.6698 6.39093 10.2647 6.99216 9.00739C7.59339 7.75005 8.54589 6.69248 9.73322 5.95635C10.9206 5.22023 12.2904 4.83333 13.6875 4.83333"
                stroke="#9333ea"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M16.5 7.5L19.5 4.5" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M16.5 4.5H19.5V7.5"
                stroke="#9333ea"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Smile Dental Care</h1>
        </div>
      </header>

      {/* Chat Container - Fixed height with flex layout */}
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full p-4 overflow-hidden">
        {/* Messages area - Scrollable */}
        <div className="flex-1 overflow-y-auto mb-4 pr-1 pb-2">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl",
                    msg.role === "user"
                      ? "bg-[#9333ea] text-white rounded-tr-none"
                      : "bg-white border border-gray-200 rounded-tl-none shadow-sm",
                  )}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 rounded-full bg-[#9333ea] animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-[#9333ea] animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-[#9333ea] animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">Typing</span>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex gap-2 flex-shrink-0">
          <Input
            className="flex-1 focus-visible:ring-[#9333ea]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-[#9333ea] hover:bg-[#7e22ce]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-4 flex-shrink-0">
          Book your dental appointment quickly and easily
        </div>
      </div>
    </div>
  )
}

