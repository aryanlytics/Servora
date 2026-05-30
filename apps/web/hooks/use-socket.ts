"use client";

import { useEffect, useRef } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuth } from "./use-auth";
import type { Socket } from "socket.io-client";

export interface UseSocketReturn {
  socket: Socket | null;
  emit: (event: string, ...args: any[]) => void;
}

export function useSocket(): UseSocketReturn {
  const { accessToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (accessToken) {
      socketRef.current = getSocket(accessToken);
    } else {
      disconnectSocket();
      socketRef.current = null;
    }

    return () => {
      // Standard cleanup on unmount
    };
  }, [accessToken]);

  const emit = (event: string, ...args: any[]) => {
    if (socketRef.current) {
      socketRef.current.emit(event, ...args);
    }
  };

  return {
    socket: socketRef.current,
    emit,
  };
}

