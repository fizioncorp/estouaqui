import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3333", {
    autoConnect: true,
    auth: { token }
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
