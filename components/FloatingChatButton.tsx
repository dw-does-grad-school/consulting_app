"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MiniChatAgent from "./MiniChatAgent";

const FloatingChatButton = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const handleChatClick = () => {
    // On mobile (below md breakpoint), navigate to chat page
    if (window.innerWidth < 768) {
      router.push("/chat");
    } else {
      // On desktop/tablet, toggle popup
      setIsPopupOpen(!isPopupOpen);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button - Hidden when popup is open */}
      {!isPopupOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleChatClick}
            size="lg"
            variant="neo-primary"
            className="h-14 w-14 rounded-2xl neo-shadow-lg transition-all duration-200 group"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      )}

      {/* Desktop/Tablet Popup */}
      {isPopupOpen && (
        <div className="fixed bottom-24 right-6 z-40 hidden md:block">
          <Card className="w-96 h-[500px] neo-card animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
            <CardHeader className="border-b-4 border-black pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-black">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse neo-border"></div>
                  Business Consultant
                </CardTitle>
                <Button
                  variant="neo"
                  size="sm"
                  onClick={closePopup}
                  className="h-8 w-8 p-0 bg-red-400 hover:bg-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm font-medium text-black">
                Get instant business advice & strategic insights! 🎯
              </p>
            </CardHeader>
            <CardContent className="p-0 h-[420px]">
              {/* Mini Chat Component */}
              <div className="h-full">
                <MiniChatAgent />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop for popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-30 hidden md:block"
          onClick={closePopup}
        />
      )}
    </>
  );
};

export default FloatingChatButton;