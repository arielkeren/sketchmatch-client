"use client";

import OpponentCanvas from "@/app/components/OpponentCanvas";
import PlayerCanvas from "@/app/components/PlayerCanvas";
import Header from "@/app/components/Header";
import useDisableContextMenu from "@/app/hooks/useDisableContextMenu";
import useServer from "@/app/hooks/useServer";
import { useEffect, useRef, useState } from "react";
import { isGuessResponse, isMatchResponse, Word } from "@/app/types";
import WaitingForOpponent from "@/app/components/WaitingForOpponent";
import GameScreen from "@/app/components/GameScreen";
import useAuth from "@/app/hooks/useAuth";
import SketchInfo from "@/app/components/SketchInfo";
import Ready from "@/app/components/Ready";
import RoundInfo from "@/app/components/RoundInfo";
import GameManager from "@/app/components/GameManager";

const Match: React.FC = () => {
  const [word, setWord] = useState<Word | null>(null);
  const [guess, setGuess] = useState<Word | null>(null);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isStopped, setIsStopped] = useState(true);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const server = useServer();
  const user = useAuth();
  useDisableContextMenu();

  const readyUp = () => {
    if (!server) return;
    setIsReady(true);
    server.emit("ready");
  };

  useEffect(() => {
    if (!server || server.disconnected) return;

    const username = localStorage.getItem("username");
    if (username !== null) {
      setOpponent(username);
      localStorage.removeItem("username");
    }

    server.on("join", data => setOpponent(data.username));
    server.on("ready", () => setIsOpponentReady(true));
    server.on("start", data => {
      setWord(data.word);
      setIsStopped(false);
    });
    server.on("win", () => {
      setOpponentScore(prevScore => prevScore + 1);
      endRound(false);
    });
  }, [server]);

  const endRound = (isWin: boolean) => {
    setIsReady(false);
    setIsOpponentReady(false);
    setWord(null);
    setGuess(null);
    setRound(prevRound => prevRound + 1);
    setTimeLeft(30);
    setIsStopped(true);

    if (isWin) setScore(prevScore => prevScore + 1);
  };

  return (
    <>
      <Header />

      {!isStopped && (
        <>
          <SketchInfo word={word!} guess={guess} isCentered={true} />
          <RoundInfo round={round} timeLeft={timeLeft} />
          <GameManager
            canvas={canvas}
            word={word!}
            timeLeft={timeLeft}
            setGuess={setGuess}
            setTimeLeft={setTimeLeft}
            endRound={endRound}
          />
        </>
      )}

      <div className="flex" style={{ height: "calc(100vh - 96px)" }}>
        <GameScreen username={user.username} score={score} isLeft={true}>
          {!isStopped ? (
            <PlayerCanvas canvas={canvas} />
          ) : opponent !== null ? (
            <Ready isReady={isReady} readyUp={readyUp} />
          ) : null}
        </GameScreen>

        {opponent === null ? (
          <WaitingForOpponent />
        ) : (
          <GameScreen username={opponent} score={opponentScore} isLeft={false}>
            {!isStopped ? (
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
