import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "../services/socket";
import { useAuth } from "./useAuth";

export function useSocket() {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(getSocket());

  useEffect(() => {
    setSocket(getSocket());
  }, [token]);

  return socket;
}
