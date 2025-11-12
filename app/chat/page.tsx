import ChatAgent from "@/components/ChatAgent";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Business Consulting Agent</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get expert business advice and strategic insights from our AI-powered consulting agent. 
          Ask questions about strategy, operations, market analysis, and more.
        </p>
      </div>
      
      <ChatAgent />
    </div>
  );
}