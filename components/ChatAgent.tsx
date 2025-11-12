"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ChatAgent = () => {
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
      }, 1500);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const generateAgentResponse = (userMessage: string): string => {
    const responses = [
      "That's an interesting business challenge. Let me help you think through some potential solutions and strategies.",
      "Based on your question, I'd recommend focusing on a few key areas: market analysis, operational efficiency, and strategic planning.",
      "Great question! In my experience with similar business situations, here are some approaches that have proven effective...",
      "Let's break this down systematically. First, we should consider your current position, then identify opportunities for improvement.",
      "I understand your concern. This is a common challenge many businesses face. Here's how I'd approach it...",
      "That's a strategic question that requires careful consideration of multiple factors including market conditions, resources, and timing."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Business Consulting Agent
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            Your AI business consultant
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <p className="text-lg font-medium mb-2">Welcome to your Business Consultant!</p>
                <p>I'm here to help you with strategic planning, market analysis, operational improvements, and more. What business challenge can I help you with today?</p>
              </div>
            )}
            
            {messages.reverse().map((msg: Message) => (
              <div
                key={msg._id}
                className={`flex gap-3 ${
                  msg.messageType === "agent" ? "justify-start" : "justify-end"
                }`}
              >
                {msg.messageType === "agent" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.messageType === "agent"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
                
                {msg.messageType !== "agent" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-blue-100">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Agent is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about your business strategy, market analysis, operations, or any other business challenge..."
              className="flex-1 min-h-[60px] max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-[60px] w-12"
              disabled={!message.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatAgent;