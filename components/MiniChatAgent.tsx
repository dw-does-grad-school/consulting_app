"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";

interface Message {
  _id: string;
  user: string;
  body: string;
  timestamp: any;
  messageType?: "user" | "agent";
}

const MiniChatAgent = () => {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.chat.getMessages) || [];
  const sendMessage = useMutation(api.chat.sendMessage);
  const sendAgentResponse = useMutation(api.chat.sendAgentResponse);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      // Send user message
      await sendMessage({
        user: user.fullName || user.firstName || "Anonymous",
        body: userMessage,
        messageType: "user"
      });

      // Generate agent response (simulated for now)
      const agentResponse = generateAgentResponse(userMessage);
      
      // Send agent response after a delay
      setTimeout(async () => {
        await sendAgentResponse({
          body: agentResponse,
          inResponseTo: userMessage
        });
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const generateAgentResponse = (userMessage: string): string => {
    const responses = [
      "Great question! Let me help you with that business challenge.",
      "I'd recommend focusing on market analysis and strategic planning for this.",
      "That's a common issue. Here's what I suggest...",
      "Let's break this down into actionable steps.",
      "Based on best practices, here's my recommendation...",
      "I can help you develop a strategy for that."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg border-2 border-gray-300 mb-3">
                <Bot className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium mb-1 text-gray-700">Hi there! 👋</p>
              <p className="text-xs text-gray-500">What business question can I help you with?</p>
            </div>
          )}
          
          {messages.reverse().map((msg: Message) => (
            <div
              key={msg._id}
              className={`flex gap-2 ${
                msg.messageType === "agent" ? "justify-start" : "justify-end"
              }`}
            >
              {msg.messageType === "agent" && (
                <Avatar className="h-6 w-6 mt-1 shrink-0 neo-border">
                  <AvatarFallback className="bg-cyan-400 text-xs">
                    <Bot className="h-3 w-3 text-black" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] px-3 py-2 text-xs font-medium neo-border neo-shadow ${
                  msg.messageType === "agent"
                    ? "bg-cyan-100 text-black rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm"
                    : "bg-yellow-300 text-black rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.body}</p>
                <p className="text-[10px] opacity-70 mt-1 font-normal">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
              
              {msg.messageType !== "agent" && (
                <Avatar className="h-6 w-6 mt-1 shrink-0 neo-border">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-yellow-300 text-xs">
                    <User className="h-3 w-3 text-black" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <Avatar className="h-6 w-6 mt-1 neo-border">
                <AvatarFallback className="bg-cyan-400">
                  <Bot className="h-3 w-3 text-black" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-cyan-100 neo-border neo-shadow px-3 py-2 max-w-[80%] rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-black font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-start">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about strategy, operations, markets..."
            className="flex-1 min-h-10 max-h-25 resize-none text-sm border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            disabled={isLoading}
            rows={1}
            style={{ 
              overflow: 'hidden',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="h-10 w-10 p-0 shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!message.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MiniChatAgent;