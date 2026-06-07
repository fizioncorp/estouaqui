import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatWindow } from "../components/chat/ChatWindow";
import { MessageInput } from "../components/chat/MessageInput";
import { AppShell } from "../components/layout/AppShell";
import { PlatformLimitNotice } from "../components/safety/PlatformLimitNotice";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import type { ChatMessage, ConversationDetail } from "../types/chat";
import { api } from "../services/api";

export function ChatPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("ABUSE");
  const [reportDescription, setReportDescription] = useState("");
  const [error, setError] = useState("");

  async function loadConversation() {
    const { data } = await api.get<ConversationDetail>(`/conversations/${id}`);
    setConversation(data);
    setMessages(data.messages);
  }

  useEffect(() => {
    loadConversation().catch(() => {
      setError("Não foi possível carregar a conversa.");
    });
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("join_conversation", id);

    const handleReceiveMessage = (message: ChatMessage) => {
      if (message.conversationId === id) {
        setMessages((current) => [...current, message]);
      }
    };

    const handleClosed = ({ conversationId }: { conversationId: string }) => {
      if (conversationId === id) {
        loadConversation();
      }
    };

    const handleSocketError = ({ message }: { message: string }) => {
      setError(message);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("conversation_closed", handleClosed);
    socket.on("error_message", handleSocketError);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("conversation_closed", handleClosed);
      socket.off("error_message", handleSocketError);
    };
  }, [id, socket]);

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-forest">Conversa segura</h1>
            <p className="text-sm leading-7 text-ink/75">
              Este espaço é de apoio humano e não substitui atendimento profissional.
            </p>
          </div>
          {error && <Alert tone="danger">{error}</Alert>}
          <ChatWindow messages={messages} currentUserId={user.id} />
          {conversation?.status === "ACTIVE" ? (
            <MessageInput
              onSend={(content) => {
                socket?.emit("send_message", { conversationId: id, content });
              }}
            />
          ) : (
            <Alert tone="success">
              Esta conversa foi encerrada. Conversas encerradas não aceitam novas mensagens.
            </Alert>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <PlatformLimitNotice />
            <Button
              fullWidth
              onClick={async () => {
                await api.post(`/conversations/${id}/close`);
                await loadConversation();
              }}
            >
              Encerrar conversa
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setReportOpen(true)}>
              Denunciar conversa
            </Button>
            {(user.role === "VOLUNTEER" || user.role === "ADMIN") && (
              <Button
                variant="danger"
                fullWidth
                onClick={async () => {
                  await api.post(`/conversations/${id}/escalate`);
                  await loadConversation();
                }}
              >
                Escalonar para admin
              </Button>
            )}
            <Button variant="secondary" fullWidth onClick={() => navigate("/aguardando")}>
              Voltar
            </Button>
          </Card>

          <Card className="space-y-3">
            <h2 className="text-xl font-semibold text-forest">Encerramento</h2>
            <p className="text-sm leading-7 text-ink/75">
              Você se sentiu ouvido? A conversa ajudou? Pense em uma pequena ação
              segura para o agora: beber água, respirar, avisar alguém de confiança
              ou procurar ajuda profissional.
            </p>
          </Card>
        </div>
      </div>

      <Modal title="Registrar denúncia" open={reportOpen} onClose={() => setReportOpen(false)}>
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Motivo</span>
            <Select value={reportReason} onChange={(event) => setReportReason(event.target.value)}>
              <option value="ABUSE">Abuso</option>
              <option value="HARASSMENT">Assédio</option>
              <option value="UNSAFE_ADVICE">Orientação insegura</option>
              <option value="SPAM">Spam</option>
              <option value="PERSONAL_DATA_REQUEST">Pedido de dados pessoais</option>
              <option value="OTHER">Outro</option>
            </Select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Descrição</span>
            <Textarea
              value={reportDescription}
              onChange={(event) => setReportDescription(event.target.value)}
            />
          </label>
          <Button
            fullWidth
            onClick={async () => {
              await api.post("/reports", {
                conversationId: id,
                reason: reportReason,
                description: reportDescription
              });
              setReportOpen(false);
              await loadConversation();
            }}
          >
            Enviar denúncia
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
