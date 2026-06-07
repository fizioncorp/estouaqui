import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";

export function ChatWindow({
  messages,
  currentUserId
}: {
  messages: ChatMessage[];
  currentUserId: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  return (
    <div
      ref={ref}
      className="flex h-[52vh] flex-col gap-3 overflow-y-auto rounded-4xl bg-mist/70 p-4"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
