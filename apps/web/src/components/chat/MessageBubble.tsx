import clsx from "clsx";
import type { ChatMessage } from "../../types/chat";

export function MessageBubble({
  message,
  currentUserId
}: {
  message: ChatMessage;
  currentUserId: string;
}) {
  const isMine = message.senderId === currentUserId;
  const isSystem = message.type !== "TEXT";

  return (
    <div className={clsx("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[85%] rounded-3xl px-4 py-3 text-sm shadow-sm",
          isSystem && "bg-sky/70 text-forest",
          !isSystem && isMine && "bg-forest text-white",
          !isSystem && !isMine && "bg-white text-ink ring-1 ring-forest/10"
        )}
      >
        <p className="mb-1 text-xs font-semibold opacity-75">
          {message.sender.displayName || message.sender.name}
        </p>
        <p className="whitespace-pre-wrap leading-6">{message.content}</p>
      </div>
    </div>
  );
}
