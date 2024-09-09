"use client";

import OpponentCanvas from "@/app/components/OpponentCanvas";
import PlayerCanvas from "@/app/components/PlayerCanvas";
import Header from "@/app/components/Header";
import useDisableContextMenu from "@/app/hooks/useDisableContextMenu";
import useServer from "@/app/hooks/useServer";
import { useEffect, useState } from "react";
import { isMatchResponse } from "@/app/types";
import WaitingForOpponent from "@/app/components/WaitingForOpponent";
import GameScreen from "@/app/components/GameScreen";
import useAuth from "@/app/hooks/useAuth";
import SketchInfo from "@/app/components/SketchInfo";
import Ready from "@/app/components/Ready";

const Match: React.FC = () => {
  const [opponent, setOpponent] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);
  const server = useServer();
  const user = useAuth();
  useDisableContextMenu();

  useEffect(() => {
    if (!server) return;

    const username = localStorage.getItem("username");
    if (username !== null) {
      setOpponent(username);
      localStorage.removeItem("username");
    }

    server.onmessage = event => {
      const data = JSON.parse(event.data);
      if (!isMatchResponse(data)) return;
      if (data.type === "join") setOpponent(data.username);
      if (data.type === "ready") setIsOpponentReady(true);
    };
  }, [server]);

  const readyUp = () => {
    if (!server) return;
    setIsReady(true);
    server.send(JSON.stringify({ type: "ready" }));
  };

  return (
    <>
      <Header />
      <SketchInfo word="broccoli" guess={null} isCentered={true} />
      <div className="flex" style={{ height: "calc(100vh - 96px)" }}>
        <GameScreen username={user.username} isLeft={true}>
          {isReady && isOpponentReady ? (
            <PlayerCanvas />
          ) : (
            <Ready isReady={isReady} readyUp={readyUp} />
          )}
        </GameScreen>

        {opponent === null ? (
          <WaitingForOpponent />
        ) : (
          <GameScreen username={opponent} isLeft={false}>
            {isReady && isOpponentReady ? (
              <OpponentCanvas />
            ) : (
              <Ready isReady={isOpponentReady} readyUp={null} />
            )}
          </GameScreen>
        )}
      </div>
    </>
  );
};

export default Match;
