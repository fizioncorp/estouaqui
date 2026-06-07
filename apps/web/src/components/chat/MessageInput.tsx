import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";

export function MessageInput({ onSend }: { onSend: (content: string) => void }) {
  const [content, setContent] = useState("");

  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 ring-1 ring-forest/10">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Escreva sua mensagem com calma. Evite compartilhar telefone, e-mail, links ou dados pessoais."
        className="min-h-[96px]"
      />
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (!content.trim()) return;
            onSend(content);
            setContent("");
          }}
        >
          <Send className="mr-2 inline h-4 w-4" />
          Enviar
        </Button>
      </div>
    </div>
  );
}
