import { useEffect } from "react";
import { isGuessResponse, Word } from "../types";
import useServer from "../hooks/useServer";

type Props = {
  canvas: React.MutableRefObject<HTMLCanvasElement | null>;
  word: Word;
  timeLeft: number;
  setGuess: React.Dispatch<React.SetStateAction<Word | null>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  endRound: (isWin: boolean) => void;
};

const GameManager: React.FC<Props> = ({
  canvas,
  word,
  timeLeft,
  setGuess,
  setTimeLeft,
  endRound,
}) => {
  const server = useServer();

  useEffect(() => {
    const guessTimer = setInterval(guessSketch, 5000);
    const roundTimer = setInterval(updateTime, 1000);

    function updateTime() {
      setTimeLeft(prevTime => {
        if (prevTime === 0) {
          clearInterval(roundTimer);
          clearInterval(guessTimer);
          return 0;
        }

        return prevTime - 1;
      });
    }

    async function guessSketch() {
      if (!canvas.current || !server || server.disconnected) return;

      canvas.current.toBlob(async blob => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "drawing.png");

        const response = await fetch("http://127.0.0.1:8000/", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!isGuessResponse(data)) return;

        setGuess(data.guess);
        if (data.guess == word) {
          clearInterval(roundTimer);
          clearInterval(guessTimer);
          endRound(true);
        }
      }, "image/jpg");
    }

    return () => {
      clearInterval(roundTimer);
      clearInterval(guessTimer);
    };
  }, [canvas, server, word, setGuess, setTimeLeft, endRound]);

  useEffect(() => {
    if (timeLeft === 0) endRound(false);
  }, [timeLeft, endRound]);

  return <></>;
};

export default GameManager;
