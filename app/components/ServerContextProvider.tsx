"use client";

import { createContext, useState, useEffect } from "react";

export const ServerContext = createContext<WebSocket | null>(null);

type Props = {
  children: React.ReactNode;
};

const ServerContextProvider: React.FC<Props> = ({ children }) => {
  const [server, setServer] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setServer(ws);

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      )
        ws.close();
    };
  }, []);

  return (
    <ServerContext.Provider value={server}>{children}</ServerContext.Provider>
  );
};

export default ServerContextProvider;
